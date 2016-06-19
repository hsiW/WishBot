var nani = require('nani').init('hsiw-gt2fs', 't9C9EyoLpMsqvNRldKB9pK');
var getSeason = require('./../../utils/utils.js').getSeason;
var toTitleCase = require('./../../utils/utils.js').toTitleCase;
var splitArray = require('./../../utils/utils.js').splitArray;

var seasons = ['winter', 'spring', 'summer', 'fall'];
var url = `browse/anime?season=${seasons[getSeason()]}&full_page=true&type=Tv&airing_data=true`
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
                    currentAnime = Object.keys(data).map(title => data[title].title_romaji).sort();
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
    (/^[0-9]$/.test(suffix) && suffix < pagedTitles.length) ? page = suffix - 1 : page = 0;
    var msgString = `\`\`\`markdown\n### Anime for the ${toTitleCase(seasons[getSeason()])} Season: (Page #${page+1}) ###\n`;
    msgString += pagedTitles[page].map((value, position) => '[' + (position + 1 + (page * 10)) + ']: ' + value).join('\n');
    bot.createMessage(msg.channel.id, msgString + "```").catch(console.log);

}