var quote = require('./../../lists/animequotes.json');

module.exports = {
    usage: 'Prints out a random anime quote or the quote at the position mentioned\n`quote [number] or [none]`',
    delete: true,
    cooldown: 2,
    process: (bot, msg, suffix) => {
        if (suffix && /^\d+$/.test(suffix) && quote.length >= parseInt(suffix) - 1) bot.createMessage(msg.channel.id, quote[suffix - 1]);
        else bot.createMessage(msg.channel.id, quote[Math.floor(Math.random() * (quote.length))]);
    }
}