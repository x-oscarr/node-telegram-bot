baseCallback = require('./baseCallback');

class MainMenuCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^\/content\s([a-zA-Z0-9]+)/;
        this.contentRepository = container.get('contentRepository');
    }

    async execute(msg, match) {
        const slug = match[1];
        let content = this.contentRepository.findOneBy({slug});
        if(content) {
            let title = content.title ? this.trans.get('content_title', msg, {'%title%': content.title}) : '';
            let text = this.trans.get('content_block', msg, {'%text%': content.text});
            let link = content.link ? this.trans.get('content_link', msg, {'%link%': content.link}) : '';
            let files = content.files ? JSON.parse(content.files) : {};
            text = title + text + link;

            this.action(content.image ? 'sendPhoto' : 'sendMessage', {
                chat_id: msg.message.chat.id,
                text,
                photo: content.photo ? content.photo : null,
            });

            for(let index in files) {
                this.action('sendDocument', {
                    chat_id: msg.message.chat_id,
                    doc: files[index].file,
                    text: files[index].text ? files[index].text : null
                });
            }
        }
    }
}

module.exports = MainMenuCallback;