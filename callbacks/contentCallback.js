baseCallback = require('./baseCallback');

class MainMenuCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^content\s([a-zA-Z0-9_]+)/;
        this.userRepository = container.get('userRepository');
        this.contentRepository = container.get('contentRepository');
    }

    async execute(msg, match) {
        //this.action('answerCallbackQuery', {callback_query_id: msg.id});
        const slug = match[1];
        const userRole = await this.userRepository.getRole(msg);
        if(slug === 'menu') {
            return this.contentMenu(msg, userRole);
        }
        let content = await this.contentRepository.findOneBy({slug});
        if(content) {
            let title = content.title ? this.trans.get('content_title', msg, {'%title%': content.title}) : '';
            let text = content.text ? this.trans.get('content_block', msg, {'%text%': content.text}) : '';
            let link = content.link ? this.trans.get('content_link', msg, {'%link%': content.link}) : '';
            let files = content.files ? JSON.parse(content.files) : {};
            const caption = title + text + link;
            if(content.image) {
                this.action('editMessageMedia', {
                    chat_id: msg.message.chat.id,
                    message_id: msg.message.message_id,
                    media: {
                        caption,
                        type: 'photo',
                        media: content.image,
                        parse_mode: 'HTML'
                    },
                    reply_markup: { inline_keyboard: [
                        [
                            {text: this.trans.get('button_back', msg), callback_data: 'content menu'},
                            {text: this.trans.get('button_close', msg), callback_data: 'close'}
                        ]
                    ]}
                });
            } else {
                this.action('editMessageCaption', {
                    chat_id: msg.message.chat.id,
                    message_id: msg.message.message_id,
                    caption,
                    parse_mode: 'HTML',
                    reply_markup: { inline_keyboard: [
                        [
                            {text: this.trans.get('button_back', msg), callback_data: 'content menu'},
                            {text: this.trans.get('button_close', msg), callback_data: 'close'}
                        ]
                    ]}
                });
            }
            for(let index in files) {
                this.action('sendDocument', {
                    chat_id: msg.message.chat_id,
                    doc: files[index].file,
                    text: files[index].text ? files[index].text : null,
                });
            }
        }
    }

    async contentMenu(msg) {
        //this.action('answerCallbackQuery', {callback_query_id: msg.id});
        let keyboard;
        const message = msg.message ? msg.message : msg;
        const userRole = await this.userRepository.getRole(msg);
        switch (userRole) {
            case this.userRepository.ROLE_STUDENT: keyboard = this.menuKeyboardStudent(msg); break;
            case this.userRepository.ROLE_TEACHER: keyboard = this.menuKeyboardTeacher(msg); break;
            case this.userRepository.ROLE_ENTRANT: keyboard = this.menuKeyboardEntrant(msg); break;
            default: keyboard = this.menuKeyboardStudent(msg);
        }
        this.action('editMessageMedia', {
            chat_id: message.chat.id,
            message_id: message.message_id,
            media: {
                type: 'photo',
                media: 'https://dev.root7.ru/content.jpg',
                caption: this.trans.get('content_menu', msg),
                parse_mode: 'HTML'
            },
            reply_markup: keyboard
        });
    }

    menuKeyboardStudent(msg) {
        return {
            inline_keyboard: [
            [
                {text: 'Карта ЛНТУ', callback_data: 'content map'},
                {text: 'Розклад дзвінків', callback_data: 'content schedule_lessons'}
            ], [
                {text: 'Оплата гуртожитку', callback_data: 'content rekv_gurtojitok'},
                {text: 'Оплата навчання', callback_data: 'content rekv_lntu'},
            ], [
                {text: 'Список тижднів', callback_data: 'content weeks'},
                {text: 'Список викладачів', callback_data: 'content teachers_list'},
            ], [
                {text: this.trans.get('button_back', msg), callback_data: 'main_menu menu'},
                {text: this.trans.get('button_close', msg), callback_data: 'close'}
            ]
        ]}
    }
    menuKeyboardTeacher(msg) {
        return {
            inline_keyboard: [
            [
                {text: 'Карта ЛНТУ', callback_data: 'content map'},
                {text: 'Розклад дзвінків', callback_data: 'content schedule_lessons'}
            ], [
                {text: 'Список тижднів', callback_data: 'content weeks'}
            ], [
                {text: this.trans.get('button_back', msg), callback_data: 'main_menu'},
                {text: this.trans.get('button_close', msg), callback_data: 'close'}
            ]
        ]}
    }
    menuKeyboardEntrant(msg) {
        return {
            inline_keyboard: [
            [
                {text: 'Карта ЛНТУ', callback_data: 'content map'},
                {text: 'Вартість навчанняв', callback_data: 'content vartist_navchannya'}
            ], [
                {text: 'Для випускників шкіл', callback_data: 'content dlya_vipusknikiv_shkil'}
            ], [
                {text: 'Для випускників коледжів', callback_data: 'content komisiya'},
            ], [
                {text: 'Правило прийому', callback_data: 'content pravila_priyomu'},
                {text: 'Приймальна комісія', callback_data: 'content teachers_list'},
            ], [
                {text: this.trans.get('button_back', msg), callback_data: 'main_menu'},
                {text: this.trans.get('button_close', msg), callback_data: 'close'}
            ]
        ]}
    }
}

module.exports = MainMenuCallback;