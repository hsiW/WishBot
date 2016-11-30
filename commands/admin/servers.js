module.exports = {
    delete: false,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            if (!args) resolve({
                message: `__**${bot.user.username}'s 10 Largest Servers are:**__\`\`\`swift
${bot.guilds.filter(s => s).sort((a, b)=> b.members.size-a.members.size).slice(0, 10).map((s, i) => "#" + (i + 1) + ": " + s.name + " (" + s.members.size + ")").join('\n')}\`\`\``
            });
            else {
                let nameRegex = new RegExp(args, "i"),
                    serverCache = [];
                bot.guilds.forEach(guild => {
                    if (nameRegex.test(guild.name)) serverCache.push(guild);
                })
                if (serverCache.length < 1) var msgString = "```markdown\n### No Servers Found ###```"
                else {
                    var msgString = ["```markdown\n### Found These servers(s): ###"];
                    for (i = 0; i < serverCache.length; i++) {
                        if (i === 25) {
                            msgString += "\nAnd " + (serverCache.length - i) + " more servers...";
                            break;
                        }
                        let bots = serverCache[i].members.filter(user => user.user.bot).length,
                            people = serverCache[i].members.size - bots;
                        msgString += "\n[" + (i + 1) + "]: " + serverCache[i].name + " - " + bots + "/" + people + " " + ((bots / serverCache[i].members.size) * 100).toFixed(2) + "%";
                    }
                }
                resolve({
                    message: msgString + "```"
                });
            }
            resolve({
                message: `__**${bot.user.username}'s 10 Largest Servers are:**__\`\`\`swift
${bot.guilds.filter(s => s).sort((a, b)=> b.members.size-a.members.size).slice(0, 10).map((s, i) => "#" + (i + 1) + ": " + s.name + " (" + s.members.size + ")").join('\n')}\`\`\``
            });
        })
    }
}