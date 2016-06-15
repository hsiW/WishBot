var request = require('request').defaults({
    encoding: null
});

module.exports = {
    usage: "Prints the server icon of the current server",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        request("https://discordapp.com/api/guilds/" + msg.channel.guild.id + "/icons/" + msg.channel.guild.icon + ".jpg", function(err, response, buffer) {
            bot.createMessage(msg.channel.id, "**" + msg.channel.guild.name + "'s** icon is:", {
                file: buffer,
                name: 'servericon.jpg'
            });
        });
    }
}