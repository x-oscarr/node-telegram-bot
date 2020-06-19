const BaseRepository = require('./BaseRepository');

class StudentsGroupRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder, 'students_group');
    }

    async getCourses(faculty) {
        return this.qb()
            .count('course', {as: 'count'})
            .groupBy('faculty_id')
            .where({faculty_id: faculty})
    }

    async getGroup(groupName) {
        const group = groupName.match(/([а-яА-ЯA-Zгєї]+)[-_\s]?([0-9])([0-9])/);
        if(!group) {
            return false;
        }
        return this.qb()
            .where({
                name: group[1],
                course: group[2],
                number: group[3]
            })
            .first();
    }
}

module.exports = StudentsGroupRepository;