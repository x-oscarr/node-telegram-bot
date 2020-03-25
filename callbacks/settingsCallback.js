baseCallback = require('./baseCallback');

class SettingsCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /settings\s?(.+)?/;
        this.settingsCommand = container.get('/settings');
    }

    async execute(msg) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        const userData = msg.from;
        msg = msg.message;
        msg.from = userData;
        this.settingsCommand.init(msg, 'editMessageText', {
            message_id: msg.message_id
        });
        // this.action('deleteMessage', {
        //     chat_id: msg.message.chat.id,
        //     message_id: msg.message.message_id
        // })
    }
}

module.exports = SettingsCallback;