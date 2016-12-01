module.exports = {
    usage: "Tell **everyone** you'd like to start a **call**. Uses an **@everyone mention** if the user has permission to do so.",
    delete: true,
    dm: false,
    cooldown: 30,
    process: msg => {
        return new Promise(resolve => {
            //Check if the command user can mention everyone and if so send an @everyone
            if (msg.channel.permissionsOf(msg.author.id).has('mentionEveryone')) resolve({
                message: '☎ @everyone, **' + msg.author.username + '** would like to have a call! ☎',
                disableEveryone: false
            })
            else resolve({
                message: '☎ Everyone, **' + msg.author.username + '** would like to have a call! ☎'
            });
        });
    }
}