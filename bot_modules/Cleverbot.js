var Cleverbot = require('cleverbot-node'),
    onee = new Cleverbot;
Cleverbot.prepare(function() {});
var decode = require('entities');
var emoji = ["💁","🙅","🙆","🙋","🙎","🙍","💇","💆"]

function Clever(bot, msg) {
    var text = (msg.cleanContent.split(' ').length > 1) ? msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).replace('@', '') : false;
    bot.startTyping(msg.channel);
    Cleverbot.prepare(() => {
        onee.write(text, response => {
            if (!response.message) {
                bot.sendMessage(msg, "Cleverbot is currently reseting. Please try again in a moment");
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
                bot.sendMessage(msg, emoji[Math.floor(Math.random() * (emoji.length))]+" - " + decode.decodeHTML(response.message));
            }
        });
    });
    bot.stopTyping(msg.channel)
}
var chatbot = {
    "chat": {
        usage: "Chat with this bot using the Cleverbot API\n`chat [text]` or `@Onee-chan [text]`",
        cooldown: 2,
        type: "Cleverbot",
        process: function(bot, msg) {
            Clever(bot, msg)
        }
    }
}

function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function(match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}

exports.chatbot = chatbot;