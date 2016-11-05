const Database = require('./../../utils/database.js'),
    options = require('./../../options/options.json');

module.exports = {
    usage: 'Returns the current prefix for the guild. Overrides current command prefix and will always work with the default.',
    dm: false,
    delete: false,
    cooldown: 10,
    process: (msg, args) => {
        return new Promise(resolve => {
            //Returns the current prefix for the guild by checking if its in the prefix database and returning the entry if so, otherwise returning the default prefix.
            resolve({
                message: `The current command prefix for this guild is: \`${Database.getPrefix(msg.channel.guild.id) !== undefined ? Database.getPrefix(msg.channel.guild.id) : options.prefix}\``
            });
        });
    }
}