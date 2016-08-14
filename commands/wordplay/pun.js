let pun = require('./../../lists/puns.json');

module.exports = {
    usage: 'Returns out a random pun.',
    cooldown: 2,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, pun[Math.floor(Math.random() * (pun.length))]).catch();
    }
}