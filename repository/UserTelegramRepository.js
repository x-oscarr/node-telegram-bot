const BaseRepository = require('./BaseRepository');

class UserTelegramRepository extends BaseRepository {
    constructor (queryBuilder) {
        super(queryBuilder);
        this.table = 'user_telegram';
    }
}

module.exports = UserTelegramRepository;