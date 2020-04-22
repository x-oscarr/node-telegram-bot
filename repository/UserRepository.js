const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder);
        this.table = 'user';
    }

    //Custom async methods
}

module.exports = UserRepository;