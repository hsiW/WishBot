let utils = require('./../../utils/utils.js');

module.exports = {
    process: (msg, args) => {
        return new Promise(resolve => {
            if (commands.hasOwnProperty(args) && args !== 'help') resolve({
                message: commands[args].help()
            })
            else {
                let help = {},
                    helpMsg = `**__${bot.user.username} Commands\n__**`;
                for (let command in commands) {
                    if (commands[command].type === 'admin' && !admins.includes(msg.author.id)) continue;
                    if (!help.hasOwnProperty(commands[command].type)) help[commands[command].type] = [];
                    if (!commands[command].privateCheck(msg)) help[commands[command].type].push(command);
                }
                help = utils.sortObj(help);
                for (let type in help) {
                    helpMsg += `\n**${utils.toTitleCase(type)}:** ` + help[type].sort().map(cmd => '`' + cmd + '`').join(", ");
                }
                resolve({
                    message: helpMsg + '\n\nFor more info on these commands use `help [command]`'
                });
            }
        });
    }
}