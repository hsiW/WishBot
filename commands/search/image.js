let axios = require('axios'),
    options = require("./../../options/options.json"),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: `Searches Imgur with the search terms and if no terms are inputted, 'Yuki Nagato' is searched. A subreddit can be searched using the format \`/r/[subreddit]\`.  

__Subreddit searches can be further refined by the following following:__\`\`\`ruby
  [top]: Current top images(Default)
  [all]: All of Imgur
  [day]: Today
 [week]: This Week
[month]: This Month
 [year]: This Year
       &
 [page]: Returns results from that page on imgur(Defaults to 0)
\`\`\`
\`image [term] or /r/[subreddit], <timeframe>, <page #>\``,
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let response = {},
            query = "Yuki Nagato",
            sort = "top",
            page = 0;
        if (suffix.split(",")[0]) query = suffix.split(",")[0];
        if (suffix.split(",")[1]) {
            let temp = suffix.split(",")[1].replace(/ /g, "");
            if (temp === "top") sort = "top";
            else if (temp === "day") sort = "day";
            else if (temp === "week") sort = "week";
            else if (temp === "month") sort = "month";
            else if (temp === "year") sort = "year";
            else if (temp === "all") sort = "all";
        }
        if (query.startsWith("/r/")) {
            query = query.replace(" ", "_");
            let apiURL = "https://api.imgur.com/3/gallery" + query + "/" + sort + "/";
            get_image(bot, msg, apiURL, query);
        } else {
            if (suffix.split(",")[2]) {
                let temp = suffix.split(",")[2].replace(/ /g, "");
                if (/^\d+$/.test(temp)) page = temp;
            }
            let apiURL = "https://api.imgur.com/3/gallery/search/" + sort + "/" + page + "/?q=" + query;
            get_image(bot, msg, apiURL, query);
        }
    }
}

function get_image(bot, msg, apiURL, query) {
    axios.get(apiURL, {
        headers: {
            'Authorization': 'Client-ID ' + options.imgur_id
        }
    }).then(response => {
        if (response.status != 200) bot.createMessage(msg.channel.id, "I'm sorry **" + msg.author.username + "**-senpai but I got the status code ```" + result.statusCode).then(message => utils.messageDelete(bot, message)).catch();
        else if (response.data) {
            let body = response.data;
            if (body.hasOwnProperty("data") && body.data.length !== 0) {
                response = body.data[Math.floor(Math.random() * (body.data.length))];
                let postedDate = new Date(0),
                    temp = "";
                if (response.link != undefined) {
                    if (response.nsfw === true) {
                        bot.createMessage(msg.channel.id, "Your search for " + query + " was deemed to be too lewd, Senpai\nhttp://i.imgur.com/jKLnvR7.png").then(message => utils.messageDelete(bot, message)).catch();
                        return;
                    }
                    postedDate.setUTCSeconds(response.datetime)
                    if (response.description != null) {
                        temp = "\nDescription: " + response.description;
                        temp = temp.replace(/.*?:\/\//g, "");
                    }
                    bot.createMessage(msg.channel.id, "I searched Imgur for **\"" + query + "\"** and found this, **" + msg.author.username + "**-senpai:\n```ruby\nTitle: " + response.title + "" + temp + "\nDate Created: " + postedDate.toUTCString() + "```" + response.link).catch();
                } else bot.createMessage(msg.channel.id, "I'm sorry but that search for \"**" + query + "**\" did not get any results, **" + msg.author.username + "**-senpai").then(message => utils.messageDelete(bot, message)).catch();
            } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "**-senpai, I'm sorry but that search for \"**" + query + "**\" did not get any results.").then(message => utils.messageDelete(bot, message)).catch();
        }
    }).catch(error => bot.createMessage(msg.channel.id, "I'm sorry **" + msg.author.username + "**-senpai there was an error: ```" + error + "```").then(message => utils.messageDelete(bot, message))).catch();
}