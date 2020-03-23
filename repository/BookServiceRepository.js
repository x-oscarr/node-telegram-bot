const BaseRepository = require('./BaseRepository');

class BookServiceRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder);
        this.qb = queryBuilder;
        this.table = 'book_service';
    }

    async getBookServices(object) {
        let query = this.qb.table(this.table);
        if(object.userId) {
            let userTable = 'client_id';
            switch (object.role) {
                case "client": userTable = 'client_id'; break;
                case "expert": userTable = 'expert_id'; break;
                case "manager": userTable = 'manager_id'; break;
                case "payer": userTable = 'payer_id'; break;
            }
            query.andWhere({[userTable]: object.userId});
        }
        if(object.statuses) {
            query.whereIn('status', object.statuses);
        }
        if(object.startDate) {
            if(typeof object.endDate === 'undefined') {
                object.endDate = new Date();
                object.endDate.setUTCHours(23, 59, 59);
            }
            query.andWhereBetween('start_date', [object.startDate, object.endDate]);
        }
        if(object.offset) {
            query.offset(object.offset);
        }
        if(object.limit) {
            query.limit(object.limit);
        }
        if(object.isCount) {
            query.count({count: '*'});
            query = await query.first();
            query = query.count;
        }
        return query;
    }
}

module.exports = BookServiceRepository;