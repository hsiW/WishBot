let axios = require('axios'),
    xml2js = require('xml2js'),
    fix = require('entities'),
    options = require("./../../options/options.json"),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Returns information about the inputted anime title.\n`anime [anime title]`",
    delete: false,
    cooldown: 5,
    process: (msg, args) => {
        return new Promise(resolve => {
            axios.get(`http://myanimelist.net/api/anime/search.xml?q=${args.replace(" ","+")}`, {
                auth: {
                    username: options.MAL_user,
                    password: options.MAL_pass
                }
            }).then(response => {
                if (response.status == 200) {
                    xml2js.parseString(response.data, (err, result) => {
                        let anime = result.anime.entry[0],
                            synopsis = fix.decodeHTML(anime.synopsis.toString().replace(/<br \/>/g, " ").replace(/\r?\n|\r/g, "\n").replace(/\[(i|\/i)\]/g, "*").replace(/\[(b|\/b)\]/g, "**"))
                        resolve({
                            message: `
__**${anime.title}**__ ${anime.english[0] !== '' ? '- __**'+anime.english+'**__ ' : ''}• \`${anime.start_date}\`  to \`${anime.end_date}\`
**Type:** ${anime.type} | **Episodes:** ${anime.episodes} | **Score:** ${anime.score}/10
**<http://myanimelist.net/anime/${anime.id}/>**

${synopsis.length > 1500 ? synopsis.substring(0, 1500) + '...' : synopsis}
`
                        })
                    });
                } else resolve({
                    message: `No Anime found for \`${args}\``,
                })
            }).catch(console.log)
        });
    }
}