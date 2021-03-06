module.exports = function (Emitter) {
    ///////////////////////////////////
    //            EVENTS            //
    //////////////////////////////////
    // Event Listener
    Emitter.on('startMessageListener', (data) => {
        const {counter = 1, cmd, msg, ...methodList} = data;
        const messageObj = msg.message ? msg.message : msg;
        Handler.messageListener[messageObj.chat.id] = {
            counter, cmd, methodList, data: {0: msg}
        };
    });

    Emitter.on('nextMessageListener', (data) => {
        const {next, msg, ...options} = data;
        const messageObj = msg.message ? msg.message : msg;
        const uid = messageObj.chat.id;
        if(Handler.messageListener[uid]) {
            let currentCounter = Handler.messageListener[uid].counter;
            const newCounter = next ? next : ++currentCounter;
            Handler.messageListener[uid].counter = newCounter;
        }
        else {
            throw new Error(`MessageListener from user ${msg.chat.id}`);
        }
    });

    Emitter.on('stopMessageListener', (msg) => {
        const messageObj = msg.message ? msg.message : msg;
        delete Handler.messageListener[messageObj.chat.id];
    });

    // Telegram events
    Emitter.on('sendMessage', (data) => {
        const {chat_id, text, ...options} = data;
        bot.sendMessage(chat_id, text, options);
    });

    Emitter.on('sendPhoto', (data) => {
        const {chat_id, photo, ...options} = data;
        bot.sendPhoto(chat_id, photo, options);
    });

    Emitter.on('sendAudio', (data) => {
        const {chat_id, audio, ...options} = data;
        bot.sendPhoto(chat_id, audio, options);
    });

    Emitter.on('sendDocument', (data) => {
        const {chat_id, doc, ...options} = data;
        bot.sendPhoto(chat_id, doc, options);
    });

    Emitter.on('sendSticker', (data) => {
        const {chat_id, sticker, ...options} = data;
        bot.sendPhoto(chat_id, sticker, options);
    });

    Emitter.on('sendVideo', (data) => {
        const {chat_id, video, ...options} = data;
        bot.sendPhoto(chat_id, video, options);
    });

    Emitter.on('sendVideoNote', (data) => {
        const {chat_id, videoNote, ...options} = data;
        bot.sendPhoto(chat_id, videoNote, options);
    });

    Emitter.on('sendVoice', (data) => {
        const {chat_id, voice, ...options} = data;
        bot.sendPhoto(chat_id, voice, options);
    });

    Emitter.on('editMessageText', (data) => {
        const {text, ...options} = data;
        bot.editMessageText(text, options);
    });

    Emitter.on('answerCallbackQuery', (data) => {
        const {callbackQueryId, ...options} = data;
        bot.answerCallbackQuery(callbackQueryId, options);
    });

    Emitter.on('deleteMessage', (data) => {
       const {chat_id, message_id} = data;
       bot.deleteMessage(chat_id, message_id);
    });

    return Emitter;
};