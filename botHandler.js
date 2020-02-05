const StartCommand = require('./commands/start');

class BotHandler {

    constructor(container) {
        this.bot = container.get('bot');
        this.list = [new StartCommand(container)];
        this.methods = {
            //Message
            sendMessage: true,
            sendPhoto: true,
            sendAudio: true,
            sendDocument: true,
            sendSticker: true,
            sendVideo: true,
            sendVoice: true,
            sendVideoNote: true,
            sendStiker: true,
            sendLocation: true,
            sendVenue: true,
            sendContact: true,
            editMessageText: true,
            editMessageCaption: true,
            editMessageReplyMarkup: true,
            getUserProfilePhotos: true,
            editMessageLiveLocation: true,
            stopMessageLiveLocation: true,
            deleteMessage: true,
            // Files
            getFile: true,
            getFileLink: true,
            getFileStream: true,
            downloadFile: true,
            //Button answer
            answerCallbackQuery: true,
            //Groups
            getChat: undefined,
            getChatAdministrators: undefined,
            getChatMembersCount: undefined,
            getChatMember: undefined,
            leaveChat: undefined,
            setChatStickerSet: undefined,
            deleteChatStickerSet: undefined,
            sendChatAction: undefined,
            kickChatMember: undefined,
            unbanChatMember: undefined,
            restrictChatMember: undefined,
            promoteChatMember: undefined,
            exportChatInviteLink: undefined,
            setChatPhoto: undefined,
            deleteChatPhoto: undefined,
            setChatTitle: undefined,
            setChatDescription: undefined,
            pinChatMessage: undefined,
            unpinChatMessage: undefined
        };
    }

    commandLoader() {
        const {bot, list, normalizationData} = this;
        list.forEach((item, index) => {
            bot.onText(item.regex, (msg, match) => {
                // Command execute
                item.execute(msg, match);
            });
        })
    }

    // normalizationData(item) {
    //     if(item.action && item.chat_id && this.methods[item.action]) {
    //         const {
    //             action,
    //             chat_id,
    //             text = null,
    //             file = null,
    //             parse_mode = 'HTML',
    //             disable_web_page_preview = false,
    //             disable_notification = false,
    //             reply_to_message_id = null,
    //             reply_markup = null
    //         } = item
    //
    //         return {
    //             action,
    //             chat_id,
    //             text,
    //             file,
    //             parse_mode,
    //             disable_web_page_preview,
    //             disable_notification,
    //             reply_to_message_id,
    //             reply_markup
    //         };
    //     }
    //     else {
    //         throw new Error('Method or chat ID doesn`t set');
    //     }
    // }
}

module.exports = BotHandler;