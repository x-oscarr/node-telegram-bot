const BaseRepository = require('./BaseRepository');

class LessonRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder, 'lesson');
    }
}

module.exports = LessonRepository;