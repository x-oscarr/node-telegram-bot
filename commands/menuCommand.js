const BaseCommand = require('./baseCommand');

class MenuCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/menu/;
        this.name = '/menu';
        this.description = 'Menu command';
        this.userRepository = container.get('userRepository');
    }

    async execute(msg, match) {
        let keyboard;
        const userRole = await this.userRepository.getRole(msg);
        switch (userRole) {
            case this.userRepository.ROLE_STUDENT: keyboard = this.mainKeyboardStudent(msg); break;
            case this.userRepository.ROLE_TEACHER: keyboard = this.mainKeyboardTeacher(msg); break;
            case this.userRepository.ROLE_ENTRANT: keyboard = this.mainKeyboardEntrant(msg); break;
            default: keyboard = this.mainKeyboardStudent(msg);
        }
        this.action('sendPhoto', {
            chat_id: msg.chat.id,
            photo: 'https://dev.root7.ru/content.jpg',
            caption: this.trans.get('menu_select_command', msg),
            reply_markup: keyboard
        });
    }

    mainKeyboardStudent(msg) {
        return {
            resize_keyboard: true,
            inline_keyboard: [
                [
                    {text: this.trans.get('button_schedule_today', msg), callback_data: 'main_menu today'},
                    {text: this.trans.get('button_schedule_tomorrow', msg), callback_data: 'main_menu tomorrow'},
                    {text: this.trans.get('button_schedule', msg), callback_data: 'main_menu schedule'}
                ], [
                    {text: this.trans.get('button_useful_info', msg), callback_data: 'main_menu info'},
                    {text: this.trans.get('button_profile', msg), callback_data: 'main_menu profile'}
                ]
            ]
        };
    }

    mainKeyboardTeacher(msg) {
        return {
            resize_keyboard: true,
            inline_keyboard: [
                [
                    {text: this.trans.get('button_schedule_second_name', msg), callback_data: 'schedule teacher'},
                    {text: this.trans.get('button_schedule_group', msg), callback_data: 'schedule group'}
                ], [
                    {text: this.trans.get('button_useful_info', msg), callback_data: 'main_menu info'},
                    {text: this.trans.get('button_profile', msg), callback_data: 'main_menu profile'}
                ]
            ]
        };
    }

    mainKeyboardEntrant(msg) {
        return {
            one_time_keyboard: true,
            resize_keyboard: true,
            inline_keyboard: [
                [
                    {text: this.trans.get('button_useful_info', msg), callback_data: 'main_menu info'},
                    {text: this.trans.get('button_profile', msg), callback_data: 'main_menu profile'}
                ]
            ]
        };
    }
}

module.exports = MenuCommand;

