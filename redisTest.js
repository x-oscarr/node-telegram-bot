require('dotenv').config();
const redis = require("redis");
// const client = redis.createClient({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_POST
// });
//
// client.on("error", function(error) {
//     console.error(error);
// });

//const subscriber = redis.createClient();
// const publisher = redis.createClient();

// subscriber.on("subscribe", function(channel, count) {
//     publisher.publish("telegramBot", "a message");
//     publisher.publish("telegramBot", "another message");
// });

subscriber.on("message", function(channel, message) {
    console.log(`<${channel}>: ${message}`);
});

subscriber.subscribe("telegramBot");