module.exports = {
    usage: "Rolls a dice with 6 sides or more if a number is mentioned\n`[max value] or [none]`",
    cooldown: 2,
    process: (bot, msg, suffix) => {
        let max = 6;
        if (suffix) max = suffix;
        bot.createMessage(msg.channel.id, `**${msg.author.username}** rolled a **${(Math.floor(Math.random() * max) + 1)}**! 🎲`).catch();
    }
}