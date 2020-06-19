baseCallback = require('./baseCallback');

class MainMenuCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^schedule\s?([a-zA-Z0-9_]+)?\s?([a-zA-Z0-9_]+)?/;
        this.userRepository = container.get('userRepository');
        this.lessonRepository = container.get('lessonRepository');
        this.weekRepository = container.get('weekRepository');
        this.studentsGroupRepository = container.get('studentsGroupRepository');
    }

    async execute(msg, match) {
        const type = match[1];
        const value = match[2];
        const user = await this.userRepository.getUser(msg.from);
        if(type === 'day') {
            const params = {dayOfWeek: value, group: user.students_group_id};
            const schedules = await this.lessonRepository.getSchedule(params);
            return this.render(msg, schedules);
        }
        else if(type === 'week') {
            const params = {typeOfWeek: value, group: user.students_group_id};
            const schedules = await this.lessonRepository.getSchedule(params);
            return this.render(msg, schedules);
        }
        else if(type === 'teacher') {
            this.action('editMessageCaption', {
                message_id: msg.message.message_id,
                chat_id: msg.from.id,
                caption: this.trans.get('schedule_type_teacher'),
                parse_mode: 'HTML'
            });

            this.action('startMessageListener', {msg, cmd: this, 1: 'setTeacher'});
        }
        else if(type === 'group') {
            this.action('editMessageCaption', {
                message_id: msg.message.message_id,
                chat_id: msg.from.id,
                caption: this.trans.get('schedule_type_group'),
                parse_mode: 'HTML'
            });

            this.action('startMessageListener', {msg, cmd: this, 1: 'setGroup'});
        }
    }

    async getTodaySchedule(msg) {
        const user = await this.userRepository.getUser(msg.from);
        const dayOfWeek = await this.lessonRepository.today();
        const typeOfWeek = await this.weekRepository.getWeekType(new Date());
        const params = {
            dayOfWeek,
            typeOfWeek: typeOfWeek.type,
            group: user.students_group_id
        };
        const schedules = await this.lessonRepository.getSchedule(params);
        this.render(msg, schedules);
    }

    async getTomorrowSchedule(msg) {
        const user = await this.userRepository.getUser(msg.from);
        const dayOfWeek = this.lessonRepository.tomorrow();
        const typeOfWeek = await this.weekRepository.getWeekType(new Date());
        const params = {
            dayOfWeek,
            typeOfWeek: typeOfWeek.type,
            group: user.students_group_id
        };
        const schedules = await this.lessonRepository.getSchedule(params);
        this.render(msg, schedules);
    }

    async scheduleMenu(msg) {
        const message = msg.message ? msg.message : msg;
        this.action('editMessageCaption', {
            message_id: msg.message.message_id,
            chat_id: message.chat.id,
            caption: this.trans.get('content_menu'),
            reply_markup: this.studentMenu()
        });
    }

    async setTeacher(msg) {
        const params = {teacher: msg.text};
        const schedules = await this.lessonRepository.getSchedule(params);
        this.render(msg, schedules);
    }

    async setGroup(msg) {
        const group = await this.studentsGroupRepository.getGroup(msg.text);
        if(!group) {
            this.notFound(msg);
        }
        const params = {group: group.id};
        const schedules = await this.lessonRepository.getSchedule(params);
        this.render(msg, schedules);
    }

    async render(msg, schedulesList) {
        let caption;
        let structure = {};
        const message = msg.message ? msg.message : msg;
        if(schedulesList.length > 0) {
            for (let schedule of schedulesList) {
                if(!structure[schedule.student_group_id]) {
                    structure[schedule.student_group_id] = {};
                }
                if(!structure[schedule.student_group_id][schedule.day_of_week]) {
                    structure[schedule.student_group_id][schedule.day_of_week] = {};
                }
                if(!structure[schedule.student_group_id][schedule.day_of_week][schedule.number]) {
                    structure[schedule.student_group_id][schedule.day_of_week][schedule.number] = {};
                }
                if(!structure[schedule.student_group_id][schedule.day_of_week][schedule.number][schedule.type_of_week]) {
                    structure[schedule.student_group_id][schedule.day_of_week][schedule.number][schedule.type_of_week] = {};
                }
                structure[schedule.student_group_id][schedule.day_of_week][schedule.number][schedule.type_of_week] = schedule;
            }
            caption = await this.renderText(msg, structure);
        }
        else {
            caption = await this.trans.get('schedule_not_found', msg);
        }

        if(caption.length > 1000) {
            await this.slice(msg, caption);
            caption = null;
        }
        this.action(msg.message ? 'editMessageCaption' : 'sendPhoto', {
            message_id: message.message_id,
            chat_id: msg.from.id,
            caption,
            photo: 'https://dev.root7.ru/content.jpg',
            parse_mode: 'HTML',
            reply_markup: {inline_keyboard: [
                [
                    {text: this.trans.get('button_back', msg), callback_data: 'main_menu'},
                    {text: this.trans.get('button_close', msg), callback_data: 'close'}
                ]
            ]}
        });
    }

    async renderText(msg, structure) {
        let caption = '';
        for (let groupId in structure) {
            let group = await this.studentsGroupRepository.find(groupId);
            caption += this.trans.get('schedule_group', msg, {
                '%group%': `${group.name}-${group.course}${group.number}`
            });
            for(let day in structure[groupId]) {
                caption += this.trans.get('schedule_day', msg, {
                    '%day%': this.trans.get('day'+day, msg),
                });
                for (let number in structure[groupId][day]) {
                    for (let typeOfWeekId in structure[groupId][day][number]) {
                        let typeOfWeek;
                        switch (typeOfWeekId) {
                            case 1: typeOfWeek = this.trans.get('typeOfWeekFirst', msg); break;
                            case 2: typeOfWeek = this.trans.get('typeOfWeekSecond', msg); break;
                            default: typeOfWeek = this.trans.get('typeOfWeekBoth', msg); break;
                        }
                        let schedule = structure[groupId][day][number][typeOfWeekId];
                        caption += this.trans.get('schedule_item', msg, {
                            '%typeOfWeek%': typeOfWeek,
                            '%name%': schedule.subject,
                            '%teacher%': schedule.teacher,
                            '%auditory%': schedule.auditory,
                            '%time%': this.lessonRepository.TIME_LESSONS[schedule.number],
                        });
                    }
                }
            }
        }
        return caption;
    }

    notFound(msg) {
        this.action('sendMessage', {
            chat_id: msg.from.id,
            text: this.get('not_found', msg),
            reply_markup: {inline_keyboard: [
                [
                    {text: this.trans.get('button_back', msg), callback_data: 'main_menu'},
                    {text: this.trans.get('button_close', msg), callback_data: 'close'}
                ]
            ]}
        })
    }

    studentMenu(msg) {
        return { inline_keyboard: [
            [
                {text: this.trans.get('d1', msg), callback_data: 'schedule day 1'},
                {text: this.trans.get('d2', msg), callback_data: 'schedule day 2'},
                {text: this.trans.get('d3', msg), callback_data: 'schedule day 3'},
                {text: this.trans.get('d4', msg), callback_data: 'schedule day 4'},
                {text: this.trans.get('d5', msg), callback_data: 'schedule day 5'},
                {text: this.trans.get('d6', msg), callback_data: 'schedule day 6'},
                {text: this.trans.get('d0', msg), callback_data: 'schedule day 0'}
            ], [
                {text: this.trans.get('typeOfWeekFirst', msg), callback_data: 'schedule week 1'},
                {text: this.trans.get('typeOfWeekSecond', msg), callback_data: 'schedule week 2'}
            ], [
                {text: this.trans.get('button_schedule_second_name', msg), callback_data: 'schedule teacher'},
                {text: this.trans.get('button_schedule_group', msg), callback_data: 'schedule group'}
            ], [
                {text: this.trans.get('button_back', msg), callback_data: 'main_menu'},
                {text: this.trans.get('button_close', msg), callback_data: 'close'}
            ]
        ]}
    }

    async slice(msg, caption) {
        this.action('sendMessage', {
            chat_id: msg.from.id,
            text: caption,
            parse_mode: 'HTML'
        });
    }
}

module.exports = MainMenuCallback;