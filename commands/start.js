const BaseCommand = require('./baseCommand');

class StartCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/start\s?(.+)?/;
        this.name = '/start';
        this.desctiption = 'Start command';

        this.userTelegramRepository = container.get('userTelegramRepository');
        this.userRepository = container.get('userRepository');
    }

    async execute(msg, match) {
        // const users = this.userRepository.findAll();
        // const userslist = await users;
        this.action('sendMessage',{
            chat_id: msg.chat.id,
            text: this.trans.get('command_start_welcome', msg),
            reply_markup: {
                inline_keyboard: [
                    [{text: this.trans.get('button_start_yes'), callback_data: 'sync'}],
                    [{text: this.trans.get('button_start_no'), url: 'https://root7.ru'}]
                ]
            }
        });

        // this.action('startMessageListener', {
        //     cmd: this,
        //     1: 'emailSync',
        //     2: 'test'
        // });
    }

    emailSync(msg) {
        const text = msg.text;
        text.match(/[a-zA-Z1-9._-]+@[a-zA-Z1-9_.-]+.[a-zA-Z]+/);
        this.action('sendMessage', {
            chat_id: msg.chat.id,
            text: 'Ok, i synch you, please wait!',
            reply_markup: {

            }
        })

        this.action('nextMessageListener');
    }

    test(msg) {
        this.action('sendMessage', {
            chat_id: msg.chat.id,
            text: 'Part 2!'
        });
        this.action('nextMessageListener');
    }
}

module.exports = StartCommand;