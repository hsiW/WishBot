module.exports = {
    usage: "Hugs the mentioned user or puts a hug if none mentioned\n`hug [mentioned user] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        if (msg.mentions.length === 1) {
            bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + ", (>^_^)> <(^.^<) ,**" + msg.author.username + "**");
        } else bot.createMessage(msg.channel.id, "(>^_^)> <(^.^<)");
    }
}