var pun = require('./../../lists/puns.json').puns;

module.exports = {
    usage: 'Prints out a random pun or the pun at the position mentioned\n`pun [number] or [none]`',
    delete: true,
    cooldown: 2,
    process: (bot, msg, suffix) => {
        if (suffix && /^\d+$/.test(suffix) && pun.length >= parseInt(suffix) - 1) bot.createMessage(msg.channel.id, pun[suffix - 1]);
        else bot.createMessage(msg.channel.id, pun[Math.floor(Math.random() * (pun.length))]);
    }
}