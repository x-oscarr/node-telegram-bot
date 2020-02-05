const {BotContainer} = require('./botContainer');
const configureServices = require('./config/services')

const container = new BotContainer();
configureServices(container);

botEmitter = container.get('botEmitter');
bot = container.get('bot');

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

botEmitter.on('answerCallbackQuery', (data) => {
    const {callbackQueryId, ...options} = data;
    bot.sendPhoto(callbackQueryId, options);
});

botHandler = container.get('botHandler');
botHandler.commandLoader();

bot.on('message',
    (msg) => {
        //console.log(msg);
});

bot.on('callback_query', (callback) => {
   console.log(callback)
});
//bot.sendMessage(413537785, 'катаєте шось?')

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"
//
//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
// });
