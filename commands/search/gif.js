let giphy = require('giphy-api-without-credentials')(),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Searches Giphy using the mentioned tag and returns a random gif\n`gif [tag]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        giphy.random({
            tag: suffix,
            rating: 'g',
            fmt: 'json'
        }, (err, data) => {
            if (err || data.data.length === 0) bot.createMessage(msg.channel.id, "There was an error with that request: ```" + err + "```").then(message => utils.messageDelete(bot, message)).catch();
            else bot.createMessage(msg.channel.id, "**(Tag:** *" + (suffix ? suffix : "Random GIF") + "* **)** I found this gif, **" + msg.author.username + "**-senpai:\n" + data.data.url).catch();
        });
    }
}