module.exports = {
    usage: "This bot prints a lenny in the current channel",
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, "( ͡° ͜ʖ ͡°)").catch();
    }
}