baseCallback = require('./baseCallback');

class SyncCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^sync\s?(resync)?/;
        this.redis = container.get('botRedis');
        this.userRepository = container.get('userRepository');
        this.userTelegramRepository = container.get('userTelegramRepository');
    }

    async execute(msg, match) {
        const type = match[1];
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        const userTelegram = this.userTelegramRepository.getTelegramUser(msg.from);
        if((userTelegram && userTelegram.user_id) || type === 'resync') {
            this.action('editMessageText', {
                msg,
                text: this.trans.get('command_start_synchronisation', msg)
            });
            this.action('startMessageListener', {
                msg,
                cmd: this,
                1: 'emailSync'
            });
        }
        else {
            await this.userIsAlreadySync(msg);
        }
    }

    async emailSync(msg) {
        const emailRegexp = /^([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,8}$/;
        const email = msg.text;
        if(emailRegexp.test(email)) {
            // Search user in database
            const user = await this.userRepository.findOneBy({'email': email});
            if(user) {
                this.action('stopMessageListener', msg);

                this.redis.add({
                    type: 'syncEmail',
                    number: user.id,
                    telegramUser: msg.from,
                    telegramChat: msg.chat
                }, process.env.REDIS_PUB);

                let mailLink;
                switch (email.split('@', 2)[1]) {
                    case 'gmail.com': mailLink = 'https://mail.google.com'; break;
                    case 'yandex.ru': mailLink = 'https://mail.yandex.ru'; break;
                    case 'mail.ru':  mailLink = 'https://mail.ru'; break;
                    case 'i.ua': mailLink = 'https://www.i.ua'; break;
                    case 'ukr.net': mailLink = 'https://www.ukr.net'; break;
                    default: mailLink = false; break;
                }

                this.action('sendMessage', {
                    msg,
                    text: this.trans.get('command_start_send_message', msg, {'%email%': email}),
                    reply_markup: () => {
                        if(mailLink) {
                            return  { inline_keyboard: [
                                [{text: this.trans.get('button_email_goto'), url: mailLink}],
                            ]};
                        }
                    }
                });
            }
            else {
                this.action('sendMessage', {
                    msg,
                    text: this.trans.get('command_start_not_found', msg, {'%email%': email}),
                    parse_mode: 'HTML'
                });
            }
        }
        else  {
            this.action('sendMessage', {msg, text: this.trans.get('command_start_is_not_email', msg)});
        }
    }

    async userIsAlreadySync(msg) {
        this.action('editMessageText', {
            msg,
            text: this.trans.get('command_start_user_is_already_sync', msg),
            reply_markup: {inline_keyboard: [
                [{text: this.trans.get('button_start_resync_yes', msg), callback_data:'sync resync'}],
                [{text: this.trans.get('button_start_resync_no', msg), callback_data: 'close'}]
            ]}
        });
    }
}

module.exports = SyncCallback;