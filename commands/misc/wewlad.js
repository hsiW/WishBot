var request = require('request').defaults({
    encoding: null
});

module.exports = {
    usage: "This bot prints a wewlad in the current channel(I'm so sorry)",
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        request('http://i.imgur.com/iKTCAoN.png', (err, response, buffer) => {
            console.log(buffer);
            bot.createMessage(msg.channel.id, null, {
                file: buffer,
                name: 'wewlad.png'
            });
        });
    }
}