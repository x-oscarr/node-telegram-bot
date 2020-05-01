const BaseRepository = require('./BaseRepository');

class ContentRepository extends BaseRepository{
    constructor (queryBuilder) {
        super(queryBuilder, 'content');
    }
}

module.exports = ContentRepository;