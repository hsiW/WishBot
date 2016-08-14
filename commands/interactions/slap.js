let getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Slaps the user, can take a username/nickname(can take a mention if a match isnt found) to slap that user.\n`slap [user] or [none]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix && (msg.mentions || getName(msg, suffix))) {
            msg.mentions.length === 1 ? user = msg.mentions[0] : user = getName(msg, suffix).user;
            bot.createMessage(msg.channel.id, user.mention + " was slapped by **" + msg.author.username + "**!").catch();
        } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** slapped themselves!").catch();
    }
}