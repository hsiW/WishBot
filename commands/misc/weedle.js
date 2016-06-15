module.exports = {
    usage: "This bot prints a weedle in the current channel",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        bot.createMessage(msg.channel.id, "Weedle Weedle Weedle Wee\nhttp://media.giphy.com/media/h3Jm3lzxXMaY/giphy.gif");
    }
}