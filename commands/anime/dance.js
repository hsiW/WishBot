var dance = require('./../../lists/dance.json').dance;

module.exports = {
    usage: "This bot dances around in the current channel using a random dance",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        bot.createMessage(msg.channel.id, "🎶 💃 *Dances Around* 💃 🎶\n" + dance[Math.floor(Math.random() * (dance.length))]);
    }
}