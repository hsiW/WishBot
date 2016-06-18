var request = require('request').defaults({
        encoding: null
    }),
    xml2js = require("xml2js");

module.exports = {
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        var user = suffix.replace(/ /g, '%20')
        var URL = `http://myanimelist.net/malappinfo.php?u=${suffix.replace(/ /g, '%20')}&status=all&type=anime`;
        request(URL, (error, response, body) => {
            if (error) console.log(error);
            else if (!error && response.statusCode == 200) {
                xml2js.parseString(body, (err, result) => {
                    if (err) console.log(err);
                    else if (!result.myanimelist.myinfo) bot.createMessage(msg.channel.id, result.myanimelist.error);
                    else {
                        console.log(result.myanimelist.myinfo[0]);
                        result = result.myanimelist.myinfo[0];
                        bot.createMessage(msg.channel.id, `\`\`\`ruby\nUser: ${result.user_name} (${result.user_id})\nWatching: ${result.user_watching}\nCompleted: ${result.user_completed}\nOn Hold: ${result.user_onhold}\nDropped: ${result.user_dropped}\nPTW: ${result.user_plantowatch}\nDays Spent Watching: ${result.user_days_spent_watching}\`\`\``);
                    }
                });
            }
        });
    }
}