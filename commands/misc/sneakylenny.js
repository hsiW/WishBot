module.exports = {
    usage: "Returns a Sneaky Lenny in the current channel",
    delete: true,
    cooldown: 5,
    process: (bot, msg) =>{
        bot.createMessage(msg.channel.id, "┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴").catch();
    }
}