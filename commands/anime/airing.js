var options = require('./../../options/options.json');
var nani = require('nani').init(options.nani_id, options.nani_secret);
var getSeason = require('./../../utils/utils.js').getSeason;
var toTitleCase = require('./../../utils/utils.js').toTitleCase;
var splitArray = require('./../../utils/utils.js').splitArray;
var secondsToString = require('./../../utils/utils.js').secondsToString;

var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var seasons = ['winter', 'spring', 'summer', 'fall'];
var url = `browse/anime?season=${seasons[getSeason()]}&full_page=true&type=Tv&airing_data=true&sort=popularity-desc`
var airingAnime;
var currentAnime;

module.exports = {
    usage: "This bot dances around in the current channel using a random dance",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        nani.get(url)
            .then(data => {
                airingAnime = data.filter(isAiring);
                currentAnime = data.filter(isAiring).map(title => title.title_english + " | " + weekday[new Date(title.airing.time).getDay()]);
                processAnime(bot, msg, suffix);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

function processAnime(bot, msg, suffix) {
    if (/^[0-9]$/.test(suffix)) sendAnime(bot, msg, suffix);
    else if (airingAnime.find(title => isAnime(title, suffix))) {
        anime = airingAnime.find(title => isAnime(title, suffix));
        var msgString = '```ruby\n';
        msgString += `Title: ${anime.title_english}\n`
        msgString += `Romaji Title: ${anime.title_romaji}\n`;
        msgString += `Japanese Title: ${anime.title_japanese}\n`;
        msgString += `Average Score: ${anime.average_score}/100\n\n`
        msgString += `Next Airing: ${(new Date(anime.airing.time)).toUTCString()}\n`;
        msgString += `Time Til Airing ${secondsToString(anime.airing.countdown)}`
        bot.createMessage(msg.channel.id, msgString + "```")
    } else bot.createMessage(msg.channel.id, 'No Airing Anime found called `' + suffix + '`, **' + msg.author.username + '**-senpai.');
}


function sendAnime(bot, msg, suffix) {
    var pagedTitles = splitArray(currentAnime, 10);
    (suffix - 1 <= pagedTitles.length) ? page = suffix - 1 : page = 0;
    var msgString = `\`\`\`markdown\n### Anime for the ${toTitleCase(seasons[getSeason()])} Season: (Page ${page+1}/${pagedTitles.length}) ###\n`;
    msgString += pagedTitles[page].map((value, position) => '[' + (position + 1 + (page * 10)) + ']: ' + value).join('\n');
    bot.createMessage(msg.channel.id, msgString + "```").catch(console.log);
}

function isAiring(title) {
    if (title.airing != null) return title;
}

function isAnime(title, suffix) {
    var titleRegex = new RegExp(suffix, "i");
    if (titleRegex.test(title.title_english)) return title;
}