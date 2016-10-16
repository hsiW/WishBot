let Cleverbot = require('cleverbot-node'),
    onee = new Cleverbot,
    decode = require('entities');

Cleverbot.prepare(() => {});

module.exports = {
    usage: "Chat with this bot using the Cleverbot API\n`chat [text]` or `@BotMention [text]`",
    aliases: ['clever', 'cleverbot', 'talk'],
    delete: false,
    cooldown: 2,
    process: msg => {
        return new Promise(resolve => {
            let text = (msg.cleanContent.split(' ').length > 1) ? msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).replace('@', '') : 'Hi';
            msg.channel.sendTyping();
            Cleverbot.prepare(() => {
                onee.write(text, response => {
                    if (!response.message) {
                        resolve({
                            message: "Cleverbot is currently reseting. Please try again in a moment",
                            delete: true
                        });
                        delete require.cache[require.resolve('cleverbot-node')];
                        Cleverbot = require('cleverbot-node');
                        onee = new Cleverbot();
                        console.log("Cleverbot was reset because nothing was returned");
                    } else {
                        response = unicodeToChar(response.message.replace(/<br \/>/g, " ").replace(/\r?\n|\r/g, "\n").replace(/\[(i|\/i)\]/g, "*").replace(/\[(b|\/b)\]/g, "**").replace(/\|/g, "\\u"))
                        resolve({
                            message: "🗨 - " + decode.decodeHTML(response)
                        })
                    }
                });
            });
        });
    }
}

function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function(match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}