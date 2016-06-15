module.exports = {
    usage: "Rolls a dice with 6 sides or more if a number is mentioned\n`[max value] or [none]`",
    delete: true,
    cooldown: 2,
    process: function(bot, msg, suffix) {
        var max = 6;
        if (suffix) max = suffix;
        bot.createMessage(msg.channel.id, "**" + msg.author.username + "** rolled a **" + (Math.floor(Math.random() * max) + 1) + "**! 🎲");
    }
}