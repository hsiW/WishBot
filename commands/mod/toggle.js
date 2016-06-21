var Database = require('./../../utils/Database.js');
var utils = require('./../../utils/utils.js');

module.exports = {
    usage: 'Toggles the currently enabled commands.  Requires the user to have the `manageRoles` premission.\n`toggle [command to toggle]`',
    delete: true,
    togglable: false,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        suffix = suffix.toLowerCase();
        if (commands.hasOwnProperty(suffix)) {
            if (commands[suffix].togglable = false) bot.createMessage(msg.channel.id, 'I`m sorry, **' + msg.author.name + '**-senpai but that command is not togglable.').then(message => utils.messageDelete(bot, message, null));
            else Database.toggle(bot, msg, suffix);
        } else if (suffix === 'unflip' || suffix === 'welcome') Database.toggle(bot, msg, suffix);
        else if (!(commands.hasOwnProperty(suffix))) bot.createMessage(msg.channel.id, 'Thats not a valid toggle, please use `welcome`, `unflip`, or any command name.').then(message => utils.messageDelete(bot, message, null));
    }
}