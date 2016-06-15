module.exports = {
    usage: "Smites the mentioned user or the message sender if no user mentioned\n`smite [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        if (msg.mentions.length === 1) {
            bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + " has been smited using the power granted to Bluee by the Cabbage Phoenix.");
        } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** has smited themself using power granted to Bluee by the Cabbage Phoenix.");
    }
}