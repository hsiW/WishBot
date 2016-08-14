let axios = require('axios');

module.exports = {
    usage: "Returns an embeded wewlad to the current channel(I'm so sorry)",
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        axios.get('http://i.imgur.com/iKTCAoN.png', {
            responseType: 'arraybuffer'
        }).then(response => {
            bot.createMessage(msg.channel.id, null, {
                file: response.data,
                name: 'wewlad.png'
            });
        }).catch();
    }
}