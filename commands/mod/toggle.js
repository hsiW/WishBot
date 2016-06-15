var Database = require('./../../utils/Database.js');

module.exports = {
    usage: 'Toggles the currently enabled commands.  Requires the user to have the `manageRoles` premission.\n`toggle [command to toggle]`',
    delete: true,
    togglable: false,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        suffix = suffix.toLowerCase();
        if (commands.hasOwnProperty(suffix)) {
            if (commands[suffix].togglable = false) bot.createMessage(msg.channel.id, 'I`m sorry, **' + msg.author.name + '**-senpai but that command is not togglable.');
            else Database.toggle(bot, msg, suffix);
        } else if (suffix === 'unflip' || suffix === 'welcome') Database.toggle(bot, msg, suffix);
        else if (!(commands.hasOwnProperty(suffix))) bot.createMessage(msg.channel.id, 'Thats not a valid toggle, please use `welcome`, `unflip`, or any command name.');
    }
}