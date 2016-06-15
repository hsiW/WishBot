var translate = require('yandex-translate-api')('trnsl.1.1.20160606T223534Z.a87b932879d83872.3918808d6c31d735989b4638d3c300586ea5ae1d');

module.exports = {
    usage: "test is test",
    cooldown: 5,
    process: function(bot, msg, suffix) {
        console.log(translate);
        if (!suffix) {
            bot.createMessage(msg.channel.id, "I can't pick from that, **" + msg.author.username + "**-senpai.");
        } else {
            translate.translate(suffix, {
                to: 'ja',
                from: 'en'
            }, function(err, result) {
                console.log(result);
                bot.createMessage(msg.channel.id, unicodeToChar(result.text.toString()));
            });
        }
    }
}

function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function(match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}