module.exports = {
    usage: "Slaps the mentioned user or the message sender if no user mentioned\n`slap [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        if (msg.mentions.length === 1) bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + " was slapped by **" + msg.author.username + "**!");
        else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** slapped themselves!");
    }
}