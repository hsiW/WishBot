let axios = require('axios'),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Creates a Strawpoll with the mentioned options\n`strawpoll [option1] | [option2] | ect`",
    delete: true,
    cooldown: 15,
    process: (bot, msg, suffix) => {
        if (!suffix || suffix.split('|').length < 2) bot.createMessage(msg.channel.id, `I can't create a strawpoll from that **${msg.author.username}**-senpai.`).then(message => utils.messageDelete(bot, message));
        else {
            let title = msg.author.username + "'s Poll";
            if (/\[(.*?)\]/.test(suffix)) {
                title = suffix.match(/\[(.*?)\]/)[1];
                suffix = suffix.replace(/\[(.*?)\]/, '');
            }
            let choices = suffix.split('|');
            axios.post("https://strawpoll.me/api/v2/polls", {
                maxRedirects: 10,
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    "title": title,
                    "options": choices,
                    "multi": false
                }
            }).then(response => {
                console.log(response)
                if (response.status == 200) bot.createMessage(msg.channel.id, `**${msg.author.username}** created a poll with the question '${title}'\n**<http://strawpoll.me/${response.data.id}>** 📝`).catch();
                else bot.createMessage(msg.channel.id, `Got status code ${response.statusCode}`).then(message => utils.messageDelete(bot, message)).catch();
            }).catch(error => bot.createMessage(msg.channel.id, error).then(message => utils.messageDelete(bot, message))).catch();
        }
    }
}