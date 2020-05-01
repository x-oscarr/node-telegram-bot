baseCallback = require('./baseCallback');

class MainMenuCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^main_menu/;
    }

    async execute(msg, match) {
        this.action('editMessageText', {
            message_id: msg.message.message_id,
            chat_id: msg.message.chat.id,
            text: this.trans.get('start_choose_group', msg),
            reply_markup: this.mainKeyboard(msg)
        });
    }

    mainKeyboard(msg) {
        return {
            resize_keyboard: true,
            keyboard: [
            [
                this.trans.get('button_schedule', msg),
                this.trans.get('button_schedule_today', msg),
                this.trans.get('button_schedule_tomorrow', msg)
            ], [
                this.trans.get('button_useful_info', msg),
                this.trans.get('button_profile', msg)
            ]
        ]};
    }
}

module.exports = MainMenuCallback;