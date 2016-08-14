module.exports = {
    usage: 'Pings this bot, useful for checking if the bots working correctly. *(Not usually accurate)*',
    cooldown: 5,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, "PONG!").then(message => {
            bot.editMessage(msg.channel.id, message.id, 'PONG! | *' + (new Date(message.timestamp) - new Date(msg.timestamp)) + '*ms')
        }).catch()
    }
}