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

    async setNotify(userData, column, value) {
        value = value === 'on';
        if(typeof userData == "object") {
            userData = userData.id;
        }
        return this.qb.table(this.table)
            .where('telegram_id', userData)
            .update({[column]:value});
    }

    async unsync(userData) {
        if(typeof userData == "object") {
            userData = userData.id;
        }

        return this.qb.table(this.table)
            .where('telegram_id', userData)
            .update({user_id:null});
    }

    //INSERT
    async setUser(msgData) {
        return this.qb.table(this.table)
            .insert({
                username: msgData.from.username,
                telegram_id: msgData.from.id,
                locale: msgData.from.language_code,
                chat_id: msgData.chat.id,
                notify_orders: 1,
                notify_news: 1,
                notify_services: 1,
                role: 'client'
            });
    }
}

module.exports = UserTelegramRepository;