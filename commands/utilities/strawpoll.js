var request = require('request');
var utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Creates a Strawpoll with the mentioned options\n`strawpoll [option1] | [option2] | ect`",
    delete: true,
    cooldown: 15,
    process: (bot, msg, suffix) => {
        if (!suffix || suffix.split('|').length < 2) bot.createMessage(msg.channel.id, `I can't create a strawpoll from that **${msg.author.username}**-senpai.`).then(message => utils.messageDelete(bot, message, null));
        else {
            var title = msg.author.username + "'s Poll";
            if (/\[(.*?)\]/.test(suffix)) {
                title = suffix.match(/\[(.*?)\]/)[1];
                suffix = suffix.replace(/\[(.*?)\]/, '');
            }
            var choices = suffix.split('|');
            request({
                uri: "https://strawpoll.me/api/v2/polls",
                method: "POST",
                followAllRedirects: true,
                maxRedirects: 10,
                headers: {
                    "content-type": "application/json"
                },
                json: true,
                body: {
                    "title": title,
                    "options": choices,
                    "multi": false
                }
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) bot.createMessage(msg.channel.id, `**${msg.author.username}** created a poll with the question '${title}'\n**<http://strawpoll.me/${body.id}>** 📝`);
                else if (error) bot.createMessage(msg.channel.id, error).then(message => utils.messageDelete(bot, message, null));
                else if (response.statusCode != 201) bot.createMessage(msg.channel.id, `Got status code ${response.statusCode}`).then(message => utils.messageDelete(bot, message, null));
            })
        }
    }
}