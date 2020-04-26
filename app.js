const {Container} = require('./container');
const configureServices = require('./config/services');

const container = new Container();
configureServices(container);

Emitter = container.get('emitter');
Handler = container.get('handler');
bot = container.get('bot');
Handler.run();