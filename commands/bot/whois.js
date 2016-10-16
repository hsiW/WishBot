let getName = require('./../../utils/utils.js').getName, 
    moment = require('moment'); 
 
module.exports = { 
    usage: "Gives info on the user, can take a username/nickname(can take a mention if a match isn't found) to find the info of that user.\n`info [none] or [user]`", 
    dm: false, 
    delete: false, 
    cooldown: 5, 
    process: (msg, args) => { 
        return new Promise(resolve => { 
            let = user = msg.mentions.length === 1 ? msg.channel.guild.members.get(msg.mentions[0].id) : getName(msg, args); 
            if (user) { 
                resolve({ 
                    message: ` 
\`\`\`Swift 
User: ${user.user.username}#${user.user.discriminator} 
${user.nick !==null ? 'Nickname: '+user.nick+'\n': ''}User ID: ${user.id} 
Status: ${user.status} 
${user.game !== null ? 'Playing: \''+user.game.name+'\'\n' : ''}Join Date: ${moment(user.joinedAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} (${moment(user.joinedAt).fromNow()}) 
Creation Date: ${moment(user.user.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} (${moment(user.user.createdAt).fromNow()}) 
Avatar URL: \"${user.user.avatarURL}\" 
\`\`\` 
                                ` 
                }); 
            } else resolve({ 
                message: args + " is not a valid user.", 
                delete: true 
            }) 
        }); 
    } 
}