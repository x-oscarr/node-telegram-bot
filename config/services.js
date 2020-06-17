require('dotenv').config();

//DB AND REDIS
const RedisStreams = require("../redisStreams");
const redisMessageTemplate = require("./redisMessageTemplate");
const knex = require('knex');
// Repositories
const UserRepository = require('../repository/UserRepository');
const ContentRepository = require('../repository/ContentRepository');
const FacultyRepository = require('../repository/FacultyRepository');
const LessonRepository = require('../repository/LessonRepository');
const StudentsGroupRepository = require('../repository/StudentsGroupRepository');
const WeekRepository = require('../repository/WeekRepository');
const TelegramBot = require('node-telegram-bot-api');
const Handler = require('../handler');
const Emitter = require('../emitter');
const Translator = require('../translator');
const Redis = require('../redis');
//Commands
const StartCommand = require('../commands/startCommand');
const MenuCommand = require('../commands/menuCommand');
//Callbacks
const ContentCallback = require('../callbacks/contentCallback');
const ScheduleCallback = require('../callbacks/scheduleCallback');
const CloseCallback = require('../callbacks/closeCallback');
const RegistrationCallback = require('../callbacks/registrationCallback');
const MainMenuCallback = require('../callbacks/mainMenuCallback');

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

    container.register('emitter', () => {
        return require('./events')(new Emitter());
    });

    container.register('handler', () => {
        return new Handler(container);
    });

    container.register('translator', () => {
       return new Translator();
    });

    // DB Repositories
    const qb = container.get('knex');

    container.register('userRepository', () => {
        return new UserRepository(qb);
    });
    container.register('contentRepository', () => {
        return new ContentRepository(qb);
    });
    container.register('facultyRepository', () => {
        return new FacultyRepository(qb);
    });
    container.register('lessonRepository', () => {
        return new LessonRepository(qb);
    });
    container.register('studentsGroupRepository', () => {
        return new StudentsGroupRepository(qb);
    });
    container.register('weekRepository', () => {
        return new WeekRepository(qb);
    });

    container.register('redis', () => {
        if(process.env.REDIS_ENABLE === 'true') {
            return new Redis(RedisStreams, {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                template: redisMessageTemplate,
                events: container.get('emitter'),
            })
        }
    });

    // Telegram Bot commands
    container.register('/start', () => {
        return new StartCommand(container);
    });
    container.register('/menu', () => {
        return new MenuCommand(container);
    });

    // Telegram Bot callbacks
    container.register('&close', () => {
        return new CloseCallback(container);
    });
    container.register('&registration', () => {
        return new RegistrationCallback(container);
    });
    container.register('&mainMenu', () => {
        return new MainMenuCallback(container);
    });
    container.register('&schedule', () => {
        return new ScheduleCallback(container);
    });
    container.register('&content', () => {
        return new ContentCallback(container);
    })
};