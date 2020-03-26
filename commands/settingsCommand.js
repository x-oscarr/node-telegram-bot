const BaseCommand = require('./baseCommand');

class SettingsCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/settings\s?(.+)?/;
        this.name = '/settings';
        this.description = 'Settings';
        this.userTelegramRepository = container.get('userTelegramRepository');
    }

    async execute(msg) {
        await this.init(msg, 'sendMessage');
    }

    async init(msg, action, data) {
        const userTelegram = await this.userTelegramRepository.getTelegramUser(msg.from.id);
        const text = this.trans.get('command_settings_notification', msg, {
            '%notifyServices%': this.trans.get(userTelegram.notify_services ? 'settings_on' : 'settings_off', msg),
            '%notifyOrders%': this.trans.get(userTelegram.notify_orders ? 'settings_on' : 'settings_off', msg),
            '%notifyNews%': this.trans.get(userTelegram.notify_news ? 'settings_on' : 'settings_off', msg)
        });
        this.action(action, {
            ...data,
            text,
            chat_id: msg.chat.id,
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: this.keyboardBuilder(msg, userTelegram)}
        });
    }

    keyboardBuilder(msg, userTelegram) {
        const keyboard = [];
        keyboard.push(
            [{
                text: this.trans.get(`button_settings_notify_services_${userTelegram.notify_services ? 'off' : 'on'}`, msg),
                callback_data: `settings notify_services ${userTelegram.notify_services ? 'off' : 'on'}`
            }],
            [{
                text: this.trans.get(`button_settings_notify_orders_${userTelegram.notify_orders ? 'off' : 'on'}`, msg),
                callback_data: `settings notify_orders ${userTelegram.notify_orders ? 'off' : 'on'}`
            }],
            [{
                text: this.trans.get(`button_settings_notify_news_${userTelegram.notify_news ? 'off' : 'on'}`, msg),
                callback_data: `settings notify_news ${userTelegram.notify_news ? 'off' : 'on'}`
            }]
        );

        if(userTelegram.user_id) {
            keyboard.push([{
                text: this.trans.get('button_settings_unsynchronization', msg),
                callback_data: 'unsync'
            }])
        }

        keyboard.push([
            {text: this.trans.get('button_back', msg), callback_data: 'cabinet'},
            {text: this.trans.get('button_close', msg), callback_data: 'close'}
        ]);

        return keyboard;
    }
}

module.exports = SettingsCommand;