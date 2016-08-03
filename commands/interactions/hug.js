let getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Hugs the mentioned user or puts a hug if none mentioned\n`hug [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix && (msg.mentions || getName(msg, suffix))) {
            msg.mentions.length === 1 ? user = msg.channel.guild.members.get(msg.mentions[0]) : user = getName(msg, suffix);
            bot.createMessage(msg.channel.id, '<@' + user.id + '>' + ", (>^_^)> <(^.^<) ,**" + msg.author.username + "**");
        } else bot.createMessage(msg.channel.id, "(>^_^)> <(^.^<)");
    }
}