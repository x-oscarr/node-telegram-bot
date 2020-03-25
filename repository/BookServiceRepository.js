const BaseRepository = require('./BaseRepository');

class BookServiceRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder);
        this.qb = queryBuilder;
        this.table = 'book_service';
    }

    async getBookServices(object) {
        let query = this.qb.table(this.table);
        if(object.isJoinWithService) {
            query.select(
                'book_service.start_date', 'service.title', 'service.description', 'service.price',
                'service.video_consultation', 'service.departure_to_the_client',
                'user_translation.full_name'
            );
            query.innerJoin('user_translation', function () {
                this.on('book_service.client_id', '=', 'user_translation.translatable_id')
            });
            query.innerJoin('service',
                'book_service.service_id', '=', 'service.id');
            query.andWhere('user_translation.locale', object.locale ? object.locale : process.env.LOCALE);
        }
        if(object.userId) {
            let userTable = 'book_service.client_id';
            switch (object.role) {
                case "client": userTable = 'book_service.client_id'; break;
                case "expert": userTable = 'book_service.expert_id'; break;
                case "manager": userTable = 'book_service.manager_id'; break;
                case "payer": userTable = 'book_service.payer_id'; break;
            }
            query.andWhere({[userTable]: object.userId});
        }
        if(object.statuses) {
            query.whereIn('book_service.status', object.statuses);
        }
        if(object.startDate) {
            if(typeof object.endDate === 'undefined') {
                object.endDate = new Date();
                object.endDate.setUTCHours(23, 59, 59);
            }
            query.andWhereBetween('book_service.start_date', [object.startDate, object.endDate]);
        }
        if(object.page) {
            query.offset((object.page - 1) * process.env.PAGINATION_LIMIT);
            query.limit(process.env.PAGINATION_LIMIT);
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