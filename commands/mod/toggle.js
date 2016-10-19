let Database = require('./../../utils/database.js');

module.exports = {
    usage: 'Toggles the currently enabled commands. Not all commands are togglable.\n`toggle [command]`',
    dm: false,
    delete: false,
    togglable: false,
    cooldown: 5,
    process: (msg, args) => {
        return new Promise(resolve => {
            let command = args.toLowerCase();
            if (commandAliases.hasOwnProperty(command)) command = commandAliases[command];
            if (commands.hasOwnProperty(command) && commands[command].togglable === true) {
                Database.toggleCommand(msg.channel.guild, command).then(response => {
                    resolve({
                        message: `🔧 ${response} 🔧`,
                        delete: true
                    })
                })
            } else if (commands.hasOwnProperty(command) && commands[command].togglable === false) resolve({
                message: `⛔ ${args} cannot be toggled off ⛔`,
                delete: true
            })
            else resolve({
                message: `⛔ ${args} isn't a valid command ⛔`,
                delete: true
            })
        });
    }
}