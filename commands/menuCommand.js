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
        const user = await this.userRepository.find(msg.from.id);
        const userRoles = JSON.parse(user.roles);

        // this.action('sendMessage', {
        //     chat_id: msg.chat.id,
        //     text: this.trans.get('menu_select_command', msg),
        //     reply_markup: this.mainKeyboard(msg)
        // });

        this.action('startMessageListener', {
            msg,
            cmd: this,
            1: 'router'
        });
    }


    async router(msg) {

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

