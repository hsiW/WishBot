module.exports = {
    usage: "Echo's the inputted text.\n`echo [text to echo]`",
    cooldown: 2,
    process: function(bot, msg, suffix) {
        if (!suffix) suffix = "echo";
        bot.createMessage(msg.channel.id, `💭 - ${suffix}`).catch();
    }
}