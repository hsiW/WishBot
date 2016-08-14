let getName = require('./../../utils/utils.js').getName,
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Gives info on the user, can take a username/nickname(can take a mention if a match isn't found) to find the info of that user.\n`info [none] or [user]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let = user = msg.mentions.length === 1 ? msg.mentions[0] : getName(msg, suffix);
        if (user) {
            let toSend = "```ruby\n";
            toSend += `         Name: \"${user.user.username}\"`;
            if (user.nick !== null) toSend += `\n     Nickname: \"${user.nick}\"`;
            toSend += `\n      User ID: ${user.id}`;
            toSend += `\nDiscriminator: #${user.user.discriminator}`;
            toSend += `\n       Status: ${user.status}`;
            if (user.game !== null) toSend += `\n      Playing: \'${user.game.name}\'`;
            toSend += `\n    Join Date: ${new Date(user.joinedAt).toUTCString()}`;
            toSend += `\nCreation Date: ${ new Date(user.user.createdAt).toUTCString()}`;
            toSend += `\n   Avatar URL: \n\"https://discordapp.com/api/users/${user.id}/avatars/${user.user.avatar}.jpg\"\`\`\``;
            bot.createMessage(msg.channel.id, toSend).catch();
        } else bot.createMessage(msg.channel.id, suffix + " is not a valid user.").then(message => utils.messageDelete(bot, message)).catch();
    }
}