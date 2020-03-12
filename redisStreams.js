const Redis = require('ioredis');
const EventEmitter = require('events');

const defaultOptions = {
    lazyConnect: false,
    serialize: JSON.stringify,
    unserialize: JSON.parse,
    // Amount of time to wait on XREAD - ideally we call client UNBLOCK on-demand, so this tunable shouldn't really matter much
    blockingInterval: 10000,
    redisOptions: { showFriendlyErrorStack: true }
};

// $FlowIssue (logger takes any number of arguments)
function logger () {
    if (process.env.RSA_DEBUG === 'true') console.log.apply(console, arguments) // eslint-disable-line
}

function RedisStreamsAggregator (options /*: optionsObjectOrString */) {
    // Stores a list of subscriptions by subscription key, with the value as Array<subscribers, offset>
    this.subscriptions = {};
    // Indicates if the read stream is currently blocked by an XREAD call
    this.readStreamActive = false;
    this.events = new EventEmitter();
    this.on = this.events.on;
    this.readId = false;
    this.calledDisconnect = false;
    // Default options
    if (typeof options === 'string') options = { host: options };
    this.options = Object.assign({}, defaultOptions, options);

    // Create redis read & write handles with debugable connection names
    const r = `${Math.floor(Math.random() * 10000000)}`;
    const readName = `read:${r}`;
    const writeName = `write:${r}`;
    this.handles = {
        read: new Redis(Object.assign(this.options, { connectionName: readName })),
        write: new Redis(Object.assign(this.options, { connectionName: writeName })),
        readName,
        writeName
    };
    logger('RedisStreamsAggregator()', { ...this.options, readName, writeName });

    // We need to retrieve the read connections "client id" so that we can call CLIENT UNBLOCK on it later
    const getReadClientId = () => {
        if (this.handles.read.status === 'connect' && this.handles.write.status === 'connect') {
            this.handles.read.client('id').then(id => {
                this.readId = id;
                this.events.emit('ready', true);
            });
        }
    };

    this.handles.write.on('connect', getReadClientId);
    this.handles.read.on('connect', getReadClientId);
    this.handles.write.on('error', err => console.error('RedisStreamsAggregator write handle error:', err));
    this.handles.read.on('error', err => console.error('RedisStreamsAggregator read handle error:', err));

    // Class methods below
    this.connect = function () {
        return new Promise((resolve, reject) => {
            if (this.calledDisconnect || (this.handles.read.status === 'ready' && this.handles.write.status === 'ready')) {
                return resolve()
            }

            const happyStates = ['connect', 'connecting', 'ready'];
            const readConnecting = happyStates.includes(this.handles.read.status);
            const writeConnecting = happyStates.includes(this.handles.write.status);
            logger('Connecting', { readStatus: this.handles.read.status, writeStatus: this.handles.write.status });

            if (!writeConnecting) this.handles.write.connect();
            if (!readConnecting) this.handles.read.connect();

            // TODO: Bind errors and reject the connect promise
            this.events.on('ready', () => resolve())
        })
    };

    this.disconnect = function () {
        return new Promise(async (resolve, reject) => {
            this.calledDisconnect = true;
            this.events.removeAllListeners();
            await this.unblock();
            this.readId = false;
            this.handles.read.on('end', async () => {
                logger('Disconnecting write handle');
                await this.handles.write.disconnect();
            });
            this.handles.write.on('end', () => resolve());
            logger('Disconnecting read handle');
            await this.handles.read.disconnect();
        })
    };

    this.unsubscribe = function (id /*: string */, onEvent /*: Function */) {
        this.events.removeListener(id, onEvent);
        if (!this.subscriptions[id]) return;
        if (this.subscriptions[id][0] > 0) this.subscriptions[id][0] -= 1;
        if (this.subscriptions[id][0] < 1) delete this.subscriptions[id];
    };

    this.subscribe = async function (id /*: string */, offset /*: string */, onEvent /*: Function */) {
        logger('Pre-Subscribe', { subscriptions: this.subscriptions, id });
        if (!this.subscriptions[id]) {
            this.subscriptions[id] = [1, offset];
            if (this.readStreamActive) await this.unblock();
            this.readStream();
        } else {
            this.subscriptions[id][0] += 1;
        }
        this.events.on(id, onEvent);
        return this.subscriptions[id][0];
    };

    this.add = async function (id /*: string */, content /*: Object */, title = 'message' /* string */, msgId = '*') {
        const body = typeof content === 'object' ? this.options.serialize(content) : content;
        logger('XADD', [id, msgId, title, body]);
        return this.handles.write.xadd(id, msgId, title, body);
    };

    this.unblock = async function () {
        logger('unblocking', [this.readId]);
        this.readStreamActive = false;
        return this.handles.write.client('unblock', this.readId);
    };

    this.readStream = async function () {
        if (typeof this.readId !== 'number') return;

        this.readStreamActive = true;
        const streamIds = [];
        const streamOffsets = [];
        for (const id in this.subscriptions) {
            streamIds.push(id);
            streamOffsets.push(this.subscriptions[id][1])
        }
        if (streamIds.length < 1) return;
        logger('XREAD', ['BLOCK', this.options.blockingInterval, 'STREAMS', ...streamIds, ...streamOffsets]);
        let messages;
        try {
            messages = await this.handles.read.xread(
                'BLOCK',
                this.options.blockingInterval,
                'STREAMS',
                ...streamIds,
                ...streamOffsets
            )
        } catch (err) {
            // If the connection is closed during an xread, thats okay, we'll just not emit any message events
            // Which is what one would expect. Errors and close events are forwarded to the user via the events emitter
            if (err.message !== 'Connection is closed.') throw err;
        }
        this.readStreamActive = false;
        if (messages) {
            for (let i = 0; i < messages.length; i++) {
                const newEventId = messages[i][0];
                if (this.subscriptions[newEventId]) {
                    const eventMessagesRaw = messages[i][1];
                    const eventMessages = eventMessagesRaw.map(r => {
                        r[1] = this.options.unserialize(r[1][1]);
                        return r;
                    });
                    this.subscriptions[newEventId][1] = eventMessages[eventMessages.length - 1][0];
                    this.events.emit(newEventId, eventMessages)
                }
            }
        }
        await this.readStream();
    };

    return this;
}

module.exports = RedisStreamsAggregator;