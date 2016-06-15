module.exports = {
    usage: "Punts the mentioned user into the San Francisco Bay\n`punt [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        if (msg.mentions.length === 1) {
            bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + ", was punted into the San Francisco Bay by, **" + msg.author.username + "**!");
        } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** went to punt nothing and fell into the San Francisco Bay.");
    }
}