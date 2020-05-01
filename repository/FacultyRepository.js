const BaseRepository = require('./BaseRepository');

class FacultyRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder, 'faculty');
    }
}

module.exports = FacultyRepository;