const BaseCommand = require('./baseCommand');

class StartCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/start\s?(.+)?/;
        this.name = '/start';
        this.description = 'Start command';
        this.userRepository = container.get('userRepository');
    }

    async execute(msg) {
        await this.userRepository.makeUser(msg.from);
        this.action('sendMessage',{
            chat_id: msg.chat.id,
            text: this.trans.get('start_hello', msg, {'%firstName%': msg.from.first_name}),
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: this.trans.get('button_start_student', msg), callback_data: 'registration role student'},
                        {text: this.trans.get('button_start_teacher', msg), callback_data: 'registration role teacher'},
                        {text: this.trans.get('button_menu_entrants', msg), callback_data: 'registration role entrants'}
                    ],
                    [{text: this.trans.get('url_lntu', msg), url: process.env.URL_LNTU}]
                ]
            }
        });
    }
}

module.exports = StartCommand;

