module.exports = {
    usage: 'Returns the **most recent change log entry** from the #changelog channel on the **Offical Yuki-chan Server**.',
    cooldown: 30,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            //Gets Messages from the changelog channel in the Yuki Server and returns the most recent changelog message
            var channel = bot.getChannel('143904176613752832')
            channel.getMessage(channel.lastMessageID).then(message => resolve({
                message: message.content
            }))
        })
    }
}