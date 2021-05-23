baseCallback = require('./baseCallback');

class ServerInfoCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^serverInfo\s?(.+)?/
        this.msg = null;
        this.sourceQuery = require("source-server-query");
    }

    async execute(msg, params) {
        this.msg = msg;
        const serverKey = params[1];
        if(serverKey === 'mg') {
            var ip = "185.86.78.189";
            var port = 27032;

        }
        const serverData = await this.getServerInfo(ip, port);
        const vac = serverData.vac ? 'Yes' : 'No';
        const text = this.trans.get('server_info', msg, {
            '%serverName%': serverData.name,
            '%onlinePlayers%': serverData.playersnum,
            '%maxPlayers%': serverData.maxplayers,
            '%mapName%': serverData.map,
            '%ip%': ip,
            '%port%': port,
            '%vac%': vac,
            '%usersList%': this.usersList(serverData.players)
        });
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        this.action('editMessageText', {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id,
            text
        })
    }

    usersList(players = []) {
        let usersStrings = [];
        players.forEach((player) => {
            usersStrings.push(this.trans.get('user_info', this.msg, {
                '%userName%': player.name,
                '%score%': player.score,
                '%onlineTime%': player.duration,
            }));
        });
        return usersStrings.join('\n');
    }

    async getServerInfo(ip, port) {
        const serverData = await this.sourceQuery.info(ip, port, 2000);
        serverData.players = await this.sourceQuery.players(ip, port, 2000)
        return serverData;
    }
}

module.exports = ServerInfoCallback;