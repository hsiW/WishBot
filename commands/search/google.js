var google = require("google");
var utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Prints out the first search result for the mentioned terms\n`google [search terms]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        var search = "google";
        if (suffix) search = suffix;
        google(search, (err, response) => {
            if (err || !response || !response.links || response.links.length < 1) bot.createMessage(msg.channel.id, "Your search resulted in an error. Please forgive me **" + msg.author.username + "**-senpai!").then(message => utils.messageDelete(bot, message, null));
            else {
                if (response.links[0].link === null) {
                    for (i = 1; i < response.links.length; i++) {
                        if (response.links[i].link !== null) {
                            bot.createMessage(msg.channel.id, "I searched for **\"" + search + "\"** and found this, **" + msg.author.username + "**-senpai: \n<" + response.links[i].link + ">");
                            return;
                        }
                    }
                } else bot.createMessage(msg.channel.id, "I searched for **\"" + search + "\"** and found this, **" + msg.author.username + "**-senpai: \n<" + response.links[0].link + ">");
            }
        })
    }
}