var FeedParser = require('feedparser');
var feedparser = new FeedParser();
var request = require('request');

module.exports = {
    usage: "Prints out a link to the top post on the mentioned subreddit if none is mentioned the top post of /r/all is linked\n`reddit [subreddit]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        var path = "/.rss"
        if (suffix) path = "/r/" + suffix + path;
        rssfeed(bot, msg, "https://www.reddit.com" + path, 1, false);
    }
}

function rssfeed(bot, msg, url, count, full) {
    request(url).pipe(feedparser);
    feedparser.on('error', function(error) {
        console.log(errorC(error));
    });
    var shown = 0;
    feedparser.on('readable', function() {
        var stream = this;
        shown += 1
        if (shown > count) {
            return;
        }
        var item = stream.read();
        if (url === "https://www.reddit.com") {
            url = "https://www.reddit.com/r/all/", "";
        }
        bot.createMessage(msg.channel.id, "I got the top post of **\"" + url.replace(".rss", "").replace("https://www.reddit.com", "") + "\"** for you, **" + msg.author.username + "**-senpai: \n" + item.link);
        stream.alreadyRead = true;
    });
}