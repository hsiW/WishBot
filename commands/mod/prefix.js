let utils = require('./../../utils/utils.js'),
    Database = require('./../../utils/Database.js');

module.exports = {
    usage: 'Changes the current prefix to the inputted term. Spaces cannot be used.\n`prefix [new prefix]`',
    delete: true,
    togglable: false,
    cooldown: 20,
    process: (bot, msg, suffix) => {
        Database.changePrefix(msg.channel.guild, suffix).then(() => {
            bot.createMessage(msg.channel.id, "📋 Successfully changed prefix to `" + suffix + "` 📋").catch();
        }).catch(err => {
            console.log(errorC(err))
            bot.createMessage(msg.channel.id, "⛔ " + err + " ⛔").catch();
        })
    }
}