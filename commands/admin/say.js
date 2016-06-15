module.exports = {
    usage: "Makes the bot say the mentioned message",
    delete: true,
    process: function(bot, msg, suffix) {
        bot.createMessage(msg.channel.id, suffix);
    }
}