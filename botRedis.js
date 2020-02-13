class BotRedis {
    constructor(redis, redis_data) {
        const {host, port, subscriber, publisher} = redis_data;
        this.pubChannel = publisher;
        this.publisher = redis.createClient({host: host, port});
        this.subscriber = redis.createClient({host: host, port});
        this.subscriber.subscribe(subscriber);
    }

    publish(text) {
        this.publisher.publish(this.pubChannel, text);
    }

    subscribe() {
        this.subscriber.on("message", function(channel, message) {
            console.log(`<${channel}>: ${message}`);
        });
    }
}

module.exports = BotRedis;