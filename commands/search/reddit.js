var FeedParser = require('feedparser'),
    feedparser = new FeedParser(),
    request = require('request');

module.exports = {
    usage: "Prints out a link to the top post on the mentioned subreddit if none is mentioned the top post of /r/all is linked\n`reddit [subreddit]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let path = "/.rss"
        if (suffix) path = "/r/" + suffix + path;
        rssfeed(bot, msg, "https://www.reddit.com" + path, 1, false);
    }
}

function rssfeed(bot, msg, url, count, full) {
    request(url).pipe(feedparser);
    feedparser.on('error', error => {
        console.log(errorC(error));
    });
    let shown = 0;
    feedparser.on('readable', function() {
        let stream = this;
        shown += 1
        if (shown > count) {
            return;
        }
        let item = stream.read();
        if (url === "https://www.reddit.com") url = "https://www.reddit.com/r/all/";
        bot.createMessage(msg.channel.id, "I got the top post of **\"" + url.replace(".rss", "").replace("https://www.reddit.com", "") + "\"** for you, **" + msg.author.username + "**-senpai: \n" + item.link);
        stream.alreadyRead = true;
    });
}