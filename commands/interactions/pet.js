var getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Pets the mentioned user or pets this bot if none mentioned\n`pet [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let links = ["http://i.imgur.com/Y3GB3K1.gif", "http://i.imgur.com/f7ByidM.gif", "http://i.imgur.com/LUpk6b6.gif"]
        if (suffix && (msg.mentions || getName(msg, suffix))) {
            msg.mentions.length === 1 ? user = msg.channel.guild.members.get(msg.mentions[0]) : user = getName(msg, suffix);
            bot.createMessage(msg.channel.id, '<@' + user.id + '>' + " was petted by **" + msg.author.username + "**\n" + links[Math.floor(Math.random() * (links.length))]);
        } else bot.createMessage(msg.channel.id, "<@" + bot.user.id + "> was petted by **" + msg.author.username + "**\n" + links[Math.floor(Math.random() * (links.length))]);
    }
}