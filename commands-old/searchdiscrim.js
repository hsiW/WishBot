module.exports = {
    delete: false,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            if (args.length !== 4 && !/^\d+$/.test(args)) args = msg.author.discriminator;
            let usersCache = [];
            bot.users.forEach(user => {
                if (user.discriminator === args) usersCache.push(user)
            })
            if (usersCache.length < 1) var msgString = "```markdown\n### No Users Found: (" + args + ") ###";
            else {
                var msgString = "```markdown\n### Found These User(s): (" + args + ") ###";
                for (i = 0; i < usersCache.length; i++) {
                    if (i === 10) {
                        msgString += "\nAnd " + (usersCache.length - i) + " more users...";
                        break;
                    }
                    msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username;
                }
            }
            resolve({
                message: msgString + "```"
            });
        });
    }
}