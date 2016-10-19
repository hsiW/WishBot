let Database = require('./../../utils/Database.js'),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: 'Toggles all commands from being used in the channel in which this command is used.',
    dm: false,
    togglable: false,
    cooldown: 5,
    process: (msg) => {
        return new Promise(resolve => {
            Database.checkChannel(msg.channel).then(() => {
                Database.ignoreChannel(msg.channel).then(() => resolve({
                    message: '🔇 Sucessfully muted commands in ' + msg.channel.mention + ' 🔇',
                    delete: true
                })).catch(() => {
                    Database.unignoreChannel(msg.channel).then(() => resolve({
                        message: '🔈 Sucessfully unmuted commands in ' + msg.channel.mention + ' 🔈',
                        delete: true
                    }))
                })
            })
        })
    }
}