const BaseRepository = require('./BaseRepository');

class UserTelegramRepository extends BaseRepository {
    constructor (queryBuilder) {
        super(queryBuilder);
        this.table = 'user_telegram';
    }

    //SELECT
    async getTelegramUser(userData) {
        if(typeof userData == "object") {
            userData = userData.id;
        }
        return this.findOneBy({
            telegram_id: userData
        });
    }
    //UPDATE
    async changeRole(userTelegram, role) {
        return this.qb.table(this.table)
            .where({id: userTelegram.id})
            .update({role});
    }
}

module.exports = UserTelegramRepository;