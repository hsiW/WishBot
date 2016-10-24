let Database = require('./../../utils/database.js');

module.exports = {
    usage: 'Toggles all commands from being used in the channel in which this command is used.',
    aliases: ['cmute'],
    dm: false,
    togglable: false,
    cooldown: 5,
    process: msg => {
        return new Promise(resolve => {
            //Checks to see if the channel currently exists in the database or not(is muted if in database)
            Database.checkChannel(msg.channel.id).then(() => {
                //If channel isn't in the database add it to the database(which mutes it)
                Database.muteChannel(msg.channel.id).then(() => resolve({
                    message: '🔇 Sucessfully muted commands in ' + msg.channel.mention + ' 🔇',
                    delete: true
                }))
            }).catch(() => {
                //If the channel is in the database remove it(unmutes the channel)
                Database.unmuteChannel(msg.channel.id).then(() => resolve({
                    message: '🔈 Sucessfully unmuted commands in ' + msg.channel.mention + ' 🔈',
                    delete: true
                }))
            })
        })
    }
}