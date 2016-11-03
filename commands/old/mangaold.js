let axios = require('axios'),
    xml2js = require('xml2js'),
    fix = require('entities'),
    options = require("./../../options/options.json");

module.exports = {
    usage: "Returns information about the inputted manga title.\n`manga [manga title]`",
    delete: false,
    cooldown: 5,
    process: (msg, args) => {
        return new Promise(resolve => {
            axios.get(`http://myanimelist.net/api/manga/search.xml?q=${args.replace(" ","+")}`, {
                auth: {
                    username: options.MAL_user,
                    password: options.MAL_pass
                }
            }).then(response => {
                if (response.status == 200) {
                    xml2js.parseString(response.data, (err, result) => {
                        let manga = result.manga.entry[0],
                            synopsis = fix.decodeHTML(manga.synopsis.toString().replace(/<br \/>/g, " ").replace(/\r?\n|\r/g, "\n").replace(/\[(i|\/i)\]/g, "*").replace(/\[(b|\/b)\]/g, "**"))
                        console.log(manga)
                        resolve({
                            message: `
__**${manga.title}**__ ${manga.english[0] !== '' ? '- __**'+manga.english+'**__ ' : ''}• *${manga.start_date}*  to *${manga.end_date}
**Type:** ${manga.type} | **Chapters:** ${manga.chapters} | **Volumes:** ${manga.volumes} | **Score:** ${manga.score}/10
**<http://myanimelist.net/manga/${manga.id}/>**

${synopsis.length > 1500 ? synopsis.substring(0, 1500) + '...' : synopsis}
                        `
                        });
                    });
                } else resolve({
                    message: `No Manga found for \`${args}\``,
                })
            });
        })
    }
}