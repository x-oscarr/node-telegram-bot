class BaseRepository {
    constructor(queryBuilder, table) {
        this.table = table;
        this.qb = (tableName = this.table) => queryBuilder.table(tableName);
    }

    findBy(criteria, options = null) {
        let query = this.qb();

        // criteria
        let index = 0;
        for (let key in criteria) {
            if(index++ === 0) {
                query = query.where(key, criteria[key]);
            }
            else {
                query = query.andWhere(key, criteria[key]);
            }
        }

        //options
        if(options) {
            for (let key in options) {
                if(key === 'orderBy') {
                    query = query[key](options[key][0], options[key][1]);
                }
                else if(key === 'limit' || key === 'offset') {
                    query = query[key](options[key]);
                }
            }
        }
        return query;
    }

    async find(id) {
        return this.qb().where('id', id).first();
    }

    async findOneBy(criteria, options) {
        return this.findBy(criteria, options).first();
    }

    async findAll() {
        return this.findBy([]);
    };
}

module.exports = BaseRepository;