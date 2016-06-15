ignoredUsers = require('./../database/IgnoredUsers.json')
var fs = require('fs');

exports.add = function(bot, msg, id) {
    if (!ignoredUsers.hasOwnProperty(id)) {
        ignoredUsers[id] = {};
        console.log(botC("@WishBot") + " - " + warningC("Added Ignore to ") + errorC(id));
        bot.createMessage(msg.channel.id, "🆗");
        saveIgnores();
    } else {
        bot.createMessage(msg.channel.id, "That user has already been ignored.");
    }

}

exports.remove = function(bot, msg, id) {
    if (ignoredUsers.hasOwnProperty(id)) {
        delete ignoredUsers[id];
        console.log(botC("@WishBot") + " - " + warningC("Removed Ignore from ") + errorC(id));
        bot.createMessage(msg.channel.id, "🆗");
        saveIgnores();
    } else {
        bot.createMessage(msg.channel.id, "That users isn't currently being ignored.");
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