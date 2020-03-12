class BotRedis {
    constructor(RedisStreams, data) {
        const {host, port, template, events} = data;
        this.streams = new RedisStreams({host, port});
        this.messageTemplate = template;
        this.events = events;
    }

    add(data, key = process.env.REDIS_PUB) {
        this.streams.add(key,
            this.messageTemplate.build(data)
        );
    }

    subscribe(key = process.env.REDIS_SUB) {
        setTimeout(() => {
            this.streams.subscribe("subTelegramBot", '$', ([[_,messages]]) => {
                console.log(messages);
                const data = JSON.parse(messages.body);
                const {event, ...eventData} = data;
                this.events(event, eventData);
            });
        }, 100);
    }
}

module.exports = BotRedis;