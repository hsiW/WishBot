var lewd = require('./../../lists/lewd.json');

module.exports = {
    usage: "Use this in case of lewd",
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, lewd[Math.floor(Math.random() * (lewd.length))]);
    }
}