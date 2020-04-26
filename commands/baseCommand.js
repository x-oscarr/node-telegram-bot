class BaseCommand {
    constructor(container) {
        this.events = container.get('emitter');
        this.trans = container.get('translator');
    }

    action(action, data) {
        if(!data.chat_id && data.msg) {
            data.chat_id = msg.chat.id;
        }
        this.events.emit(action, data);
    }
}

module.exports = BaseCommand;