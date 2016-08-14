let quotes = require('./../../database/quote.json'),
    fs = require('fs'),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Sends a text quote to The People Chat's quote channel.\n⚠Will not work on any other server⚠\n`tquote [quote]`",
    delete: true,
    privateServer: ['87601506039132160'],
    cooldown: 2,
    process: (bot, msg, suffix) => {
        if (!suffix) bot.createMessage(msg.channel.id, "You'll need to have a quote to quote something, **" + msg.author.username + "**-senpai.").then(message => utils.messageDelete(bot, message)).catch();
        else bot.createMessage("136558567082819584", "__From text chat:__ \n" + suffix).then(message => {
            quotes.push(message.content);
            saveQuotes();
        }).catch();
    }
}

function saveQuotes() {
    fs.writeFile(__dirname + "/../database/quote.json", JSON.stringify(quotes, null, 4), error => {
        if (error) console.log(error);
    })
}