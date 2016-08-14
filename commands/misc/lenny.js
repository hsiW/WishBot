module.exports = {
    usage: "Returns a Lenny to the current channel.",
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, "( ͡° ͜ʖ ͡°)").catch();
    }
}