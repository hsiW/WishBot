let axios = require('axios'),
    xml2js = require('xml2js'),
    fix = require('entities'),
    options = require("./../../options/options.json"),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Returns information about the inputted manga title.\n`manga [manga title]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let manga = msg.content.split(" ").slice(1).join("+");
        let apiURL = "http://myanimelist.net/api/manga/search.xml?q=" + manga;
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
                    let mangaString = "";
                    let synopsis = result.manga.entry[0].synopsis.toString();
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
                    mangaString += "__**" + result.manga.entry[0].title + "**__ - __**" + result.manga.entry[0].synonyms + "**__ • *" + result.manga.entry[0].start_date + "*  to *" + result.manga.entry[0].end_date + "*\n";
                    mangaString += "\n**Type:** *" + result.manga.entry[0].type + "*  **Chapters:** *" + result.manga.entry[0].chapters + "*  **Volumes:** *" + result.manga.entry[0].volumes + "*  **Score:** *" + result.manga.entry[0].score + "*";
                    mangaString += "\n" + synopsis;
                    mangaString += "\n**<http://myanimelist.net/manga/" + result.manga.entry[0].id + "/>**";
                    bot.createMessage(msg.channel.id, mangaString).catch();
                });
            } else bot.createMessage(msg.channel.id, "No manga found for: \"**" + suffix + "**\"").then(message => utils.messageDelete(bot, message)).catch();
        }).catch()
    }
}