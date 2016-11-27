const Database = require('./../../utils/database.js');

module.exports = {
    usage: `Used to configure/toggle settings including **automated table unflipping** and **welcome/leave messages**, both of which are off by default. **Welcome/leave messages** are sent in the **channel** in which this command is last used and can be toggled off by leaving the message field **blank**.
\`\`\`markdown
# Welcome/Leave Messages can include:

[Example](Replaced with this)
[GuildName](Guild Name)
[ChannelMention](Mention to Channel)
[ChannelName](Name of the Channel)
[UserName](Name of the User)
[UserMention](Mention to the User)

# Exact case MUST be used excluding brackets #
\`\`\`
\`setting tableflip - Toggles tableflip on/off
setting welcome/leave [message] - Sets welcome/leave to 'message'\``,
    aliases: ['set'],
    dm: false,
    delete: false,
    togglable: false,
    permissions: {
        'manageGuild': true
    },
    cooldown: 5,
    process: (msg, args) => {
        return new Promise(resolve => {
            //If args are tableflip then toggle the tableflip setting
            if (args.toLowerCase() === 'tableflip') Database.toggleSetting(msg.channel.guild.id, args).then(result =>
                resolve({
                    message: "⚙ " + result + " ⚙",
                    delete: true
                }))
            else if (args.toLowerCase().startsWith('welcome') || args.toLowerCase().startsWith('leave')) {
                let setting = args.split(' ')[0], //The setting to be changed(either welcome or leave)
                    message = args.substring(setting.length + 1, args.length); //Create a string of the message without the extra space
                if (message.length > 256) //Messages can only be 256 characters in length due to database reasons
                    resolve({
                    message: "🚫 Welcome/Leave Messages are limited to 256 characters in length. 🚫",
                    delete: true
                })
                else Database.toggleSetting(msg.channel.guild.id, setting, message, msg.channel.id).then(result =>
                    //Toggles the setting, if no message passed toggles it off otherwise sets the message for the current channel
                    resolve({
                        message: "⚙ " + result + " ⚙",
                        delete: true
                    }))
            } else //If neither tableflip, welcome or leave
                resolve({
                message: "🚫 `" + args.split(' ')[0] + "` isn't an available setting 🚫",
                delete: true
            })
        })
    }
}