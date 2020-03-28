class BotHandler {
    constructor(container) {
        this.container = container;
        this.bot = container.get('bot');
        this.botRedis = container.get('botRedis');
        this.messageListener = {};
        this.cmdList = [
            container.get('/start'),
            container.get('/cabinet'),
            container.get('/heal'),
            container.get('/settings')
        ];

        this.callbackList = [
            container.get('&bookService'),
            container.get('&cabinet'),
            container.get('&close'),
            container.get('&changeRole'),
            container.get('&services'),
            container.get('&settings'),
            container.get('&sync'),
            container.get('&unsync')
        ]
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
            for (let callbackObj of this.callbackList) {
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

                // Call next method in message listener or delete message lisener data if next method is not set
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
        this.botRedis.subscribe(process.env.REDIS_SUB);
    }
}

module.exports = BotHandler;