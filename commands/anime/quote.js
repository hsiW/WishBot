let quote = require('./../../lists/animequotes.json');

module.exports = {
    usage: 'Retuns a random anime quote.',
    delete: true,
    cooldown: 2,
    process: (bot, msg, suffix) => {
        bot.createMessage(msg.channel.id, quote[Math.floor(Math.random() * (quote.length))]).catch();
    }
}