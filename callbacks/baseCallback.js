class BaseCallback {
    constructor(container) {
        this.events = container.get('botEmitter');
        this.trans = container.get('botTranslator');
    }

    action(action, data = null) {
        if(data && data.msg) {
            const messageObj = data.msg.message ? data.msg.message : data.msg;
            if(!data.chat_id) {
                data.chat_id = messageObj.chat.id;
            }
            if(!data.message_id) {
                data.message_id = messageObj.message_id;
            }
        }
        this.events.emit(action, data);
    }
}

module.exports = BaseCallback;