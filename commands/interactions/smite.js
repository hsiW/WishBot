let getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Smites the user, can take a username/nickname(can take a mention if a match isn't found) to smite that user.\n`smite [user] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        if (suffix && (msg.mentions || getName(msg, suffix))) {
            msg.mentions.length === 1 ? msg.mentions[0] : user = getName(msg, suffix).user;
            bot.createMessage(msg.channel.id, user.mention + " has been smited using the power granted to Bluee by the Cabbage Phoenix.").catch();
        } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** has smited themself using power granted to Bluee by the Cabbage Phoenix.").catch();
    }
}