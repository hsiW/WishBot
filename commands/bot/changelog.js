module.exports = {
    usage: 'Returns the last changelog for the bot.',
    delete: true,
    cooldown: 10,
    process: (bot, msg) => {
        bot.getMessages('143904176613752832', 1).then(messages => {
            let msgString = '__**Changelog**__\n\n' + message[0].content;
            bot.getDMChannel(msg.author.id).then(privateChannel => bot.createMessage(privateChannel.id, msgString))
        }).catch()
    }
}