module.exports = {
    usage: "Lists the large servers this bot is connected to",
    delete: true,
    process: function(bot, msg) {
        bot.createMessage(msg.channel.id, "__**" + bot.user.username + " is connected to the following large threshold servers:**__\n```xl\n" + bot.guilds.filter(s => s.members.size >= 250).map(s => s.name + ": " + s.members.size).join("\n") + "```");
    }
}