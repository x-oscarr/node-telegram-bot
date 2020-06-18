baseCallback = require('./baseCallback');

class MainMenuCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^schedule\s([a-zA-Z0-9]+)/;
        this.userRepository = container.get('userRepository');
        this.lessonRepository = container.get('lessonRepository');
        this.weekRepository = container.get('weekRepository');
    }

    async getTodaySchedule(msg) {
        const user = await this.userRepository.getUser(msg.from);
        const dayOfWeek = await this.lessonRepository.today();
        const typeOfWeek = await this.weekRepository.getWeekType(new Date(), dayOfWeek);
        const params = {
            dayOfWeek,
            typeOfWeek: typeOfWeek.type
        };
        const schedule = await this.lessonRepository.getSchedule(user, params);

    }

    async getTomorrowSchedule(msg) {
        const user = this.userRepository.getUser(msg.from);
        const dayOfWeek = this.lessonRepository.tomorrow();
        const typeOfWeek = await this.weekRepository.getWeekType(new Date(), dayOfWeek);
        const params = {
            dayOfWeek,
            typeOfWeek: typeOfWeek.type
        };
        const schedule = await this.lessonRepository.getSchedule(user, params);
    }

    async getScheduleByTeacher(msg) {

    }

    async scheduleMenu(msg) {
        const message = msg.message ? msg.message : msg;
        this.action('sendMessage', {
            chat_id: message.chat.id,
            text: this.trans.get('content_menu'),
            reply_markup: { inline_keyboard: [

            ]}
        })
    }

    outputSchedules(msg, params, schedulesList) {
        let typeOfWeek;
        switch (params.typeOfWeek) {
            case 1: typeOfWeek = this.trans.get('typeOfWeekFirst', msg); break;
            case 2: typeOfWeek = this.trans.get('typeOfWeekSecond', msg); break;
            default: typeOfWeek = this.trans.get('typeOfWeekBoth', msg); break;
        }

        let caption = this.trans.get('schedule_title', msg, {
            '%typeOfWeek%': typeOfWeek,
            '%dayOfWeek%': this.trans.get('day'+params.dayOfWeek, msg),
        });

        for (let schedule of schedulesList) {
            caption += this.trans.get('schedule_item', msg, {
                '%name%': schedule.subject,
                '%teacher%': schedule.teacher,
                '%auditory%': schedule.auditory,
                '%time%': this.TIME_LESSONS[schedule.number],

            });
        }

        this.action('editMessageCaption', {
            message_id: msg.message.message_id,
            chat_id: msg.message.from.id,
            caption
        })
    }
}

module.exports = MainMenuCallback;