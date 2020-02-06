class BaseCommand {
    constructor(container) {
        this.events = container.get('botEmitter');
        this.trans = container.get('botTranslator');
    }

    action(action, data) {
        this.events.emit(action, data);
    }
}

module.exports = BaseCommand;