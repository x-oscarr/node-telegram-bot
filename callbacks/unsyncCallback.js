baseCallback = require('./baseCallback');

class UnsyncCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^unsync\s?(yes)?/;
        this.redis = container.get('botRedis');
        this.userTelegramRepository = container.get('userTelegramRepository');
    }

    async execute(msg, match) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        if(match[1]) {
            await this.userTelegramRepository.unsync(msg.from);
            this.action('editMessageText', {
                message_id: msg.message.message_id,
                chat_id: msg.from.id,
                text: this.trans.get('command_unsynchronisation', msg)
            });
        }
        else {
            this.action('editMessageText', {
                message_id: msg.message.message_id,
                chat_id: msg.from.id,
                text: this.trans.get('command_unsynchronisation_are_you_sure', msg),
                reply_markup: { inline_keyboard: [
                    [
                        {text: this.trans.get('button_yes', msg), callback_data: 'unsync yes'},
                        {text: this.trans.get('button_no', msg), callback_data: 'close'}
                    ]
                ]}
            });
        }
    }
}

module.exports = UnsyncCallback;