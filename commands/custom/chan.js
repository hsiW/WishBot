CustomCommands = require('./../../database/CustomCommands.json');
var fs = require('fs');
var updated = false;
setInterval(() => {
    if (updated) {
        updated = false;
        saveCustomCommands();
    }
}, 30000);

module.exports = {
    usage: "Creates and manipulates Custom Chans.\nTo create a chan use `chan add [chan name] [chan content]`\nTo edit a chan use `chan edit [chan name] [chan content]`\nTo remove a chan use `chan delete [chan name]`\nTo view created chans use `chan`\n\nChan's are run by doing `chan [command name]`.",
    delete: true,
    cooldown: 2,
    process: function(bot, msg, suffix) {
        if (suffix.split(" ")[0] === "add" || suffix.split(" ")[0] === "write") {
            suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2)
            var add = suffix.substr(0, suffix.indexOf(' ')).toLowerCase();
            var toAdd = suffix.substr(suffix.indexOf(' ') + 1);
            if (CustomCommands.hasOwnProperty(msg.channel.guild.id) && CustomCommands[msg.channel.guild.id].hasOwnProperty(add)) bot.createMessage(msg.channel.id, add + " already exists as a command.");
            else if (add === "add" || add === "write" || add === "delete" || add === "edit") bot.createMessage(msg.channel.id, "I'm sorry but " + add + " cannot be a command name.");
            else if (!CustomCommands.hasOwnProperty(msg.channel.guild.id) && add !== "") {
                CustomCommands[msg.channel.guild.id] = {};
                CustomCommands[msg.channel.guild.id][add] = toAdd;
                console.log(serverC("@" + msg.channel.guild.name + ": ") + botC("@WishBot") + " - Added Command " + warningC(add));
                bot.createMessage(msg.channel.id, "🆗");
                updated = true;
            } else if (CustomCommands.hasOwnProperty(msg.channel.guild.id) && !CustomCommands[msg.channel.guild.id].hasOwnProperty(add) && add !== "") {
                CustomCommands[msg.channel.guild.id][add] = toAdd;
                console.log("Added " + botC(add) + " to " + serverC(msg.channel.guild.name));
                bot.createMessage(msg.channel.id, "🆗");
                updated = true;
            } else bot.createMessage(msg.channel.id, "There was an error creating that command please try again.");
        } else if (suffix.split(" ")[0] === "delete") {
            suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2);
            if (CustomCommands.hasOwnProperty(msg.channel.guild.id) && CustomCommands[msg.channel.guild.id].hasOwnProperty(suffix)) {
                delete CustomCommands[msg.channel.guild.id][suffix];
                bot.createMessage(msg.channel.id, "🆗", {}, function(err, msg) {
                    if (!err) {
                        if (isEmpty(CustomCommands[msg.channel.guild.id])) {
                            delete CustomCommands[msg.channel.guild.id];
                            console.log(serverC("@" + msg.channel.guild.name + ": ") + botC("@WishBot") + " - " + warningC("Removed server from command database"));
                        }
                        updated = true;
                    } else console.log(errorC(err));
                });
            } else bot.createMessage(msg.channel.id, "Cannot remove that as its not created");
        } else if (suffix.split(" ")[0] === "edit") {
            suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2);
            var toEdit = suffix.substr(0, suffix.indexOf(' '));
            var editted = suffix.substr(suffix.indexOf(' ') + 1);
            if (CustomCommands.hasOwnProperty(msg.channel.guild.id) && CustomCommands[msg.channel.guild.id].hasOwnProperty(toEdit)) {
                CustomCommands[msg.channel.guild.id][toEdit] = editted;
                bot.createMessage(msg.channel.id, "🆗");
            } else bot.createMessage(msg.channel.id, "Cannot edit that which doesn't exist");
        } else {
            if (!CustomCommands.hasOwnProperty(msg.channel.guild.id)) bot.createMessage(msg.channel.id, "No Chans Found on this Server");
            else if (CustomCommands[msg.channel.guild.id][suffix.split(" ")[0]]) bot.createMessage(msg.channel.id, CustomCommands[msg.channel.guild.id][suffix.split(" ")[0]]);
            else {
                var msgString = "Chans - " + Object.keys(CustomCommands[msg.channel.guild.id]).sort().map(cmd => "`" + cmd + "`").join(", ");
                bot.createMessage(msg.channel.id, msgString);
            }
        }
    }
}

exports.remove = function(server) {
    delete CustomCommands[server.id];
    updated = true;
}

function saveCustomCommands() {
    fs.writeFile(__dirname + '/../database/CustomCommands-temp.json', JSON.stringify(CustomCommands, null, 4), error => {
        if (error) console.log(error);
        else {
            fs.stat(__dirname + '/../database/CustomCommands-temp.json', (err, stats) => {
                if (err) console.log(err);
                else if (stats["size"] < 5) console.log(errorC("There was a size mismatch error with CustomCommands"));
                else {
                    fs.rename(__dirname + '/../database/CustomCommands-temp.json', __dirname + '/../database/CustomCommands.json', e => {
                        if (e) console.log(e);
                    });
                }
            });
        }
    })
}