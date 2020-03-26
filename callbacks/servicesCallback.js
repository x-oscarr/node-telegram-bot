baseCallback = require('./baseCallback');

class SyncCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^services\s?([a-zA-Z]+)?\s?([0-9]+)?/;
        this.redis = container.get('botRedis');
        this.userRepository = container.get('userRepository');
        this.userTelegramRepository = container.get('userTelegramRepository');
        this.bookServiceRepository = container.get('bookServiceRepository');
        this.serviceRepository = container.get('serviceRepository');
    }

    async execute(msg, match) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        const type = match[1];
        const page = match[2] ? match[2] : 1;
        const user = await this.userRepository.getUser(msg.from.id);
        const userTelegram = await this.userTelegramRepository.getTelegramUser(msg.from.id);
        const activeRole = this.getActiveRole(user, userTelegram);
        this[type](msg, user.id, activeRole, page, type);
    }

    async services(msg, uid, activeRole, page, type) {
        const params = {
            userId: uid,
            status: 'accepted',
            isActive: true
        };
        let text = this.trans.get('command_cabinet_service', msg);
        const count = await this.serviceRepository.getServices({...params, isCount: true});
        const services = await this.serviceRepository.getServices({...params, page});
        for (let item of services) {
            const typeService = this.getServiceType(msg, item.video_consultation, item.departure_to_the_client);
            text = text + this.trans.get('command_cabinet_services', msg, {
                '%title%': item.title,
                '%description%': item.description,
                '%type%': typeService,
                '%price%': item.price
            });
        }

        this.action('editMessageText', {
            text,
            chat_id: msg.from.id,
            message_id: msg.message.message_id,
            parse_mode: 'HTML',
            reply_markup: {inline_keyboard: this.keyboardBuilder(msg, type, count, page)}
        });
    }

    async activeBookedServices(msg, uid, activeRole, page, type) {
        this.callbackBookedService(msg, uid, activeRole, page, type);
    }

    async todayBookedServices(msg, uid, activeRole, page, type) {
        this.callbackBookedService(msg, uid, activeRole, page, type);
    }

    async callbackBookedService(msg, uid, activeRole, page, type) {
        const params = {
            userId: uid,
            role: activeRole,
            statuses: ['pending', 'accepted', 'in_progress'],
        };
        let text = this.trans.get('command_cabinet_active_booked_service', msg);

        if(type === 'todayBookedServices') {
            params.startDate = new Date();
            text = this.trans.get('command_cabinet_today_booked_service', msg);
        }

        const count = await this.bookServiceRepository.getBookServices({...params, isCount: true});
        const bookedServices = await this.bookServiceRepository.getBookServices({
            ...params,
            isJoinWithService: true,
            locale: msg.from.language_code,
            page
        });
        for (let item of bookedServices) {
            const typeService = this.getServiceType(msg, item.video_consultation, item.departure_to_the_client);
            text = text + this.trans.get('command_cabinet_booked_services', msg, {
                '%title%': item.title,
                '%description%': item.description,
                '%client%': item.full_name,
                '%type%': typeService,
                '%date%': item.start_date,
                '%price%': item.price
            });
        }
        this.action('editMessageText', {
            text,
            chat_id: msg.from.id,
            message_id: msg.message.message_id,
            parse_mode: 'HTML',
            reply_markup: {inline_keyboard: this.keyboardBuilder(msg, type, count, page)}
        });
    }

    getActiveRole(user, userTelegram) {
        const roles = user.roles.split(',');
        const telegramRole = userTelegram.role;
        if(telegramRole === 'expert' && (roles.indexOf('ROLE_EXPERT') || roles.indexOf('ROLE_CONSULTANT'))) {
            return 'expert';
        }
        if(telegramRole === 'expert' && roles.indexOf('ROLE_MANAGER')) {
            return 'manager';
        }
        else return 'client';
    }

    paginateButtons(msg, type, count, page) {
        let buttons = [];
        const maxPages = Math.ceil(count % process.env.PAGINATION_LIMIT);
        if (count < process.env.PAGINATION_LIMIT) {
            return [];
        }
        // PREV
        if(page != 1) {
            buttons.push({
                text: this.trans.get('button_prev', msg),
                callback_data: `services ${type} ${page-1}`
            });
        }
        // PAGES
        buttons.push({
            text: `${page} / ${maxPages}`, callback_data: 'list'
        });
        // NEXT
        if(maxPages > page) {
            buttons.push({
                text: this.trans.get('button_next', msg),
                callback_data: `services ${type} ${+page+1}`
            });
        }
        return buttons;
    }

    keyboardBuilder(msg, type, count, page) {
        return [
            this.paginateButtons(msg, type, count, page),
            [
                {text: this.trans.get('button_back', msg), callback_data: 'cabinet'},
                {text: this.trans.get('button_close', msg), callback_data: 'close'}
            ]
        ];
    }

    getServiceType(msg, video_consultation, departure_to_the_client) {
        let type;
        if(video_consultation && !departure_to_the_client) {
            type = this.trans.get('command_cabinet_departure_to_the_client', msg);
        }
        else if(!video_consultation && departure_to_the_client) {
            type = this.trans.get('command_cabinet_info_online_service', msg);
        }
        else {
            type = this.trans.get('command_cabinet_info_default', msg);
        }
        return type;
    }
}

module.exports = SyncCallback;