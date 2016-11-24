let Cleverbot = require('cleverbot-node'),
    Yuki = new Cleverbot(),
    decode = require('entities').decodeHTML; //Used to decode html stuff
Cleverbot.prepare(() => {}); //Prepares the cleverbot module for use

module.exports = {
    usage: "**Chat** with the bot using the **Cleverbot API**.\n\n`chat [text]`\n`@BotMention [text]`",
    aliases: ['clever', 'cleverbot', 'talk'],
    delete: false,
    cooldown: 5,
    process: msg => {
        return new Promise(resolve => {
            //Cleans message content removing mentions and replacing them with the raw usernames, if no message args text defaults to 'Hi'
            let text = msg.cleanContent.split(' ').length > 1 ? msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).replace('@', '') : 'Hi';
            //Get cleverbot response
            Yuki.write(text, response => {
                if (!response.message) {
                    //Sometimes Cleverbot doesn't return a message which causes the bot to just send blank messages until its rebooted, this does that
                    resolve({
                        message: "Cleverbot is currently reseting. Please try again in a moment",
                        delete: true
                    });
                    console.log(errorC("Cleverbot was reset because nothing was returned."));
                    delete require.cache[require.resolve('cleverbot-node')];
                    Cleverbot = require('cleverbot-node');
                    Yuki = new Cleverbot();
                    Cleverbot.prepare(() => {});
                } else {
                    //Replace html stuff with the correct characters
                    response = unicodeToChar(response.message.replace(/<br \/>/g, " ").replace(/\r?\n|\r/g, "\n").replace(/\[(i|\/i)\]/g, "*").replace(/\[(b|\/b)\]/g, "**").replace(/\|/g, "\\u"))
                    resolve({
                        message: "🗨 " + decode(response)
                    })
                }
            });
        });
    }
}

//Fix unicode which are returned oddly
function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
}