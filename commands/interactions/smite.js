var getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Smites the mentioned user or the message sender if no user mentioned\n`smite [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        if (suffix && (msg.mentions || getName(msg, suffix))) {
            msg.mentions.length === 1 ? user = msg.channel.guild.members.get(msg.mentions[0]) : user = getName(msg, suffix);
            bot.createMessage(msg.channel.id, '<@' + user.id + '>' + " has been smited using the power granted to Bluee by the Cabbage Phoenix.");
        } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** has smited themself using power granted to Bluee by the Cabbage Phoenix.");
    }
}