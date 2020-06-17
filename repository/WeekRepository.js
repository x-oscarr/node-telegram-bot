const BaseRepository = require('./BaseRepository');

class WeekRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder, 'week');
    }

    async getWeekType(date, dayOfWeek) {
        let monday = new Date();
        const minusDays = dayOfWeek == 0 ? 6 : dayOfWeek - 1;
        monday.setDate(monday.getDate() - minusDays);
        monday.setHours(0, 0, 0, 0);
        return this.qb()
            .where({monday})
            .first();
    }
}

module.exports = WeekRepository;