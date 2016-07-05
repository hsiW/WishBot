var utils = require('./../../utils/utils.js');

module.exports = {
        process:  (bot, msg, suffix) => {
                if (commands.hasOwnProperty(suffix)) bot.createMessage(msg.channel.id, commands[suffix].help());
                else {
                    let help = {};
                    let helpMsg = `**__${bot.user.username} Commands\n__**`;
                    for (let command in commands) {
                        if (!help.hasOwnProperty(commands[command]['type'])) help[commands[command]['type']] = [];
                        if (!commands[command].privateCheck(msg)) help[commands[command]['type']].push(command);
                    }
                    help = utils.sortObj(help);
                    for (let type in help) {
                        helpMsg += `\n**${utils.toTitleCase(type)}:** ${help[type].sort().filter(cmd =>{
            //if(!(serverSettings.hasOwnProperty(msg.channel.guild.id) && serverSettings[msg.channel.guild.id][cmd] === false))
                return `\`${cmd}\``;
            
        }).join(", ")}`;
            }
            bot.createMessage(msg.channel.id, helpMsg);
        }
    }
}
