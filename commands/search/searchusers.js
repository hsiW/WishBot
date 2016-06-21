module.exports = {
    usage: "Prints a list of users matching the mentioned name\n`searchdiscrim [name]`",
    delete: true,
    process: (bot, msg, suffix) => {
        var nameRegex = new RegExp(suffix, "i");
        var usersCache = [];
        msg.channel.guild.members.forEach(user => {
            if (nameRegex.test(user.user.username)) usersCache.push(user.user);
        })
        if (usersCache.length < 1) var msgString = "```markdown\n### No Users Found: (" + suffix + ") ###";
        else {
            var msgString = "```markdown\n### Found These User(s): (" + suffix + ") ###";
            for (i = 0; i < usersCache.length; i++) {
                if (i === 10) {
                    msgString += "\nAnd " + (usersCache.length - i) + " more users...";
                    break;
                }
                msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username + " #" + usersCache[i].discriminator;
            }
        }
        bot.createMessage(msg.channel.id, msgString + "```");
    }
}