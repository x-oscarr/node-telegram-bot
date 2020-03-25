const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder);
        this.table = 'user';
    }

    async getUser(userData) {
        const userTelegram = await this.getTelegramUser(userData);
        return this.find(userTelegram.user_id);
    }

    async getUserForCabinet(userData, locale = process.env.LOCALE) {
        const userTelegram = await this.getTelegramUser(userData);
        return this.qb.table(this.table)
            .select('user.roles', 'user_translation.full_name')
            .innerJoin('user_translation', function () {
                this.on('user_translation.translatable_id', '=', 'user.id')
            })
            .where('user.id', userTelegram.user_id)
            .where('user_translation.locale', locale)
            .first()
        ;
    }

    async getTelegramUser(userData) {
        if(typeof userData == "object") {
            userData = userData.id;
        }
        return this.findQuery({
            telegram_id: userData
        }, null, 'user_telegram').first();
    }
}

module.exports = UserRepository;