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
        const user = await this.userRepository.getUserForCabinet(msg.from.id);
        this.action(typeAction, {
            ...data,
            chat_id: msg.chat.id,
            text: this.trans.get('command_cabinet_title', msg, {
                '%role%': this.roleName(msg, user),
                '%fullName%': user.full_name
            }),
            parse_mode: 'HTML',
            reply_markup: this.keyboardBuilder(msg, userTelegram, userData, user)
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

    isExpert(user) {
        const userRoles = user.roles.split(',');
        if (
            userRoles.indexOf('ROLE_EXPERT') > -1 ||
            userRoles.indexOf('ROLE_CONSULTANT') > -1 ||
            userRoles.indexOf('ROLE_MANAGER') > -1
        ) return true;
        return false;
    }

    roleName(msg, user) {
        const isExpert = this.isExpert(user);
        const userRoles = user.roles.split(',');
        if(isExpert) {
            if (userRoles.indexOf('ROLE_CONSULTANT') > -1) {
                return this.trans.get('role_consultant', msg);
            }
            else if (userRoles.indexOf('ROLE_MANAGER') > -1) {
                return this.trans.get('role_manager', msg);
            }
            return this.trans.get('role_expert', msg);
        }
        return this.trans.get('role_client', msg);
    }

    keyboardBuilder(msg, userTelegram, userData, user) {
        const altRole = userTelegram.role === 'client' ? 'expert' : 'client';
        let keyboard = [
            [{
                text: this.trans.get('button_cabinet_today_booked_services', msg, {'%count%': userData.todayBookService}),
                callback_data: `services todayBookedServices`
            }],
            [{
                text: this.trans.get('button_cabinet_active_booked_services', msg, {'%count%': userData.activeBookService}),
                callback_data: `services activeBookedServices`
            }]
        ];

        let tools = [
            [
                {text: this.trans.get('button_cabinet_settings', msg), callback_data: 'settings'},
                {text: this.trans.get('button_close', msg), callback_data: 'close'}
            ]
        ];

        if(userTelegram.role === 'expert') {
            keyboard.push([{
                text: this.trans.get('button_cabinet_services', msg, {'%count%': userData.services}),
                callback_data: `services services`
            }]);

        }

        if(this.isExpert(user)) {
            tools[0].unshift({
                text: this.trans.get(`button_cabinet_change_role_${altRole}`, msg), callback_data: `change_role ${altRole}`
            });
        }
        return { inline_keyboard: [...keyboard, ...tools] };
    }
}

module.exports = CabinetCommand;