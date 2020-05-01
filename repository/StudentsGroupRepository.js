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
}

module.exports = StudentsGroupRepository;