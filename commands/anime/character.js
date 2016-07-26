var options = require('./../../options/options.json'),
    nani = require('nani').init(options.nani_id, options.nani_secret),
    decode = require('entities'),
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: '',
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix && !/[\uD000-\uF8FF]/g.test(suffix)) {
            bot.sendChannelTyping(msg.channel.id)
            let url = `character/search/${suffix.replace(' ','%20')}`
            nani.get(url)
                .then(data => {
                    if (data.length >= 1) {
                        let url = `character/${data[0].id}`
                        nani.get(url)
                            .then(data => {
                                let response = `**Name:** ${data.name_first} ${data.name_last.toUpperCase()}\n`
                                if (data.name_alt !== '') response += `**Alt Name:** ${data.name_alt}\n`
                                if (data.name_japanese !== '') response += `**Japanese Name:** ${data.name_japanese}\n`
                                if (data.roll != null) response += `**Roll:** ${data.roll}\n`
                                if (data.info !== '') {
                                    let info = data.info;
                                    if (info.match(/(^|\s+)[A-Z](\S*?)\:(\s+|$)/g)) {
                                        info.match(/(^|\s+)[A-Z](\S*?)\:(\s+|$)/g).forEach(topic => {
                                            info = info.replace(topic, '**' + topic + '**')
                                        })
                                    }
                                    response += info + '\n';
                                }
                                if (response.length > 1750) {
                                    response = response.substring(0, 1750);
                                    response += "...";
                                }
                                response += `**Image:** ${data.image_url_lge}`;
                                bot.createMessage(msg.channel.id, decode.decodeHTML(response)).catch(error => console.log(errorC(error)));
                            })
                            .catch(error => console.log(errorC(error)));
                    } else bot.createMessage(msg.channel.id, 'No characters found named `' + suffix + '`, **' + msg.author.username + '**-senpai.').then(message => utils.messageDelete(bot, message, null));
                })
                .catch(error => console.log(errorC(error)));
        } else bot.createMessage(msg.channel.id, 'A name is required to search.').then(message => utils.messageDelete(bot, message, null));
    }
}