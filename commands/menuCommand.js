const BaseCommand = require('./baseCommand');

class MenuCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/menu/;
        this.name = '/menu';
        this.description = 'Menu command';
        this.userRepository = container.get('userRepository');
        this.schedule = container.get('&schedule');
        this.content = container.get('&content');
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
        this.action('sendMessage', {
            chat_id: msg.chat.id,
            text: this.trans.get('menu_select_command', msg),
            reply_markup: keyboard
        });
        this.action('startMessageListener', {
            msg,
            cmd: this,
            1: 'router'
        });
    }

    async router(msg) {
        switch (msg.text) {
            case this.trans.get('button_schedule_today', msg):
                await this.schedule.getTodaySchedule(msg);
                break;
            case this.trans.get('button_schedule_tomorrow', msg):
                await this.schedule.getTomorrowSchedule();
                break;
            case this.trans.get('button_schedule', msg):
                await this.schedule.scheduleMenu(msg);
                break;
            case this.trans.get('button_useful_info', msg):
                await this.content.contentMenu(msg);
                break;
            case this.trans.get('button_profile', msg):
                break;
        }
        // this.action('sendMessage', {
        //     chat_id: msg.chat.id,
        //     text: this.trans.get('menu_select_command', msg),
        //     reply_markup: this.mainKeyboard(msg)
        // });
    }

    mainKeyboardStudent(msg) {
        return {
            resize_keyboard: true,
            keyboard: [
                [
                    this.trans.get('button_schedule_today', msg),
                    this.trans.get('button_schedule_tomorrow', msg),
                    this.trans.get('button_schedule', msg)
                ], [
                    this.trans.get('button_useful_info', msg),
                    this.trans.get('button_profile', msg)
                ]
            ]
        };
    }

    mainKeyboardTeacher(msg) {
        return {
            resize_keyboard: true,
            keyboard: [
                [
                    this.trans.get('button_schedule_today', msg),
                    this.trans.get('button_schedule_tomorrow', msg),
                    this.trans.get('button_schedule', msg)
                ], [
                    this.trans.get('button_useful_info', msg),
                    this.trans.get('button_profile', msg)
                ]
            ]
        };
    }

    mainKeyboardEntrant(msg) {
        return {
            resize_keyboard: true,
            keyboard: [
                [
                    this.trans.get('button_schedule_today', msg),
                    this.trans.get('button_schedule_tomorrow', msg),
                    this.trans.get('button_schedule', msg)
                ], [
                    this.trans.get('button_useful_info', msg),
                    this.trans.get('button_profile', msg)
                ]
            ]
        };
    }
}

module.exports = MenuCommand;

