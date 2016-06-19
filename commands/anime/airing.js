var options = require('./../../options/options.json');
var nani = require('nani').init(options.nani_id, options.nani_secret);
var getSeason = require('./../../utils/utils.js').getSeason;
var toTitleCase = require('./../../utils/utils.js').toTitleCase;
var splitArray = require('./../../utils/utils.js').splitArray;

var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

var seasons = ['winter', 'spring', 'summer', 'fall'];
var url = `browse/anime?season=${seasons[getSeason()]}&full_page=true&type=Tv&airing_data=true&sort=popularity-desc`
var currentAnime = null;

module.exports = {
    usage: "This bot dances around in the current channel using a random dance",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        if (currentAnime === null) {
            nani.get(url)
                .then(data => {
                    console.log(data)
                    currentAnime = data.filter(isAiring).map(title => title.title_romaji + " | " + weekday[new Date(title.airing.time).getDay()]);
                    sendAnime(bot, msg, suffix)
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            sendAnime(bot, msg, suffix)
        }
    }
}

function sendAnime(bot, msg, suffix) {
    var pagedTitles = splitArray(currentAnime, 10);
    (/^[0-9]$/.test(suffix) && (suffix - 1 <= pagedTitles.length)) ? page = suffix - 1 : page = 0;
    console.log(page);
    var msgString = `\`\`\`markdown\n### Anime for the ${toTitleCase(seasons[getSeason()])} Season: (Page ${page+1}/${pagedTitles.length}) ###\n`;
    msgString += pagedTitles[page].map((value, position) => '[' + (position + 1 + (page * 10)) + ']: ' + value).join('\n');
    bot.createMessage(msg.channel.id, msgString + "```").catch(console.log);
}

function isAiring(title) {
    if (title.airing != null) return title;
}