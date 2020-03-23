const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder);
        this.table = 'user';
    }

    async getUser(data) {
        if(typeof data == "object") {
            data = data.from ? data.from.id : data.id;
        }
        const userTelegram = await this.findQuery({
            telegram_id: data
        }, null, 'userTelegram').first;
        return this.find(userTelegram.user_id);
    }
}

module.exports = UserRepository;