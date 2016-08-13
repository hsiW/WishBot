let getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Hugs the mentioned user or puts a hug if none mentioned\n`hug [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix && (msg.mentions || getName(msg, suffix))) {
            msg.mentions.length === 1 ? user = msg.mentions[0] : user = getName(msg, suffix).user;
            bot.createMessage(msg.channel.id, user.mention + ", (>^_^)> <(^.^<) ,**" + msg.author.username + "**").catch();
        } else bot.createMessage(msg.channel.id, "(>^_^)> <(^.^<)").catch();
    }
}