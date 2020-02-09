BaseCommand = require('./baseCommand');

class CabinetCommand extends BaseCommand{
    constructor(container) {
        super(container);
        this.regex = /\/cabinet\s?(.+)?/;
        this.name = '/cabinet';
        this.desctiption = 'Your cabinet';
    }

    execute(msg, match) {
        this.action('sendPhoto', {
            chat_id: msg.chat.id,
            photo: 'https://dev.root7.ru/vasyan.jpg'
        });
    }
}

module.exports = CabinetCommand;