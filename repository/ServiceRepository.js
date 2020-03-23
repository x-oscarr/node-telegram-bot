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

module.exports = ServiceRepository;