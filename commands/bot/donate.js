module.exports = {
    usage: 'Returns a link to donate to the development of this bot.',
    delete: true,
    cooldown: 30,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, '__**Please consider donating to the developement of this bot**__\n**<https://patreon.com/WishBot>**').catch();
    }
}