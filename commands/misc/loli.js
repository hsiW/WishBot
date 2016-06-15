var loli = require('./../../lists/loli.json').loli;

module.exports = {
    usage: "This bot prints a random loli in the current channel",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        bot.createMessage(msg.channel.id, loli[Math.floor(Math.random() * (loli.length))]);
    }
}