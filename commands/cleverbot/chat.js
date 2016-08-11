let Cleverbot = require('cleverbot-node'),
    onee = new Cleverbot,
    decode = require('entities');

Cleverbot.prepare(() => {});

module.exports = {
    usage: "Chat with this bot using the Cleverbot API\n`chat [text]` or `@Onee-chan [text]`",
    cooldown: 2,
    type: "Cleverbot",
    process: function(bot, msg) {
        Clever(bot, msg)
    }
}

function Clever(bot, msg) {
    let text = (msg.cleanContent.split(' ').length > 1) ? msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).replace('@', '') : false;
    bot.sendChannelTyping(msg.channel.id);
    Cleverbot.prepare(() => {
        onee.write(text, response => {
            if (!response.message) {
                bot.createMessage(msg.channel.id, "Cleverbot is currently reseting. Please try again in a moment");
                delete require.cache[require.resolve('cleverbot-node')];
                Cleverbot = require('cleverbot-node');
                onee = new Cleverbot();
                console.log("Cleverbot was reset because nothing was returned");
            } else {
                response.message = response.message.replace(/<br \/>/g, " ");
                response.message = response.message.replace(/\[(.{1,10})\]/g, "");
                response.message = response.message.replace(/\r?\n|\r/g, " ");
                response.message = response.message.replace(/\[(i|\/i)\]/g, "*");
                response.message = response.message.replace(/\[(b|\/b)\]/g, "**");
                response.message = response.message.replace(/\|/g, "\\u");
                response.message = unicodeToChar(response.message);
                bot.createMessage(msg.channel.id, "🗨 - " + decode.decodeHTML(response.message));
            }
        });
    });
}


function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function(match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}