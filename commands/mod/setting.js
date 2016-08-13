let Database = require('./../../utils/Database.js'),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: '',
    delete: true,
    togglable: false,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix.toLowerCase() === 'tableflip') Database.toggleSetting(msg.channel.guild, suffix, null, msg.channel).then(result => bot.createMessage(msg.channel.id, "⚙ " + result + " ⚙").then(message => utils.messageDelete(bot, message))).catch()
        else if (suffix.toLowerCase().startsWith('welcome') || suffix.toLowerCase().startsWith('leave')) {
            let setting = suffix.split(' ')[0],
                message = suffix.substring(setting.length + 1, suffix.length);
            if (message.length > 128) bot.createMessage(msg.channel.id, "🚫 Welcome/Leave Messages are limited to 128 characters in length. 🚫").catch()
            else Database.toggleSetting(msg.channel.guild, setting, message, msg.channel).then(result => bot.createMessage(msg.channel.id, "⚙ " + result + " ⚙").then(message => utils.messageDelete(bot, message))).catch()
        } else bot.createMessage(msg.channel.id, "🚫 `" + suffix.split(' ')[0] + "` isn't an available setting 🚫").then(message => utils.messageDelete(bot, message)).catch()
    }
}