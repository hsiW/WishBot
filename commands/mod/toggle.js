var utils = require('./../../utils/utils.js'),
    Database = require('./../../utils/Database.js');

module.exports = {
    usage: 'Toggles the currently enabled commands.  Requires the user to have the `manageRoles` premission.\n`toggle [command to toggle]`',
    delete: true,
    togglable: false,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let command = suffix.toLowerCase();
        if (commands.hasOwnProperty(command) && commands[command].togglable === true) {
            Database.toggleCommand(msg.channel.guild, command).then(response => {
                bot.createMessage(msg.channel.id, `🔧 ${response} 🔧`)
            }).catch(err => console.log(errorC(err)));
        } else if (commands.hasOwnProperty(command) && commands[command].togglable === false) bot.createMessage(msg.channel.id, `⛔ ${suffix} cannot be toggled off ⛔`)
        else bot.createMessage(msg.channel.id, `⛔ ${suffix} isn't a valid command ⛔`)
    }
}