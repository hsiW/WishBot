module.exports = {
    usage: 'Returns a link to the source code for this bot.',
    cooldown: 30,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, '__**The source code for this bot can be found here:**__\n**<https://github.com/hsiw/Wishbot>**').catch();
    }
}