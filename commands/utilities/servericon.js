let axios = require('axios');

module.exports = {
    usage: "Prints the server icon of the current server",
    cooldown: 5,
    process: (bot, msg) => {
        axios.get("https://discordapp.com/api/guilds/" + msg.channel.guild.id + "/icons/" + msg.channel.guild.icon + ".jpg").then(response => {
            bot.createMessage(msg.channel.id, "**" + msg.channel.guild.name + "'s** icon is:", {
                file: response.data,
                name: 'servericon.jpg'
            });
        }).catch();
    }
}