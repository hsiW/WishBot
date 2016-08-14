let axios = require('axios'),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Returns an Urban Dictionary definition for the searched terms.\n`urban [search]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let search = msg.content.split(" ").slice(1).join("+");
        let apiURL = "http://api.urbandictionary.com/v0/define?term=" + search;
        axios.get(apiURL).then(response => {
            if (response.status == 200) {
                let body = response.data;
                if (body.list.length === 0) bot.createMessage(msg.channel.id, "Your search for **\"" + suffix + "\"** no results, **" + msg.author.username + "**-senpai!").then(message => utils.messageDelete(bot, message)).catch();
                else {
                    let result = body.list[Math.floor(Math.random() * (body.list.length))],
                        toSend = "**" + result.word + "** by *" + result.author + "*\n\n";
                    toSend += result.definition;
                    toSend += "\n\n*" + result.example + "*";
                    toSend += "\n\n👍" + result.thumbs_up + " : 👎" + result.thumbs_down;
                    toSend += "\n<" + result.permalink + ">";
                    bot.createMessage(msg.channel.id, toSend);
                }
            }
        }).catch(err => bot.createMessage(msg.channel.id, "There was an error getting the weather: ```" + err + "```").then(message => utils.messageDelete(bot, message))).catch();
    }
}