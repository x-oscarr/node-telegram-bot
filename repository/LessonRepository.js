const BaseRepository = require('./BaseRepository');

class LessonRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder, 'lesson');
        this.DAY_TODAY;
        this.DAY_TOMORROW;
        this.DAY = {
            SUNDAY: 0,
            MONDAY: 1,
            TUESDAY: 2,
            WEDNESDAY: 3,
            THURSDAY: 4,
            FRIDAY: 5,
            SATURDAY: 6,
        };
        this.WEEK_TYPE_WEEKENDS = 0;
        this.WEEK_TYPE_NUMERATOR = 1;
        this.WEEK_TYPE_DENOMINATOR = 2;
        this.WEEK_TYPE_BOTH = 3;
    }

    today() {
        return new Date().getDay();
    }

    tomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.getDay();
    }

    async getSchedule(user, params) {
        let qb = this.qb().where({
            student_group_id: user.students_group_id,
            semester: 2,
            day_of_week: params.dayOfWeek,
        });
        if(params.typeOfWeek) {
            qb.whereIn('typeOfWeek', [params.typeOfWeek, this.WEEK_TYPE_BOTH])
        }
        return qb;
    }
}

module.exports = LessonRepository;