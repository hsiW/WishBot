let axios = require('axios'),
    xml2js = require('xml2js'),
    fix = require('entities'),
    options = require("./../../options/options.json"),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Prints out information about the mentioned anime\n`anime [anime title]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let anime = msg.content.split(" ").slice(1).join("+");
        let apiURL = "http://myanimelist.net/api/anime/search.xml?q=" + anime;
        let user = options.MAL_user,
            pass = options.MAL_pass;
        axios.get(apiURL, {
            auth: {
                username: user,
                password: pass
            }
        }).then(response => {
            if (response.status == 200) {
                xml2js.parseString(response.data, function(err, result) {
                    let animeString = "";
                    let synopsis = result.anime.entry[0].synopsis.toString();
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
                    bot.createMessage(msg.channel.id, animeString).catch();
                });
            } else bot.createMessage(msg.channel.id, "No anime found for: \"**" + suffix + "**\"").then(message => utils.messageDelete(bot, message)).catch();
        }).catch()
    }
}