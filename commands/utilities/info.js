let getName = require('./../../utils/utils.js').getName,
    utils = require('./../../utils/utils.js'),
    moment = require('moment');

module.exports = {
    usage: "Gives info on the user, can take a username/nickname(can take a mention if a match isn't found) to find the info of that user.\n`info [none] or [user]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let = user = msg.mentions.length === 1 ? msg.channel.guild.members.get(msg.mentions[0].id) : getName(msg, suffix);
        if (user) {
            let toSend = "```ruby\n";
            toSend += `         User: ${user.user.username}#${user.user.discriminator}`;
            if (user.nick !== null) toSend += `\n     Nickname: ${user.nick}`;
            toSend += `\n      User ID: ${user.id}`;
            toSend += `\n       Status: ${user.status}`;
            if (user.game !== null) toSend += `\n      Playing: \'${user.game.name}\'`;
            toSend += `\n    Join Date: ${moment(user.joinedAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} (${moment(user.joinedAt).fromNow()})`;
            toSend += `\nCreation Date: ${moment(user.user.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} (${moment(user.user.createdAt).fromNow()})`;
            toSend += `\n   Avatar URL: \"${user.user.avatarURL}\"\`\`\``;
            bot.createMessage(msg.channel.id, toSend).catch(console.log);
        } else bot.createMessage(msg.channel.id, suffix + " is not a valid user.").then(message => utils.messageDelete(bot, message)).catch(console.log);
    }
}