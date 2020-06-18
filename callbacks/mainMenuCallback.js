baseCallback = require('./baseCallback');

class MainMenuCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^main_menu\s?([a-zA-Z0-9_]+)?/;
        this.schedule = container.get('&schedule');
        this.content = container.get('&content');
        this.menuCommand = container.get('/menu');
        this.userRepository = container.get('userRepository');
        this.groupRepository = container.get('studentsGroupRepository');
    }

    async execute(msg, match) {
        this.action('answerCallbackQuery', {
            callbackQueryId: msg.id
        });

        if(match[1] == 'menu') {
            this.menu(msg);
        }

        switch (match[1]) {
            case 'today':
                await this.schedule.getTodaySchedule(msg);
                break;
            case 'tomorrow':
                await this.schedule.getTomorrowSchedule(msg);
                break;
            case 'teacher':
                await this.schedule.getScheduleByTeacher(msg);
                break;
            case 'schedule':
                await this.schedule.scheduleMenu(msg);
                break;
            case 'info':
                await this.content.contentMenu(msg);
                break;
            case 'profile':
                await this.userInfo(msg);
                break;
        }
    }

    async menu(msg) {
        let keyboard;
        const userRole = await this.userRepository.getRole(msg);
        switch (userRole) {
            case this.userRepository.ROLE_STUDENT: keyboard = this.menuCommand.mainKeyboardStudent(msg); break;
            case this.userRepository.ROLE_TEACHER: keyboard = this.menuCommand.mainKeyboardTeacher(msg); break;
            case this.userRepository.ROLE_ENTRANT: keyboard = this.menuCommand.mainKeyboardEntrant(msg); break;
            default: keyboard = this.mainKeyboardStudent(msg);
        }

        this.action('editMessageMedia', {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id,
            media: {
                type: 'photo',
                caption: this.trans.get('menu_select_command', msg),
                media:'https://dev.root7.ru/content.jpg',
            },
            reply_markup: keyboard
        });
    }

    async userInfo(msg) {
        const user = await this.userRepository.getUser(msg.from);
        if(!user) {
            this.action('sendMessage', {
                chat_id: msg.message.chat.id,
                text: this.trans.get('you_are_not_registered', msg)
            });
        }
        const group = await this.groupRepository.find(user.students_group_id);
        const role = await this.userRepository.getRole(msg);

        this.action('editMessageCaption', {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id,
            parse_mode: 'HTML',
            caption: this.trans.get('profile_info_student', msg, {
                '%name%': user.name,
                '%id%': user.id,
                '%group%': group.name,
                '%role%': role
            }),
            reply_markup: {
                inline_keyboard: [[
                    {text: this.trans.get('button_back', msg), callback_data: 'main_menu menu'},
                    {text: this.trans.get('button_close', msg), callback_data: 'close'}
                ]
            ]}
        });
    }
}

module.exports = MainMenuCallback;