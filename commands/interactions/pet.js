module.exports = {
    usage: "Pets the mentioned user or pets this bot if none mentioned\n`pet [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        var links = ["http://i.imgur.com/Y3GB3K1.gif", "http://i.imgur.com/f7ByidM.gif", "http://i.imgur.com/LUpk6b6.gif"]
        if (msg.mentions.length === 1) {
            bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + " was petted by **" + msg.author.username + "**\n" + links[Math.floor(Math.random() * (links.length))]);
        } else bot.createMessage(msg.channel.id, "<@" + bot.user.id + "> was petted by **" + msg.author.username + "**\n" + links[Math.floor(Math.random() * (links.length))]);
    }
}