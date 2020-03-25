baseCallback = require('./baseCallback');

class CloseCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /close\s?(.+)?/;
    }

    async execute(msg) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        this.action('deleteMessage', {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id
        })
    }
}

module.exports = CloseCallback;