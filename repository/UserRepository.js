const BaseRepository = require('./BaseRepository');
const slugify = require('slugify');

class UserRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder, 'user');
        this.ROLE_USER = 'ROLE_USER';
        this.ROLE_ENTRANT = 'ROLE_ENTRANT';
        this.ROLE_STUDENT = 'ROLE_STUDENT';
        this.ROLE_TEACHER = 'ROLE_TEACHER';
    }

    async makeUser(telegramUser) {
        let {id, username, first_name, last_name, language_code} = telegramUser;
        const name = last_name ? `${first_name} ${last_name}` : first_name;
        let user = await this.getUser(id);
        username = username ? username : slugify(name);
        if(!user) {
            user = await this.getUser(username);
            username = (user && username) ?
                `${username}-${this.random(111,999)}` : `user-${this.random(111,999)}`;

            return this.qb()
                .returning('*')
                .insert({
                    id, username, name,
                    locale: language_code,
                    roles: JSON.stringify([this.ROLE_USER]),
                    students_group_id: null,
                }
            );
        }
        return this.qb()
            .where('id', id)
            .update({
                locale: language_code,
            });
    }

    async setGroup(userId, groupId) {
        return this.qb().where('id', userId).update({students_group_id: groupId ? groupId : null});
    }

    async setRole(userId, role) {
        return this.qb().where('id', userId).update({roles: JSON.stringify([this.ROLE_USER, role])})
    }

    async getRole(msg) {
        const user = await this.find(msg.from.id);
        if(!user) {
            return false;
        }
        const userRoles = JSON.parse(user.roles);
        if(userRoles.indexOf(this.ROLE_ENTRANT) > -1) {
            return this.ROLE_ENTRANT;
        } else if(userRoles.indexOf(this.ROLE_TEACHER) > -1) {
            return this.ROLE_TEACHER;
        } else if(userRoles.indexOf(this.ROLE_STUDENT) > -1) {
            return this.ROLE_STUDENT;
        } else {
            return this.ROLE_USER;
        }
    }

    async getUser(telegramUser) {
        if(typeof telegramUser === 'object' && telegramUser.id) {
            telegramUser = telegramUser.id;
        }
        else if (typeof telegramUser == 'string') {
            return this.findOneBy({username: telegramUser});
        }
        return this.findOneBy({id: telegramUser});
    }

    random(low, high) {
        return Math.ceil(Math.random() * (high - low) + low);
    }
}

module.exports = UserRepository;