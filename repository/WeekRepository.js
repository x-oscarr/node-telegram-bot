const BaseRepository = require('./BaseRepository');

class WeekRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder, 'week');
    }

    async getWeekType(date) {
        const dayOfWeek = date.getDay();
        let monday = date;

        const minusDays = dayOfWeek == 0 ? 7 : dayOfWeek;
        monday.setDate(monday.getDate() - minusDays);
        monday.setHours(0, 0, 0, 0);
        return this.qb()
            .where({monday})
            .first();
    }
}

module.exports = WeekRepository;