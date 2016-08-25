module.exports = {
    usage: "Rolls a dice with 6 sides, more if a number is inputted, and returns the result.\n`roll [none] or [max value]`",
    cooldown: 2,
    process: (bot, msg, suffix) => {
        let max = 6;
        if (suffix && /^\d+$/.test(suffix)) max = suffix;
        bot.createMessage(msg.channel.id, `🎲 **${msg.author.username}** rolled a **${(Math.floor(Math.random() * max) + 1)}**! 🎲`).catch();
    }
}