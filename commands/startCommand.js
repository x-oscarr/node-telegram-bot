const BaseCommand = require('./baseCommand');

class StartCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/start\s?(.+)?/;
        this.name = '/start';
        this.description = 'Start command';
        this.userTelegramRepository = container.get('userTelegramRepository');
    }

    async execute(msg, match) {
        const userTelegram = await this.userTelegramRepository.getTelegramUser(msg.from);
        if(!userTelegram) {
            await this.userTelegramRepository.setUser(msg);
        }
        this.action('sendMessage',{
            chat_id: msg.chat.id,
            text: this.trans.get('command_start_welcome', msg),
            reply_markup: {
                inline_keyboard: [
                    [{text: this.trans.get('button_start_yes', msg), callback_data: 'sync'}],
                    [{text: this.trans.get('button_start_no', msg), url: process.env.DOMAIN}]
                ]
            }
        });
    }
}

module.exports = StartCommand;