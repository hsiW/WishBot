var request = require('request');
var minutesToString = require('./../../utils/utils.js').minutesToString;

module.exports = {
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        request({
            uri: "http://hummingbird.me/api/v1/users/" + suffix,
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
            json: true
        }, (error, response, body) => {
            if (error) bot.createMessage(msg.channel.id, "I'm sorry **" + msg.author.username + "**-senpai there was an error: ```" + error + "```");
            else if (response.statusCode != 200) bot.createMessage(msg.channel.id, "I'm sorry **" + msg.author.username + "**-senpai but I got the status code `" + response.statusCode + "`");
            else if (body) {
                var msgString = "```ruby\n";
                msgString += `Name: '${body.name}'\n`;
                if (body.waifu != null) msgString += `${body.waifu_or_husbando}: '${body.waifu}' #${body.waifu_char_id}\n`;
                if (body.location != null) msgString += `Location: '${body.location}'\n`;
                msgString += `Time Spent on Anime: ${minutesToString(body.life_spent_on_anime)}\n`;
                msgString += `Last Library Update: ${new Date(body.last_library_update).toUTCString()}`;
                bot.createMessage(msg.channel.id, msgString + "```")
            }
        });
    }
} //&humlookup florestina