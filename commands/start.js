const BaseCommand = require('./base');

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
            text: 'Hello send email',
        });

        this.action('startMessageListener', {
            cmd: this,
            1: 'emailSync',
            2: 'test'
        });
    }

    emailSync(msg) {
        console.log(msg.text);
        this.action('sendMessage', {
            chat_id: msg.chat.id,
            text: 'Ok, i synch you, please wait!',
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'Yes i use Moniheal', callback_data: 'obg'},
                        {text: 'No, i want to registered', url: 'https://moi.health'}
                    ]
                ]
            }
        })
    }

    test(msg) {
        this.action('sendMessage', {
            chat_id: msg.chat.id,
            text: 'Part 2!'
        })
    }
}

module.exports = StartCommand;