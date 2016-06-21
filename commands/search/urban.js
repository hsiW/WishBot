var request = require('request');
var utils = require('./../../utils/utils.js');

module.exports = {
    usage: "",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        var search = msg.content.split(" ").slice(1).join("+");
        var apiURL = "http://api.urbandictionary.com/v0/define?term=" + search;
        request(apiURL, (error, response, body) => {
            if (error) console.log(errorC(error));
            else if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                if (body.list.length === 0) bot.createMessage(msg.channel.id, "Your search for **\"" + suffix + "\"** no results, **" + msg.author.name + "**-senpai!").then(message => utils.messageDelete(bot, message, null));
                else {
                    var result = body.list[Math.floor(Math.random() * (body.list.length))]
                    var toSend = "**" + result.word + "** by *" + result.author + "*\n\n";
                    toSend += result.definition;
                    toSend += "\n\n*" + result.example + "*";
                    toSend += "\n\n👍" + result.thumbs_up + " : 👎" + result.thumbs_down;
                    toSend += "\n<" + result.permalink + ">";
                    bot.createMessage(msg.channel.id, toSend);
                }
            }
        });
    }
}