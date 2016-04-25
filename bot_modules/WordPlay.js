var quote = require("./../lists/animequotes.json").animequotes;
var pun = require("./../lists/puns.json").puns;

var words = {
    "quote": {
        usage: "Prints out a random anime quote or the quote at the position mentioned\n`quote [number] or [none]`",
        delete: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (suffix && /^\d+$/.test(suffix) && quote.length >= parseInt(suffix) - 1) {
                bot.sendMessage(msg, quote[suffix - 1]);
            } else {
                bot.sendMessage(msg, quote[Math.floor(Math.random() * (quote.length))]);
            }
        }
    },
    "pun": {
        usage: "Prints out a random pun or the pun at the position mentioned\n`pun [number] or [none]`",
        delete: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (suffix && /^\d+$/.test(suffix) && pun.length >= parseInt(suffix) - 1) {
                bot.sendMessage(msg, pun[suffix - 1]);
            } else {
                bot.sendMessage(msg, pun[Math.floor(Math.random() * (pun.length))]);
            }
        }
    },
    "reverse": {
        usage: "Reverses the mentioned terms\n`reverse [terms]`",
        delete: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (suffix.indexOf('@') > 0) {
                suffix = suffix.replace(/@/g, '');
            }
            bot.sendMessage(msg, (suffix.split("").reverse().join("")));
        }
    },
    "vquote": {
        usage: "Sends a call quote to The People Chat's quote channel\n⚠Will not work on any other server⚠\n`vquote [quote]`",
        delete: true,
        privateServer: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (!suffix) {
                bot.sendMessage(msg, "You'll need to have a quote to quote something, **" + msg.author.username + "**-senpai.");
            } else {
                bot.sendMessage("136558567082819584", "__From voice chat:__ \n" + suffix);
            }
        }
    },
    "tquote": {
        usage: "Sends a text quote to The People Chat's quote channel\n⚠Will not work on any other server⚠\n`tquote [quote]`",
        delete: true,
        privateServer: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (!suffix) {
                bot.sendMessage(msg, "You'll need to have a quote to quote something, **" + msg.author.username + "**-senpai.");
            } else {
                bot.sendMessage("136558567082819584", "__From text chat:__ \n" + suffix);
            }
        }
    },
    "randomquote": {
        usage: "Prints a random quote from The People Chat's quote channel\n⚠Will not work on any other server⚠",
        delete: true,
        privateServer: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg) {
            bot.getChannelLogs("136558567082819584", 100, function(error, messages) {
                if (error) {
                    console.log(error);
                    return;
                } else {
                    bot.sendMessage(msg, messages[Math.floor((Math.random() * messages.length) + 1)]);
                }
            });
        }
    }
}

exports.words = words;