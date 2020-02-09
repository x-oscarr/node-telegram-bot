const BaseCommand = require('./baseCommand');

class HealCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/vasyan\s?(.+)?/;
        this.name = '/heal';
        this.desctiption = 'Oh my Jesus';
    }

    execute(msg, match) {
        // const users = this.userRepository.findAll();
        // const userslist = await users;
        this.action('sendPhoto', {
            chat_id: msg.chat.id,
            photo: 'https://dev.root7.ru/vasyan.jpg'
        });
    }
}

module.exports = HealCommand;