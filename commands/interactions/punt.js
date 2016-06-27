var getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Punts the mentioned user into the San Francisco Bay\n`punt [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix && (msg.mentions || getName(msg, suffix))) {
            msg.mentions.length === 1 ? user = msg.channel.guild.members.get(msg.mentions[0]) : user = getName(msg, suffix);
            bot.createMessage(msg.channel.id, '<@' + user.id + '>' + ", was punted into the San Francisco Bay by, **" + msg.author.username + "**!");
        } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** went to punt nothing and fell into the San Francisco Bay.");
    }
}