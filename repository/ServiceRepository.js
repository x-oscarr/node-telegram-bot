const BaseRepository = require('./BaseRepository');

class ServiceRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder);
        this.table = 'service';
    }

    async getServices(object) {
        let query = this.qb.table(this.table);

        if(object.userId) {
            query.andWhere({user_id: object.userId});
        }
        if(object.status) {
            query.andWhere({status: object.status});
        }
        if (object.isActive) {
            query.andWhere({is_active: object.isActive});
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

module.exports = ServiceRepository;