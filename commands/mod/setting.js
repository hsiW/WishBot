let Database = require('./../../utils/database.js');

module.exports = {
    usage: `Used to toggle and configure settings. Configurable settings include automated table unflipping as well as welcome and leave messages. Welcome and Join messages are sent in the channel in which the command is used and can be cleared by leaving the message field blank.

__Welcome/Leave Messages can include the following text to return different things:__\`\`\`ruby
     [GuildName]: Server Name
[ChannelMention]: Mention to Current Channel
   [ChannelName]: Name of the Current Channel
      [UserName]: Name of the User
   [UserMention]: Mention to the User*

*Does not work in leave messages
\`\`\`

\`setting tableflip\`
\`setting [leave] or [welcome] and [message] or [none]\``,
    dm: false,
    delete: true,
    togglable: false,
    cooldown: 5,
    process: (msg, args) => {
        if (args.toLowerCase() === 'tableflip') Database.toggleSetting(msg.channel.guild, args, null, msg.channel).then(result => resolve({
            message: "⚙ " + result + " ⚙",
            delete: true
        }))
        else if (args.toLowerCase().startsWith('welcome') || args.toLowerCase().startsWith('leave')) {
            let setting = args.split(' ')[0],
                message = args.substring(setting.length + 1, args.length);
            if (message.length > 256) resolve({
                message: "🚫 Welcome/Leave Messages are limited to 256 characters in length. 🚫",
                delete: true
            })
            else Database.toggleSetting(msg.channel.guild, setting, message, msg.channel).then(result => resolve({
                message: "⚙ " + result + " ⚙",
                delete: true
            }))
        } else resolve({
            message: "🚫 `" + args.split(' ')[0] + "` isn't an available setting 🚫",
            delete: true
        })
    }
}