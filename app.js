const {BotContainer} = require('./botContainer');
const configureServices = require('./config/services');

const container = new BotContainer();
configureServices(container);

botEmitter = container.get('botEmitter');
botHandler = container.get('botHandler');
bot = container.get('bot');
botHandler.run();