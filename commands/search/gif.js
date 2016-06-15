var request = require("request");
var qs = require("querystring");

module.exports = {
    usage: "Searches Giphy using the mentioned tags\n`gif [tag1], [tag2], ect`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        var tags = suffix.split(",");
        get_gif(tags, bot, msg, function(id) {
            if (typeof id !== "undefined") {
                bot.createMessage(msg.channel.id, "With the tags: **(Tags:** *" + (tags ? tags : "Random GIF") + "* **)** I found this gif, **" + msg.author.username + "**-senpai:\nhttp://media.giphy.com/media/" + id + "/giphy.gif ");
            } else {
                bot.createMessage(msg.channel.id, "Invalid tags **" + msg.author.username + "**-senpai, please try something different.");
            }
        });
    }
}

function get_gif(tags, bot, msg, func) {
    var params = {
        "api_key": "dc6zaTOxFJmzC",
        "rating": "r",
        "format": "json",
        "limit": 1
    };
    var query = qs.stringify(params);
    if (tags !== null) {
        query += "&tag=" + tags.join('+')
    }
    request("http://api.giphy.com/v1/gifs/random?" + query, function(error, response, body) {
        if (error || response.statusCode !== 200) {
            bot.createMessage(msg.channel.id, "There was an error getting a gif");
            console.log(errorC(error));
        } else {
            var responseObj = JSON.parse(body);
            func(responseObj.data.id);
        }
    }.bind(this));
}