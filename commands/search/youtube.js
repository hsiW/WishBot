var options = require("./../../options/options.json");
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey(options.youtube_api_key);

module.exports = {
    usage: "Prints out the first YouTube link for the mentioned terms\n`youtube [terms]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        youTube.search(suffix, 10, function(error, result) {
            if (error || !result || !result.items || result.items.length < 1) {
                bot.createMessage(msg.channel.id, "Your search resulted in an error. Please forgive me **" + msg.author.username + "**-senpai! ;-;");
            } else {
                if (typeof result.items[0].id.videoId === "undefined") {
                    for (i = 1; i < result.items.length; i++) {
                        if (typeof result.items[i].id.videoId !== "undefined") {
                            bot.createMessage(msg.channel.id, "I searched for **" + suffix + "** and found this **" + msg.author.username + "**-senpai: \nhttps://www.youtube.com/watch?v=" + result.items[i].id.videoId);
                            return;
                        }
                    }
                } else bot.createMessage(msg.channel.id, "I searched for **\"" + suffix + "\"** and found this, **" + msg.author.username + "**-senpai: \nhttps://www.youtube.com/watch?v=" + result.items[0].id.videoId);
            }
        });
    }
}