module.exports = {
    usage: 'Prints out the last 5 changes for this bot.',
    delete: true,
    cooldown: 10,
    process: (bot, msg) => {
        bot.getChannelMessages('143904176613752832', 5).then(messages => {
            var msgString = '__**Changelog**__\n';
            messages.forEach(index => {
                msgString += "\n\n" + index.content;
            });
            bot.getDMChannel(msg.author.id).then(privateChannel =>
                bot.createMessage(privateChannel.id, msgString)
            ).catch(err => console.log(errorC(err.stack)))
        }).catch(err => console.log(errorC(err)));
    }
}