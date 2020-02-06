require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const BotHandler = require('../botHandler');
const BotEmitter = require('../botEmitter');
const BotTranslator = require('../botTranslator');
//Commands
const StartCommand = require('../commands/start');

//DB
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


    // DB Repositories
    const qb = container.get('knex');

    container.register('userRepository', () => {
       return new UserRepository(qb);
    });

    container.register('userTelegramRepository', () => {
        return new UserTelegramRepository(qb);
    });
};