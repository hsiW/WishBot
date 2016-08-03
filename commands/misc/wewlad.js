let axios = require('axios');

module.exports = {
    usage: "This bot prints a wewlad in the current channel(I'm so sorry)",
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        axios.get('http://i.imgur.com/iKTCAoN.png').then(response => {
            bot.createMessage(msg.channel.id, null, {
                file: response.data,
                name: 'wewlad.png'
            }).catch(err => console.log(errorC(err)));
        });
    }
}