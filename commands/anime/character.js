var options = require('./../../options/options.json'),
    nani = require('nani').init(options.nani_id, options.nani_secret),
    utils = require('./../../utils/utils.js'),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: '',
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix) {
            let url = `character/search/${suffix.replace(' ','%20')}`
            nani.get(url)
                .then(data => {
                    let url = `character/${data[0].id}`
                    nani.get(url)
                        .then(data => {
                            let response = `**Name:** ${data.name_first} ${data.name_last.toUpperCase()}\n`
                            if (data.name_alt !== '') response += `**Alt Name:** ${data.name_alt}\n`
                            if (data.name_japanese !== '') response += `**Japanese Name:** ${data.name_japanese}\n`
                            if (data.roll != null) response += `**Roll:** ${data.roll}\n`
                            if (data.info !== '') {
                                let info = data.info;
                                if (info.match(/(^|\s+)[A-Z](.*?)\:(\s+|$)/g)) {
                                    info.match(/(^|\s+)[A-Z](.*?)\:(\s+|$)/g).forEach(topic => {
                                        info = info.replace(topic, '**' + topic + '**')
                                    })
                                    if (info.length > 500) {
                                        info = info.substring(0, 500);
                                        info += "...";
                                    }
                                }
                                response += info + '\n';
                            }
                            response += `**Image:** ${data.image_url_lge}`;
                            bot.createMessage(msg.channel.id, response);
                        })
                        .catch(error => console.log(errorC(error)));
                })
                .catch(error => console.log(errorC(error)));
        } else bot.createMessage(msg.channel.id, 'A name is required to search.').then(message => utils.messageDelete(bot, message, null));
    }
}