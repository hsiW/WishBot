var options = require('./../../options/options.json');
var nani = require('nani').init(options.nani_id, options.nani_secret);
var utils = require('./../../utils/utils.js');

var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var seasons = ['winter', 'spring', 'summer', 'fall'];
var url = `browse/anime?status=Currently%20Airing&full_page=true&type=Tv&airing_data=true&sort=popularity-desc`
var airingAnime;

module.exports = {
    usage: "This bot dances around in the current channel using a random dance",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        nani.get(url)
            .then(data => {
                airingAnime = data.filter(isAiring);
                processAnime(bot, msg, suffix);
            })
            .catch(error => console.log(errorC(error)));
    }
}

function processAnime(bot, msg, suffix) {
    if (/^[0-9]$/.test(suffix) || !suffix) {
        var currentAnime = airingAnime.map(title => title.title_english + " | " + weekday[new Date(title.airing.time).getDay()]);
        var pagedTitles = utils.splitArray(currentAnime, 10);
        ((suffix - 1 <= pagedTitles.length) && suffix) ? page = suffix - 1 : page = 0;
        var msgString = `\`\`\`markdown\n### Airing Anime for the ${utils.toTitleCase(seasons[getSeason()])} Season: (Page ${page+1}/${pagedTitles.length}) ###\n`;
        msgString += pagedTitles[page].map((value, position) => '[' + (position + 1 + (page * 10)) + ']: ' + value).join('\n');
        bot.createMessage(msg.channel.id, msgString + "```").catch(console.log);
    } else if (airingAnime.find(title => isAnime(title, suffix))) {
        var msgString = '```ruby\n';
        msgString += `Title: ${anime.title_english}\n`
        msgString += `Romaji Title: ${anime.title_romaji}\n`;
        msgString += `Japanese Title: ${anime.title_japanese}\n\n`;
        msgString += `Next Episode: ${anime.airing.next_episode}/${anime.total_episodes} | Airing: ${(new Date(anime.airing.time)).toUTCString()}\n`;
        msgString += `Time Til Airing: ${utils.secondsToString(anime.airing.countdown)}`
        bot.createMessage(msg.channel.id, msgString + "```")
    } else bot.createMessage(msg.channel.id, 'No Airing Anime found called `' + suffix + '`, **' + msg.author.username + '**-senpai.').then(message => utils.messageDelete(bot, message, null));
}

function isAiring(title) {
    if (title.airing != null) return title;
}

function isAnime(title, suffix) {
    var titleRegex = new RegExp(suffix, "i");
    if (titleRegex.test(title.title_english)) return title;
}

function getSeason() {
    var d = new Date()
    var season = d.getMonth() + 1;
    if (season === 1 || season === 2 || season === 3) return 0;
    else if (season === 4 || season === 5 || season === 6) return 1;
    else if (season === 7 || season === 8 || season === 9) return 2;
    else if (season === 10 || season === 11 || season === 12) return 3;
}