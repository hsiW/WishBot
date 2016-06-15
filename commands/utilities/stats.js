module.exports = {
    usage: "Prints out stats for this bot",
    delete: true,
    cooldown: 20,
    process: function(bot, msg, suffix) {
        var statMsg = "__**" + bot.user.username + " Stats:**__"
        statMsg += "```ruby\nTotal Server(s): " + bot.guilds.size;
        statMsg += "\nTotal Channel(s): " + (Object.keys(bot.channelGuildMap).length + bot.privateChannels.size);
        statMsg += "\nTotal User(s): " + bot.users.size + "";
        statMsg += "\nMemory Usage: " + (process.memoryUsage().rss / 1024 / 1000).toFixed(2) + "MB```";
        bot.createMessage(msg.channel.id, statMsg);
    }
}