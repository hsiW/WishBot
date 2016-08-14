let lewd = require('./../../lists/lewd.json');

module.exports = {
    usage: "Returns an image to use incase of lewdness.",
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, lewd[Math.floor(Math.random() * (lewd.length))]).catch();
    }
}