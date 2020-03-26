baseCallback = require('./baseCallback');

class SyncCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^change_role\s?(.+)?/;
        this.userTelegramRepository = container.get('userTelegramRepository');
        this.cabinetCallback = container.get('&cabinet');
    }

    async execute(msg, match) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        const role = match[1];
        const userTelegram = await this.userTelegramRepository.getTelegramUser(msg.from);
        await this.userTelegramRepository.changeRole(userTelegram, role);
        return this.cabinetCallback.execute(msg);
    }


}

module.exports = SyncCallback;