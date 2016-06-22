var request = require("request");
var xml2js = require('xml2js');
var fix = require('entities');
var options = require("./../../options/options.json");
var utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Prints out information about the mentioned anime\n`anime [anime title]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        var anime = msg.content.split(" ").slice(1).join("+");
        var apiURL = "http://myanimelist.net/api/anime/search.xml?q=" + anime;
        var user = options.MAL_user,
            pass = options.MAL_pass;
        request(apiURL, {
            "auth": {
                "user": user,
                "pass": pass,
                "sendImmediately": true
            }
        }, (error, response, body) => {
            if (error) console.log(errorC(error.stack));
            else if (!error && response.statusCode == 200) {
                xml2js.parseString(body, function(err, result) {
                    var animeString = "";
                    var synopsis = result.anime.entry[0].synopsis.toString();
                    synopsis = synopsis.replace(/<br \/>/g, " ");
                    synopsis = synopsis.replace(/\[(.{1,10})\]/g, "");
                    synopsis = synopsis.replace(/\r?\n|\r/g, " ");
                    synopsis = synopsis.replace(/\[(i|\/i)\]/g, "*");
                    synopsis = synopsis.replace(/\[(b|\/b)\]/g, "**");
                    synopsis = fix.decodeHTML(synopsis);
                    if (synopsis.length > 1000) {
                        synopsis = synopsis.substring(0, 1000);
                        synopsis += "...";
                    }
                    animeString += "__**" + result.anime.entry[0].title + "**__ - __**" + result.anime.entry[0].english + "**__ • *" + result.anime.entry[0].start_date + "*  to *" + result.anime.entry[0].end_date + "*\n";
                    animeString += "\n**Type:** *" + result.anime.entry[0].type + "*  **Episodes:** *" + result.anime.entry[0].episodes + "*  **Score:** *" + result.anime.entry[0].score + "*";
                    animeString += "\n" + synopsis;
                    animeString += "\n**<http://myanimelist.net/anime/" + result.anime.entry[0].id + "/>**";
                    bot.createMessage(msg.channel.id, animeString);
                });
            } else bot.createMessage(msg.channel.id, "No anime found for: \"**" + suffix + "**\"").then(message => utils.messageDelete(bot, message, null));
        });
    }
}