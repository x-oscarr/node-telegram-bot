baseCallback = require('./baseCallback');

class MainMenuCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^\/schedule\s([a-zA-Z0-9]+)/;
        this.userRepository = container.get('userRepository');
        this.lessonRepository = container.get('lessonRepository');
        this.weekRepository = container.get('weekRepository');
    }

    async getTodaySchedule(msg) {
        const user = this.userRepository.getUser(msg.from);
        const dayOfWeek = this.lessonRepository.today();
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
        //const schedule = await this.lessonRepository.getSchedule(user, params);
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
}

module.exports = MainMenuCallback;