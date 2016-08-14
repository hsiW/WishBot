let axios = require('axios');

module.exports = {
    usage: "Returns the icon of the current server.",
    cooldown: 5,
    process: (bot, msg) => {
        axios.get(msg.channel.guild.iconURL, {
            responseType: 'arraybuffer'
        }).then(response => {
            bot.createMessage(msg.channel.id, "__**" + msg.channel.guild.name + "'s** icon is:__", {
                file: response.data,
                name: 'servericon.jpg'
            });
        }).catch();
    }
}