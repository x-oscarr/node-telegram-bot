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

    async execute (msg, match) {

        const users = this.userRepository.findAll();
        const userslist = await users;
        userslist.forEach(user => {
           console.log(user.email);
        });
        // this.action('sendMessage',{
        //     chat_id: msg.chat.id,
        //     text: 'test sobaki',
        //     reply_markup: {
        //         inline_keyboard: [
        //         [
        //             {text: 'test', callback_data: 'obg'}
        //         ]
        //     ]}
        // });
    }
}

module.exports = StartCommand;