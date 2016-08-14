var utils = require('./../../utils/utils.js'),
    Database = require('./../../utils/Database.js');

module.exports = {
    usage: 'Toggles the currently enabled commands.\n`toggle [command]`',
    delete: true,
    togglable: false,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let command = suffix.toLowerCase();
        if (commands.hasOwnProperty(command) && commands[command].togglable === true) {
            Database.toggleCommand(msg.channel.guild, command).then(response => {
                bot.createMessage(msg.channel.id, `🔧 ${response} 🔧`).then(message => utils.messageDelete(bot, message)).catch();
            }).catch(err => console.log(errorC(err)));
        } else if (commands.hasOwnProperty(command) && commands[command].togglable === false) bot.createMessage(msg.channel.id, `⛔ ${suffix} cannot be toggled off ⛔`).then(message => utils.messageDelete(bot, message)).catch();
        else bot.createMessage(msg.channel.id, `⛔ ${suffix} isn't a valid command ⛔`).then(message => utils.messageDelete(bot, message)).catch();
    }
}