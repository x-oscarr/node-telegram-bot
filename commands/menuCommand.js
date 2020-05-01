const BaseCommand = require('./baseCommand');

class MenuCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/menu/;
        this.name = '/menu';
        this.description = 'Menu command';
    }

    async execute(msg, match) {
        this.action('sendMessage', {
            chat_id: msg.chat.id,
            text: this.trans.get('menu_select_command', msg),
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

module.exports = MenuCommand;

