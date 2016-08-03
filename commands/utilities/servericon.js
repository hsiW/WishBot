/*var request = require('request').defaults({
    encoding: null
});
*/
module.exports = {
    usage: "Prints the server icon of the current server",
    cooldown: 5,
    process: (bot, msg) => {
        request("https://discordapp.com/api/guilds/" + msg.channel.guild.id + "/icons/" + msg.channel.guild.icon + ".jpg", function(err, response, buffer) {
            bot.createMessage(msg.channel.id, "**" + msg.channel.guild.name + "'s** icon is:", {
                file: buffer,
                name: 'servericon.jpg'
            });
        });
    }
}