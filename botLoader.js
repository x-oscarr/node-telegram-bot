const StartCommand = require('./commands/start');

class BotLoader {
    constructor(container) {
        this.bot = container.get('bot');
        this.list = [
            container.get('/start')
        ];
    }

    run() {
        const {bot, list} = this;
        list.forEach((item) => {
            bot.onText(item.regex, (msg, match) => {
                // Command execute
                item.execute(msg, match);
            });
        })
    }
}

module.exports = BotLoader;