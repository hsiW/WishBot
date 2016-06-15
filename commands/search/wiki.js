var Wiki = require('wikijs');

module.exports = {
    usage: "Prints out a Wikipedia link for the mentioned terms\n`wiki [terms]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        if (suffix) {
            new Wiki().search(suffix, 1).then(function(data) {
                new Wiki().page(data.results[0]).then(function(page) {
                    bot.createMessage(msg.channel.id, "**" + msg.author.username + "**, I searched for **\"" + suffix + "\"** and found this, Senpai: \n" + page.fullurl)
                });
            });
        } else {
            bot.createMessage(msg.channel.id, "You need to enter a topic to be searched, **" + msg.author.username + "**-senpai.");
        }
    }
}