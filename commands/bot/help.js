let utils = require('./../../utils/utils.js');

module.exports = {
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            //Check is args are an alias and if so replace args with correct command text
            commandAliases.hasOwnProperty(args) ? args = commandAliases[args] : args;
            //If the args are a command and the command isn't help return the commands usage info
            if (commands.hasOwnProperty(args) && args !== 'help') resolve({
                message: commands[args].help()
            })
            else {
                let help = {}, //Help object for sorting by type before sending
                    helpMsg = `**__${bot.user.username} Commands\n__**`; //Start of help message by default
                for (let command in commands) {
                    if (commands[command].type === 'admin' && !admins.includes(msg.author.id)) continue; //Skip command if its an admin command and the user isn't an admin
                    if (commands[command].type === 'mod' && !((msg.channel.permissionsOf(msg.author.id).has('manageGuild')))) continue; //Skip mod command if user isn't a mod(has mangeGuild permission)
                    if (!help.hasOwnProperty(commands[command].type)) help[commands[command].type] = []; //If the help object doesn't have the command type property already add it
                    if (!commands[command].privateCheck(msg)) help[commands[command].type].push(command); //If the command passes returns false for the private check add to help object
                }
                help = utils.sortObj(help); //Sort help message alphabetically by type
                //Loop for each type in the help message
                for (let type in help) {
                    //Create each help type category and sort the commands for that type alphabetically
                    helpMsg += `\n**${utils.toTitleCase(type)}:** ` + help[type].sort().map(cmd => '`' + cmd + '`').join(", ");
                }
                //Return help message
                resolve({
                    message: helpMsg + '\n\nFor more info on these commands use `help [command]`'
                });
            }
        });
    }
}