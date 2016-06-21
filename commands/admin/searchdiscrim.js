module.exports = {
    usage: "Prints a list of users matching the mentioned discriminator\n`searchdiscrim [4 digit discriminator]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        if (suffix.length != 4) suffix = msg.author.discriminator;
        if (!/^\d+$/.test(suffix)) suffix = msg.author.discriminator;
        var usersCache = [];
        bot.users.forEach(user => {
            if (user.discriminator === suffix) usersCache.push(user)
        })
        if (usersCache.length < 1) var msgString = "```markdown\n### No Users Found: (" + suffix + ") ###";
        else {
            var msgString = "```markdown\n### Found These User(s): (" + suffix + ") ###";
            for (i = 0; i < usersCache.length; i++) {
                if (i === 10) {
                    msgString += "\nAnd " + (usersCache.length - i) + " more users...";
                    break;
                }
                msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username;
            }
        }
        bot.createMessage(msg.channel.id, msgString + "```");
    }
}