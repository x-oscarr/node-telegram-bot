baseCallback = require('./baseCallback');

class BookServiceCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^book_service\s?([a-zA-Z0-9]+)?\s?([a-zA-Z0-9]+)?\s?([a-zA-Z0-9]+)?/;
        this.bookServiceRepository = container.get('bookServiceRepository');
        this.userTelegramRepository = container.get('userTelegramRepository');
    }

    async execute(msg, match) {
        const userTelegram = await this.userTelegramRepository.getTelegramUser(msg.from);
        const type = match[1];
        const bookServiceId = match[2] ? match[2] : null;
        const result = match[3] ? match[3] : null;

        if(type == 'confirm') {
            let bookedServiceResult;
            let callbackAnswer;
            const bookService = await this.bookServiceRepository.getBookServicesWithClient(bookServiceId);
            if(bookService.expert_id == userTelegram.user_id && result === 'yes') {
                bookedServiceResult = this.trans.get('booked_service_accept', msg, {
                    '%date%': bookService.start_date,
                    '%client%': bookService.full_name
                });
                callbackAnswer = this.trans.get('callback_answer_booked_service_accept', msg);
                await this.bookServiceRepository.setStatusBookService(bookServiceId, 'accepted')
            }
            else if(bookService.expert_id == userTelegram.user_id && result === 'no'){
                bookedServiceResult = this.trans.get('booked_service_denied', msg, {
                    '%date%': bookService.start_date,
                    '%client%': bookService.full_name
                });
                callbackAnswer = this.trans.get('callback_answer_booked_service_denied', msg);
                await this.bookServiceRepository.setStatusBookService(bookServiceId, 'denied')
            }
            else {
                bookedServiceResult = this.trans.get('error_security', msg);
                callbackAnswer = null;
            }

            this.action('editMessageText', {
                chat_id: msg.message.chat.id,
                message_id: msg.message.message_id,
                text: bookedServiceResult,
                parse_mode: 'HTML'
            });
            this.action('answerCallbackQuery', {
                callbackQueryId: msg.id,
                text: callbackAnswer
            });
        }
        else if(type == 'info') {
            const bookService = await this.bookServiceRepository.getBookServicesWithClient(bookServiceId);
            const typeService = this.getServiceType(msg, bookService.video_consultation, bookService.departure_to_the_client);
            this.action('editMessageText', {
                chat_id: msg.message.chat.id,
                message_id: msg.message.message_id,
                text: this.trans.get('command_cabinet_booked_services', msg, {
                    '%title%': bookService.title,
                    '%description%': bookService.description,
                    '%client%': bookService.full_name,
                    '%type%': typeService,
                    '%date%': bookService.start_date,
                    '%price%': bookService.price
                }),
                parse_mode: 'HTML',
                reply_markup: {inline_keyboard: [
                    [
                        {text: this.trans.get('button_yes', msg), callback_data: `book_service confirm ${bookService.id} yes`},
                        {text: this.trans.get('button_no', msg), callback_data: `book_service confirm ${bookService.id} no`}
                    ],
                    [
                        {text: this.trans.get('view_on_the_site', msg), url: process.env.DOMAIN+userTelegram.locale+'/cabinet/booked-services'}
                    ]
                ]}
            });
        }
    }

    getServiceType(msg, video_consultation, departure_to_the_client) {
        let type;
        if(video_consultation && !departure_to_the_client) {
            type = this.trans.get('command_cabinet_departure_to_the_client', msg);
        }
        else if(!video_consultation && departure_to_the_client) {
            type = this.trans.get('command_cabinet_info_online_service', msg);
        }
        else {
            type = this.trans.get('command_cabinet_info_default', msg);
        }
        return type;
    }
}

module.exports = BookServiceCallback;