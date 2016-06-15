module.exports = {
    usage: "Echo's the entered text",
    delete: true,
    cooldown: 2,
    process: function(bot, msg, suffix) {
        if (!suffix) suffix = "echo";
        bot.createMessage(msg.channel.id, `💭 - ${suffix}`)
    }
}