module.exports = {
    usage: "Tells everyone you'd like a call. Uses an @everyone mention if the user has permission to do so.",
    delete: true,
    cooldown: 10,
    process: (bot, msg) => {
        if (msg.channel.permissionsOf(msg.author.id).has('mentionEveryone')) bot.createMessage(msg.channel.id, {
            content: '☎ @everyone, **' + msg.author.username + '** would like to have a call! ☎',
            disableEveryone: false
        }).catch();
        else bot.createMessage(msg.channel.id, '☎ Everyone, **' + msg.author.username + '** would like to have a call! ☎').catch();
    }
}