let utils = require('./../../utils/utils.js');

module.exports = {
    process: (bot, msg, suffix) => {
        if (commands.hasOwnProperty(suffix)&& suffix !== 'help') bot.createMessage(msg.channel.id, commands[suffix].help());
        else {
            let help = {};
            let helpMsg = `**__${bot.user.username} Commands\n__**`;
            for (let command in commands) {
                if (commands[command].type === 'admin' && !admins.includes(msg.author.id)) continue;
                if (!help.hasOwnProperty(commands[command].type)) help[commands[command].type] = [];
                if (!commands[command].privateCheck(msg)) help[commands[command].type].push(command);
            }
            help = utils.sortObj(help);
            for (let type in help) {
                helpMsg += `\n**${utils.toTitleCase(type)}:** ` + help[type].sort().map(cmd => '`' + cmd + '`').join(", ");
            }
            bot.createMessage(msg.channel.id, helpMsg+'\n\nFor more info on these commands use `help [command]`').catch();
        }
    }
}