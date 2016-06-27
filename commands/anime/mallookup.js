var request = require('request'),
    xml2js = require("xml2js"),
    daysToString = require('./../../utils/utils.js').daysToString,
    utils = require('./../../utils/utils.js');

module.exports = {
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (/[\uD000-\uF8FF]/g.test(suffix)) bot.createMessage(msg.channel.id, "Your search contained illegal characters").then(message => utils.messageDelete(bot, message, null))
        else {
            let URL = `http://myanimelist.net/malappinfo.php?u=${suffix.replace(/ /g, '%20')}&status=all&type=anime`;
            request(URL, (error, response, body) => {
                if (error) console.log(error);
                else if (!error && response.statusCode == 200) {
                    xml2js.parseString(body, (err, result) => {
                        if (err) console.log(errorC(err));
                        else if (!result.myanimelist.myinfo) bot.createMessage(msg.channel.id, result.myanimelist.error[0]);
                        else {
                            let user = result.myanimelist.myinfo[0];
                            let msgString = '```ruby\n';
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
    }
}