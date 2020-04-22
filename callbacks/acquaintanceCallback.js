baseCallback = require('./baseCallback');

class AcquaintanceCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^acquaintance/;
    }

    async execute(msg, match) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        this.action('editMessageText', {
            message_id: msg.message.message_id,
            chat_id: msg.message.chat.id,
            text: this.trans.get('acquaintance_whats_ur_name', msg)
        });
        this.action('startMessageListener', {
            msg,
            cmd: this,
            1: 'setName'
        });
    }

    async setName(msg) {
        this.action('sendMessage', {
            chat_id: msg.chat.id,
            text: this.trans.get('acquaintance_name', msg, {
                '%name%': msg.text
            })
        });
    }
}

module.exports = AcquaintanceCallback;