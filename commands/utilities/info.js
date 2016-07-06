var getName = require('./../../utils/utils.js').getName,
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Gives info on the user or a then mentioned user if one is mentioned\n`info [mentioned user] or [none]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        msg.mentions.length === 1 ? user = msg.channel.guild.members.get(msg.mentions[0]) : user = getName(msg, suffix);
        if (user) {
            let creationDate = new Date((user.id / 4194304) + 1420070400000);
            let toSend = "```ruby\n";
            toSend += `         Name: \"${user.user.username}\"`;
            if (user.nick !== null) toSend += `\n     Nickname: \"${user.nick}\"`;
            toSend += `\n      User ID: ${user.id}`;
            toSend += `\nDiscriminator: #${user.user.discriminator}`;
            toSend += `\n       Status: ${user.status}`;
            if (user.game !== null) toSend += `\n      Playing: \'${user.game.name}\'`;
            toSend += `\n    Join Date: ${new Date(user.joinedAt).toUTCString()}`;
            toSend += `\nCreation Date: ${creationDate.toUTCString()}`;
            toSend += `\n   Avatar URL: \n\"https://discordapp.com/api/users/${user.id}/avatars/${user.user.avatar}.jpg\"\`\`\``;
            bot.createMessage(msg.channel.id, toSend);
        } else bot.createMessage(msg.channel.id, suffix + " is not a valid user.").then(message => utils.messageDelete(bot, message, null));
    }
}