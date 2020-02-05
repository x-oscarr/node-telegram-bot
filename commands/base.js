class BaseCommand {
    constructor(container) {
        this.events = container.get('botEmitter');
    }

    action(action, data) {
        this.events.emit(action, data);
    }
}

module.exports = BaseCommand;