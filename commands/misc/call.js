module.exports = {
    usage: 'Tells everyone you`d like a call',
    delete: true,
    cooldown: 10,
    process: function(bot, msg) {
        if (msg.channel.permissionsOf(msg.author.id).json.mentionEveryone) bot.createMessage(msg.channel.id, {
            content: '☎ @everyone, **' + msg.author.username + '** would like to have a call! ☎',
            disableEveryone: false
        });
        else bot.createMessage(msg.channel.id, '☎ Everyone, **' + msg.author.username + '** would like to have a call! ☎');
    }
}