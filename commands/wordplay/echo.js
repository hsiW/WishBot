module.exports = {
    usage: "Echo's the entered text",
    cooldown: 2,
    process: function(bot, msg, suffix) {
        if (!suffix) suffix = "echo";
        bot.createMessage(msg.channel.id, `💭 - ${suffix}`)
    }
}