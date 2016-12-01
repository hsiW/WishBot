var Database = require('./../../utils/database.js'),
    options = require('./../../options/options.json');

module.exports = {
    usage: 'Returns the **Current Prefix** for the Guild. **Overrides** current command prefix and will **always** work with the default prefix.',
    toggable: false,
    dm: false,
    process: (msg, args) => {
        return new Promise(resolve => {
            //Returns the current prefix for the guild by checking if its in the prefix database and returning the entry if so, otherwise returning the default prefix.
            resolve({
                message: `The current command prefix for this guild is: \`${Database.getPrefix(msg.channel.guild.id) !== undefined ? Database.getPrefix(msg.channel.guild.id) : options.prefix}\`

Change the current prefix with \`${options.prefix}setprefix [new prefix]\``
            });
        });
    }
}