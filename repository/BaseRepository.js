class BaseRepository {
    constructor(queryBuilder) {
        this.qb = queryBuilder;
        this.table = null;
    }

    findQuery(criteria, options = null) {
        let query = this.qb.table(this.table);

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
                    query = query[key](options[key])
                }
            }
        }
        return query;
    }

    async find(id) {
        return this.qb.table(this.table).where('id', id).first();
    }

    async findBy(criteria, options) {
        return this.findQuery(criteria, options);
    }

    async findOneBy(criteria, options) {
        return this.findQuery(criteria, options).first();
    }

    async findAll() {
        return this.findQuery([]);
    };
}

module.exports = BaseRepository;