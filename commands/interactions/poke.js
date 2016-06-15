module.exports = {
    usage: "Pokes the mentioned user or pokes this bot if none mentioned\n`poke [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        var randomPoke = Math.random() < 0.5 ? "http://i.imgur.com/J4Vr0Hg.gif" : "http://i.imgur.com/6KpNE1V.gif";
        if (msg.mentions.length === 1) {
            bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + " was poked by **" + msg.author.username + "**\n" + randomPoke);
        } else bot.createMessage(msg.channel.id, "<@" + bot.user.id + "> was poked by **" + msg.author.username + "**\n" + randomPoke);
    }
}