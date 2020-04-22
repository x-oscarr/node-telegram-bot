const BaseCommand = require('./baseCommand');

class StartCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/start\s?(.+)?/;
        this.name = '/start';
        this.description = 'Start command';
    }

    async execute(msg) {
        this.action('sendMessage',{
            chat_id: msg.chat.id,
            text: this.trans.get('hello', msg),
            reply_markup: {
                inline_keyboard: [
                    [{text: this.trans.get('button_start', msg), callback_data: 'acquaintance'}],
                    [{text: this.trans.get('button_homepage', msg), url: process.env.HOMEPAGE}]
                ]
            }
        });
    }
}

module.exports = StartCommand;