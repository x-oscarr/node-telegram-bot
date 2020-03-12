const build = function (data) {
    // {type:"emailSync",text:"insane.yan@gmail.com",uid:null}
    return  {
        body: JSON.stringify(data),
        headers: {
            type: 'App\\Message\\FromTelegramMessage',
            'X-Message-Stamp-Symfony\\Component\\Messenger\\Stamp\\BusNameStamp': '[{"busName":"messenger.bus.default"}]',
            'Content-Type': 'application/json'
        }
    }
}

module.exports = {
    build
};