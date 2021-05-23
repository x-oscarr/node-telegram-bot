const BaseCommand = require('./baseCommand');

class OnlineCommand extends BaseCommand {
    constructor(container) {
        super(container);
        this.regex = /\/online\s?(.+)?/;
        this.name = '/online';
        this.description = 'Get server info';

        this.serverInfoCallback = container.get('&serverInfo');
    }

    async execute(msg, params) {
        const serverKey = params[1];

        if(serverKey) {
            this.serverInfoCallback.action(msg, params);
            return;
        }

        this.action('sendMessage',{
            chat_id: msg.chat.id,
            text: this.trans.get('select_server', msg),
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: this.trans.get('mg_name', msg), callback_data: `serverInfo mg`},
                    ],
                    [{text: this.trans.get('close', msg), callback_data: `close`}]
                ]
            }
        });
    }
}

module.exports = OnlineCommand;