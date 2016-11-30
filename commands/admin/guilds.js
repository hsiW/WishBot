module.exports = {
    usage: 'Search and display guilds. `guilds [args]` to search the bots guilds for `args` otherwise `guilds` will display the top 10 largest guilds the bot is in.',
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            //If no args return the bots top 10 guilds
            if (!args) resolve({
                message: `__**${bot.user.username}'s 10 Largest guilds are:**__\`\`\`swift
${bot.guilds.filter(s => s).sort((a, b)=> b.members.size-a.members.size).slice(0, 10).map((s, i) => "#" + (i + 1) + ": " + s.name + " (" + s.members.size + ")").join('\n')}\`\`\``
            });
            //If args search the guilds and return the guilds that match args
            else {
                let nameRegex = new RegExp(args, "i"),
                    guildCache = [];
                //For each guild if it matches the nameRegex return the guild
                bot.guilds.forEach(guild => {
                    if (nameRegex.test(guild.name)) guildCache.push(guild);
                })
                if (guildCache.length < 1) var msgString = "```markdown\n### No guilds Found ###```"
                else {
                    var msgString = ["```markdown\n### Found These guilds(s): ###"];
                    for (var i = 0; i < guildCache.length; i++) {
                        if (i === 25) {
                            msgString += "\nAnd " + (guildCache.length - i) + " more guilds...";
                            break;
                        }
                        //Spilt users into bots and users for easier detection of bot accumulation guilds
                        var bots = guildCache[i].members.filter(user => user.user.bot).length,
                            users = guildCache[i].members.size - bots;
                        msgString += "\n[" + (i + 1) + "]: " + guildCache[i].name + " - " + bots + "/" + users + " " + ((bots / guildCache[i].members.size) * 100).toFixed(2) + "%";
                    }
                }
                resolve({
                    message: msgString + "```"
                });
            }
        })
    }
}