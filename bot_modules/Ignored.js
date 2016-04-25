ignoredUsers = require('./../database/IgnoredUsers.json')
var fs = require('fs');

exports.add = function(bot, msg, id) {
    if (!ignoredUsers.hasOwnProperty(id)) {
        ignoredUsers[id] = {};
        console.log(botC("@WishBot") + " - " + warningC("Added Ignore to ") + errorC(id));
        bot.sendMessage(msg, "🆗");
        saveIgnores();
    } else {
        bot.sendMessage(msg, "That user has already been ignored.", function(error, sentMessage) {
            bot.deleteMessage(sentMessage, {
                "wait": 5000
            })
        });
    }

}

exports.remove = function(bot, msg, id) {
    if (ignoredUsers.hasOwnProperty(id)) {
        delete ignoredUsers[id];
        console.log(botC("@WishBot") + " - " + warningC("Removed Ignore from ") + errorC(id));
        bot.sendMessage(msg, "🆗");
        saveIgnores();
    } else {
        bot.sendMessage(msg, "That users isn't currently being ignored.", function(error, sentMessage) {
            bot.deleteMessage(sentMessage, {
                "wait": 5000
            })
        });
    }

}

function saveIgnores() {
    fs.writeFile(__dirname + '/../database/IgnoredUsers-temp.json', JSON.stringify(ignoredUsers, null, 4), error => {
            if (error) console.log(error)
            else {
                fs.rename(__dirname + '/../database/IgnoredUsers-temp.json', __dirname + '/../database/IgnoredUsers.json', e => {
                    if (e) console.log(e);
                });
            }
        });
    }