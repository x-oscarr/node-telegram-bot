require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const BotHandler = require('../botHandler');
const BotEmitter = require('../botEmitter');
const BotTranslator = require('../botTranslator');
const BotRedis = require('../botRedis');
//Commands
const StartCommand = require('../commands/startCommand');
const CabinetCommand = require('../commands/cabinetCommand');
const HealCommand = require('../commands/healCommand');
//Callbacks
const SyncCallback = require('../callbacks/syncCallback');

//DB AND REDIS
const redis = require('redis');
const knex = require('knex');
const UserTelegramRepository = require('../repository/UserTelegramRepository');
const UserRepository = require('../repository/UserRepository');

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

    container.register('botRedis', () => {
       return new BotRedis(redis, {
           host: process.env.REDIS_HOST,
           port: process.env.REDIS_PORT,
           subscriber: process.env.REDIS_SUB,
           publisher: process.env.REDIS_PUB
       })
    });

    container.register('botHandler', () => {
        return new BotHandler(container);
    });

    container.register('botEmitter', () => {
        return new BotEmitter();
    });

    container.register('botTranslator', () => {
       return new BotTranslator();
    });

    // Telegram Bot commands
    container.register('/start', () => {
        return new StartCommand(container);
    });

    container.register('/cabinet', () => {
        return new CabinetCommand(container);
    });

    container.register('/heal', () => {
        return new HealCommand(container);
    });

    // Telegram Bot callbacks
    container.register('&sync', () => {
        return new SyncCallback(container)
    });


    // DB Repositories
    const qb = container.get('knex');

    container.register('userRepository', () => {
       return new UserRepository(qb);
    });

    container.register('userTelegramRepository', () => {
        return new UserTelegramRepository(qb);
    });
};