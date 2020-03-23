baseCallback = require('./baseCallback');

class SyncCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /services\s([a-zA-Z]+)\s?([a-zA-Z0-9]+)?/;
        this.redis = container.get('botRedis');
        this.userRepository = container.get('userRepository');
    }

    execute(msg, match) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});

        console.log(match);

        this.action('editMessageText', {
            msg,
            text: 'test'
        });

        // this.action('startMessageListener', {
        //     msg,
        //     cmd: this,
        //     1: 'emailSync'
        // });
    }


}

module.exports = SyncCallback;