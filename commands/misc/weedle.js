module.exports = {
    usage: "Its Weedle, what do you expect?",
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, "**Weedle Weedle Weedle Wee**\nhttp://media.giphy.com/media/h3Jm3lzxXMaY/giphy.gif").catch();
    }
}