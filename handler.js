class Handler {
    constructor(container) {
        this.container = container;
        this.bot = container.get('bot');
        this.redis = container.get('redis');
        this.messageListener = {};
        this.cmdList = container.getOnRegexp(/^\/(.+)/);
        this.callbackList = container.getOnRegexp(/^&(.+)/);
    }

    run() {
        const {bot, cmdList, callbackList} = this;
        cmdList.forEach((item) => {
            bot.onText(item.regex, (msg, match) => {
                // Command execute
                item.execute(msg, match);
            });
        });

        // BUTTON CALLBACK SYSTEM
        this.bot.on('callback_query', (callback) => {
            for (let callbackObj of callbackList) {
                if(callbackObj.regex.test(callback.data)) {
                    // Callback execute
                    const match = callback.data.match(callbackObj.regex);
                    callbackObj.execute(callback, match);
                    break;
                }
            }
        });

        this.bot.on('message', (msg) => {
            const messageObj = msg.message ? msg.message : msg;
            const uid = messageObj.from.id;
            // MESSAGE LISTENER SYSTEM
            if(this.messageListener[uid]) {
                // Add message object in message listener data
                this.messageListener[uid]
                    .data[this.messageListener[uid].counter] = msg;

                // Call next method in message listener or delete message listener data if next method is not set
                const nextMethod = this.messageListener[uid]
                    .methodList[this.messageListener[uid].counter];
                if(nextMethod) {
                    this.messageListener[uid].cmd[nextMethod](msg);
                }
                else {
                    delete this.messageListener[uid];
                }
            }
        });
        if(process.env.REDIS_ENABLE === 'true') {
            this.redis.subscribe(process.env.REDIS_SUB);
        }
    }
}

module.exports = Handler;