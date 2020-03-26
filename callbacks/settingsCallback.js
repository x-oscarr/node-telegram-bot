baseCallback = require('./baseCallback');

class SettingsCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^settings\s?([a-zA-Z0-9_-]+)?\s?([a-zA-Z0-9]+)?/;
        this.settingsCommand = container.get('/settings');
        this.userTelegramRepository = container.get('userTelegramRepository');
    }

    async execute(msg, match) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        const type = match[1];
        const value = match[2];

        if(type) {
            await this.userTelegramRepository.setNotify(msg.from, type, value);
        }

        const userData = msg.from;
        msg = msg.message;
        msg.from = userData;
        this.settingsCommand.init(msg, 'editMessageText', {
            message_id: msg.message_id
        });
    }
}

module.exports = SettingsCallback;