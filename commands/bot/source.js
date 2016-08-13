module.exports = {
    usage: 'Gives you a link to the source for this bot.',
    cooldown: 30,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, '__**The source code for this bot may be found here:**__\n**<https://github.com/hsiw/Wishbot>**').catch();
    }
}