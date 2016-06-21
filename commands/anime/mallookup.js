var request = require('request').defaults({
        encoding: null
    }),
    xml2js = require("xml2js");
var daysToString = require('./../../utils/utils.js').daysToString;

module.exports = {
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        var user = suffix.replace(/ /g, '%20')
        var URL = `http://myanimelist.net/malappinfo.php?u=${suffix.replace(/ /g, '%20')}&status=all&type=anime`;
        request(URL, (error, response, body) => {
            if (error) console.log(error);
            else if (!error && response.statusCode == 200) {
                xml2js.parseString(body, (err, result) => {
                    if (err) console.log(errorC(err));
                    else if (!result.myanimelist.myinfo) bot.createMessage(msg.channel.id, result.myanimelist.error);
                    else {
                        user = result.myanimelist.myinfo[0];
                        var msgString = '```ruby\n';
                        msgString += `Name: '${user.user_name}' #${user.user_id}\n`;
                        msgString += `Watching: ${user.user_watching} | On Hold: ${user.user_onhold} | Dropped: ${user.user_dropped}\n`
                        msgString += `Completed: ${user.user_completed} | Plan to Watch: ${user.user_plantowatch}\n`;
                        msgString += `Time Spent on Anime; ${daysToString(user.user_days_spent_watching)}\n`
                        bot.createMessage(msg.channel.id, msgString + "```");
                    }
                });
            }
        });
    }
}//This command needs fixing/cleaning up