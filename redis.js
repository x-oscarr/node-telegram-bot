const helpers = require('./helpers');

class Redis {
    constructor(RedisStreams, data) {
        const {host, port, template, events} = data;
        this.streams = new RedisStreams({host, port});
        this.messageTemplate = template;
        this.events = events;
    }

    add(data, key = process.env.REDIS_PUB) {
        if(process.env.REDIS_DEBUG === 'true') {
            console.log('PUB:', data);
        }
        this.streams.add(key,
            this.messageTemplate.build(data)
        );
    }

    subscribe(key = process.env.REDIS_SUB) {
        setTimeout(() => {
            this.streams.subscribe(key, '$', ([[_,messages]]) => {
                if(process.env.REDIS_DEBUG === 'true') {
                    console.log('SUB:', messages);
                }
                const data = JSON.parse(messages.body);
                const eventData = helpers.toSnakeCase(data);
                this.events.emit(eventData.event, eventData.data);
            });
        }, 100);
    }
}

module.exports = Redis;