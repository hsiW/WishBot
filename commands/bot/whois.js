const moment = require('moment');

var getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Returns **info on the user**, can take a **nickname/username/mention** to return the info of that user. **Requires** embedded links in order for this command to display.\n\n`whois [none] or [user]`",
    aliases: ['about'],
    dm: false,
    process: (msg, args) => {
        return new Promise(resolve => {
            //Get user using either the mention or using the getName function
            let = user = msg.mentions.length === 1 ? msg.channel.guild.members.get(msg.mentions[0].id) : getName(msg, args);
            //This should always fire 
            if (user) {
                //Resolves will info about the user using moment to format the date and times properly as well as seeing how long ago stuff was
                resolve({
                    embed: {
                        author: {
                            name: `${user.user.username}#${user.user.discriminator}`,
                            icon_url: user.user.avatarURL,
                            url: user.user.avatarURL
                        },
                        color: ((1 << 24) * Math.random() | 0), //Randomly sets the colour
                        fields: [{
                            name: 'Nickname',
                            value: user.nick !== null ? user.nick : 'None.',
                            inline: true
                        }, {
                            name: 'Playing',
                            value: user.game !== null ? user.game.name : 'None.',
                            inline: true
                        }, {
                            name: 'Join Date',
                            value: `${moment(user.joinedAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} (${moment(user.joinedAt).fromNow()}) `,
                            inline: true
                        }, {
                            name: 'User ID',
                            value: user.id,
                            inline: true
                        }, {
                            name: 'Status',
                            value: user.status,
                            inline: true
                        }, {
                            name: 'Creation Date',
                            value: `${moment(user.user.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} (${moment(user.user.createdAt).fromNow()})`,
                            inline: true
                        }]
                    }
                });
            } //This is just here incase something goes wrong 
            else resolve({
                message: args + " is not a valid user.",
                delete: true
            })
        });
    }
}