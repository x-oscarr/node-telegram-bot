baseCallback = require('./baseCallback');

class CabinetCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /cabinet\s?(.+)?/;
        this.cabinetCommand = container.get('/cabinet');
    }

    async execute(msg) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        const userData = msg.from;
        msg = msg.message;
        msg.from = userData;
        this.cabinetCommand.init(msg, 'editMessageText', {
            message_id: msg.message_id
        });
    }


}

module.exports = CabinetCallback;