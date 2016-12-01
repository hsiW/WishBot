var Database = require('./../../utils/database.js');

module.exports = {
    usage: '**Toggle commands** on/off. **Not all** commands are togglable. Check their individual **help messages for more info**.\n\n`toggle [command]`',
    dm: false,
    togglable: false,
    delete: true,
    permissions: {
        'manageGuild': true
    },
    process: (msg, args) => {
        return new Promise(resolve => {
            let command = args.toLowerCase(); //Convert args to lowercase for easier use
            if (commandAliases.hasOwnProperty(command)) command = commandAliases[command]; //Checks if commands is an aliases of another command
            //If the command exists and if the command is togglable toggle it to the inverse of whatever it is now
            if (commands.hasOwnProperty(command) && commands[command].togglable === true) {
                Database.toggleCommand(msg.channel.guild.id, command).then(response => {
                    resolve({
                        message: `🔧 ${response} 🔧`,
                        delete: true
                    })
                })
            } else if (commands.hasOwnProperty(command) && commands[command].togglable === false) resolve({
                    message: `⛔ ${args} cannot be toggled off. ⛔`,
                    delete: true
                }) //If command exists but cannot be toggled
            else resolve({
                    message: `⛔ ${args} isn't a valid command. ⛔`,
                    delete: true
                }) //If command doesn't exist
        });
    }
}