let Database = require('./../../utils/Database.js'),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: '',
    delete: true,
    cooldown: 5,
    process: (bot, msg) => {
        Database.checkChannel(msg.channel).then(() => {
            Database.ignoreChannel(msg.channel).then(() =>
                bot.createMessage(msg.channel.id, '🔇 Sucessfully muted commands in ' + msg.channel.mention + ' 🔇').then(message => utils.messageDelete(bot, message)))
        }).catch(() => {
            Database.unignoreChannel(msg.channel).then(() =>
                bot.createMessage(msg.channel.id, '🔈 Sucessfully unmuted commands in ' + msg.channel.mention + ' 🔈').then(message => utils.messageDelete(bot, message)))
        })
    }
}