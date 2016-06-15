var quotes = require('./../../database/quote.json');

module.exports = {
    usage: "Sends a voice chat quote to The People Chat's quote channel\n⚠Will not work on any other server⚠\n`vquote [quote]`",
    delete: true,
    privateServer: ['87601506039132160'],
    cooldown: 2,
    process: function(bot, msg, suffix) {
        if (!suffix) bot.createMessage(msg.channel.id, "You`ll need to have a quote to quote something, **" + msg.author.username + "**-senpai.");
        else bot.createMessage("136558567082819584", "__From voice chat:__ \n" + suffix).then(message => {
            quotes.push(message.content);
            saveQuotes();
        });
    }
}

function saveQuotes() {
    fs.writeFile(__dirname + "/../database/quote.json", JSON.stringify(quotes, null, 4), error => {
        if (error) console.log(error);
    })
}