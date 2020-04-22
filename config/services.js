require('dotenv').config();

//DB AND REDIS
const RedisStreams = require("../redisStreams");
const redisMessageTemplate = require("./redisMessageTemplate");
const knex = require('knex');
const UserRepository = require('../repository/UserRepository');

const TelegramBot = require('node-telegram-bot-api');
const BotHandler = require('../botHandler');
const BotEmitter = require('../botEmitter');
const BotTranslator = require('../botTranslator');
const BotRedis = require('../botRedis');
//Commands
const StartCommand = require('../commands/startCommand');
//Callbacks
const CloseCallback = require('../callbacks/closeCallback');
const AcquaintanceCallback = require('../callbacks/acquaintanceCallback');

module.exports = (container) => {
    container.register('knex', () => {
        return knex({
            client: 'mysql',
            connection: {
                host : process.env.DB_HOST,
                user : process.env.DB_USER,
                password : process.env.DB_PASSWORD,
                database : process.env.DB_TABLE
            }
        })
    });

    container.register('bot', () => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        return new TelegramBot(token, {polling: true});
    });

    container.register('botEmitter', () => {
        return require('./events')(new BotEmitter());
    });

    container.register('botHandler', () => {
        return new BotHandler(container);
    });

    container.register('botTranslator', () => {
       return new BotTranslator();
    });

    // DB Repositories
    const qb = container.get('knex');

    container.register('userRepository', () => {
        return new UserRepository(qb);
    });

    container.register('userTelegramRepository', () => {
        return new UserTelegramRepository(qb);
    });

    container.register('bookServiceRepository', () => {
        return new BookServiceRepository(qb);
    });

    container.register('serviceRepository', () => {
        return new ServiceRepository(qb);
    });

    container.register('botRedis', () => {
        if(process.env.REDIS_ENABLE === 'true') {
            return new BotRedis(RedisStreams, {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                template: redisMessageTemplate,
                events: container.get('botEmitter'),
            })
        }
    });

    // Telegram Bot commands
    container.register('/start', () => {
        return new StartCommand(container);
    });

    // Telegram Bot callbacks
    container.register('&close', () => {
        return new CloseCallback(container);
    });
    container.register('&acquaintance', () => {
        return new AcquaintanceCallback(container);
    });
};