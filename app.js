const {BotContainer} = require('./botContainer');
const configureServices = require('./config/services')

const container = new BotContainer();
configureServices(container);

botEmitter = container.get('botEmitter');
botHandler = container.get('botHandler');
bot = container.get('bot');
botHandler.run();

///////////////////////////////////
//            EVENTS            //
//////////////////////////////////

// Event Listener
botEmitter.on('startMessageListener', (data) => {
    const {counter = 1, cmd, msg, ...methodList} = data;
    const messageObj = msg.message ? msg.message : msg;
    botHandler.messageListener[messageObj.chat.id] = {
        counter, cmd, methodList, data: {0: msg}
    };
});

botEmitter.on('nextMessageListener', (data) => {
    const {next, msg, ...options} = data;
    const messageObj = msg.message ? msg.message : msg;
    const uid = messageObj.chat.id;
    if(botHandler.messageListener[uid]) {
        currentCounter = botHandler.messageListener[uid].counter;
        const newCounter = next ? next : ++currentCounter;
        botHandler.messageListener[uid].counter = newCounter;
    }
    else {
        throw new Error(`MessageListener from user ${msg.chat.id}`);
    }
});

botEmitter.on('stopMessageListener', (msg) => {
    const messageObj = msg.message ? msg.message : msg;
    delete botHandler.messageListener[messageObj.chat.id];
});

// Send Messages
botEmitter.on('sendMessage', (data) => {
    const {chat_id, text, ...options} = data;
    bot.sendMessage(chat_id, text, options);
});

botEmitter.on('sendPhoto', (data) => {
    const {chat_id, photo, ...options} = data;
    bot.sendPhoto(chat_id, photo, options);
});

botEmitter.on('sendAudio', (data) => {
    const {chat_id, audio, ...options} = data;
    bot.sendPhoto(chat_id, audio, options);
});

botEmitter.on('sendDocument', (data) => {
    const {chat_id, doc, ...options} = data;
    bot.sendPhoto(chat_id, doc, options);
});

botEmitter.on('sendSticker', (data) => {
    const {chat_id, sticker, ...options} = data;
    bot.sendPhoto(chat_id, sticker, options);
});

botEmitter.on('sendVideo', (data) => {
    const {chat_id, video, ...options} = data;
    bot.sendPhoto(chat_id, video, options);
});

botEmitter.on('sendVideoNote', (data) => {
    const {chat_id, videoNote, ...options} = data;
    bot.sendPhoto(chat_id, videoNote, options);
});

botEmitter.on('sendVoice', (data) => {
    const {chat_id, voice, ...options} = data;
    bot.sendPhoto(chat_id, voice, options);
});

botEmitter.on('editMessageText', (data) => {
   const {text, ...options} = data;
   bot.editMessageText(text, options);
});

botEmitter.on('answerCallbackQuery', (data) => {
    const {callbackQueryId, ...options} = data;
    bot.answerCallbackQuery(callbackQueryId, options);
});
