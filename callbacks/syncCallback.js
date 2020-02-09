baseCallback = require('./baseCallback');

class SyncCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /sync/;
        this.userRepository = container.get('userRepository');
    }

    execute(msg, match) {
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
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

    async emailSync(msg) {
        const emailRegexp = /^([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,8}$/;
        const email = msg.text;
        if(emailRegexp.test(email)) {
            this.action('stopMessageListener', msg);

            // Search user in database
            const user = await this.userRepository.findOneBy({'email': email});
            if(user) {
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
                    reply_markup: keyboard => {
                        if(mailLink) {
                            const keyboard = {
                                inline_keyboard: [
                                    [{text: this.trans.get('button_email_goto'), url: mailLink}],
                                ]
                            };
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
}

module.exports = SyncCallback;