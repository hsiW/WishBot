let axios = require('axios'),
    minutesToString = require('./../../utils/utils.js').minutesToString,
    utils = require('./../../utils/utils.js');

module.exports = {
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let URL =
            axios.get("http://hummingbird.me/api/v1/users/" + suffix, {
                headers: {
                    "content-type": "application/json"
                },
                json: true
            }).then(response => {
                if (response.data) {
                    let msgString = "```ruby\n";
                    msgString += `Name: '${response.data.name}'\n`;
                    if (response.data.waifu) msgString += `${response.data.waifu_or_husbando}: '${body.waifu}' #${response.data.waifu_char_id}\n`;
                    if (response.data.location) msgString += `Location: '${response.data.location}'\n`;
                    msgString += `Time Spent on Anime: ${minutesToString(response.data.life_spent_on_anime)}\n`;
                    msgString += `Last Library Update: ${new Date(response.data.last_library_update).toUTCString()}`;
                    bot.createMessage(msg.channel.id, msgString + "```")
                }
            }).catch(error => bot.createMessage(msg.channel.id, "I'm sorry **" + msg.author.username + "**-senpai there was an error: ```" + error + "```")).then(message => utils.messageDelete(bot, message));
    }
}