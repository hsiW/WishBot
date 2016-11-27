module.exports = {
    usage: "Tell **everyone** you'd like to start a **call**. Uses an **@everyone mention** if the user has permission to do so.",
    dm: false,
    cooldown: 25,
    process: msg => {
        return new Promise(resolve => {
            if (msg.channel.permissionsOf(msg.author.id).has('mentionEveryone')) resolve({
                message: '☎ @everyone, **' + msg.author.username + '** would like to have a call! ☎',
                disableEveryone: false
            }).catch();
            else resolve({
                message: '☎ Everyone, **' + msg.author.username + '** would like to have a call! ☎'
            });
        });
    }
}