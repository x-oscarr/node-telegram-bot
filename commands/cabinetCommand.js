const BaseCommand = require('./baseCommand');

class CabinetCommand extends BaseCommand{
    constructor(container) {
        super(container);
        this.regex = /\/cabinet\s?(.+)?/;
        this.name = '/cabinet';
        this.description = 'Your cabinet';
        this.serviceRepository = container.get('serviceRepository');
        this.bookServiceRepository = container.get('bookServiceRepository');
        this.userRepository = container.get('userRepository');
        this.userTelegramRepository = container.get('userTelegramRepository');
    }

    async execute(msg) {
        this.init(msg, 'sendMessage');
    }

    async init(msg, typeAction, data) {
        const userTelegram = await this.userTelegramRepository.getTelegramUser(msg.from.id);
        const userData = await this.getUserData(userTelegram);
        const altRole = userTelegram.role === 'client' ? 'expert' : 'client';
        this.action(typeAction, {
            ...data,
            chat_id: msg.chat.id,
            text: 'NA PAPEI',
            reply_markup: { inline_keyboard: [
                ...this.getKeyboard(msg, userTelegram, userData),
                [
                    {text: this.trans.get(`button_cabinet_change_role_${altRole}`, msg), callback_data: `change_role ${altRole}`},
                    {text: this.trans.get('button_cabinet_settings', msg), callback_data: 'settings'},
                    {text: this.trans.get('button_close', msg), callback_data: 'close'}
                ]
            ]}
        });
    }

    async getUserData(userTelegram) {
        let data = {};
        data.activeBookService = await this.bookServiceRepository.getBookServices({
            userId: userTelegram.user_id,
            role: userTelegram.role,
            statuses: ['pending', 'accepted', 'in_progress'],
            isCount: true
        });
        data.todayBookService = await this.bookServiceRepository.getBookServices({
            userId: userTelegram.user_id,
            role: userTelegram.role,
            statuses: ['pending', 'accepted', 'in_progress'],
            startDate: new Date(),
            isCount: true
        });
        if(userTelegram.role === 'expert') {
            data.services = await this.serviceRepository.getServices({
                userId: userTelegram.user_id,
                status: 'accepted',
                isActive: true,
                isCount: true
            });
        }

        return data
    }

    getKeyboard(msg, userTelegram, userData) {
        let keyboard = [
            [{
                text: this.trans.get('button_cabinet_today_booked_services', msg, {'%count%': userData.todayBookService}),
                callback_data: `services todayBookedServices ${userTelegram.user_id}`
            }],
            [{
                text: this.trans.get('button_cabinet_active_booked_services', msg, {'%count%': userData.activeBookService}),
                callback_data: `services activeBookedServices ${userTelegram.user_id}`
            }]
        ];

        if(userTelegram.role === 'expert') {
            keyboard.push([{
                text: this.trans.get('button_cabinet_services', msg, {'%count%': userData.services}),
                callback_data: `services services ${userTelegram.user_id}`
            }]);

        }

        return keyboard;
    }
}

module.exports = CabinetCommand;