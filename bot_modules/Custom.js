CustomCommands = require('./../database/CustomCommands.json');
var fs = require('fs');
var updated = false;
setInterval(() => {
    if (updated) {
        updated = false;
        saveCustomCommands();
    }
}, 30000);

var custom = {
    "chan": {
        usage: "Creates and manipulates Custom Chans.\nTo create a chan use `chan add [chan name] [chan content]`\nTo edit a chan use `chan edit [chan name] [chan content]`\nTo remove a chan use `chan delete [chan name]`\nTo view created chans use `chan`\n\nCommands are run by doing `chan [command name]`.",
        delete: true,
        cooldown: 2,
        type: "custom",
        process: function(bot, msg, suffix) {
            if (suffix.split(" ")[0] === "add" || suffix.split(" ")[0] === "write") {
                suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2)
                var add = suffix.substr(0, suffix.indexOf(' ')).toLowerCase();
                var toAdd = suffix.substr(suffix.indexOf(' ') + 1);
                if (CustomCommands.hasOwnProperty(msg.channel.server.id) && CustomCommands[msg.channel.server.id].hasOwnProperty(add)) bot.sendMessage(msg, add + " already exists as a command.");
                 else if (add === "add" || add === "write" || add === "delete" || add === "edit") bot.sendMessage(msg, "I'm sorry but " + add + " cannot be a command name.");
                 else if (!CustomCommands.hasOwnProperty(msg.channel.server.id) && add !== "") {
                    CustomCommands[msg.channel.server.id] = {};
                    CustomCommands[msg.channel.server.id][add] = toAdd;
                    console.log(serverC("@" + msg.channel.server.name + ": ") + botC("@WishBot") + " - Added Command " + warningC(add));
                    bot.sendMessage(msg, "🆗");
                    updated = true;
                } else if (CustomCommands.hasOwnProperty(msg.channel.server.id) && !CustomCommands[msg.channel.server.id].hasOwnProperty(add) && add !== "") {
                    CustomCommands[msg.channel.server.id][add] = toAdd;
                    console.log("Added " + botC(add) + " to " + serverC(msg.channel.server.name));
                    bot.sendMessage(msg, "🆗");
                    updated = true;
                } else bot.sendMessage(msg, "There was an error creating that command please try again.");
            } else if (suffix.split(" ")[0] === "delete") {
                suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2);
                if (CustomCommands.hasOwnProperty(msg.channel.server.id) && CustomCommands[msg.channel.server.id].hasOwnProperty(suffix)) {
                    delete CustomCommands[msg.channel.server.id][suffix];
                    bot.sendMessage(msg, "🆗", {}, function(err, msg) {
                        if (!err) {
                            if (isEmpty(CustomCommands[msg.channel.server.id])) {
                                delete CustomCommands[msg.channel.server.id];
                                console.log(serverC("@" + msg.channel.server.name + ": ") + botC("@WishBot") + " - " + warningC("Removed server from command database"));
                            }
                            updated = true;
                        } else console.log(errorC(err));
                    });
                } else bot.sendMessage(msg, "Cannot remove that as its not created");
            } else if (suffix.split(" ")[0] === "edit") {
                suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2);
                var toEdit = suffix.substr(0, suffix.indexOf(' '));
                var editted = suffix.substr(suffix.indexOf(' ') + 1);
                if (CustomCommands.hasOwnProperty(msg.channel.server.id) && CustomCommands[msg.channel.server.id].hasOwnProperty(toEdit)) {
                    CustomCommands[msg.channel.server.id][toEdit] = editted;
                    bot.sendMessage(msg, "🆗");
                } else bot.sendMessage(msg, "Cannot edit that which doesn't exist");
            } else {
                if (!CustomCommands.hasOwnProperty(msg.channel.server.id)) bot.sendMessage(msg, "No Commands Found");
                else if (CustomCommands[msg.channel.server.id][suffix.split(" ")[0]]) {
                    var toSend = CustomCommands[msg.channel.server.id][suffix.split(" ")[0]];
                    toSend = toSend.replace(/UserID/g, msg.author.id);
                    toSend = toSend.replace(/UserName/g, msg.author.name);
                    toSend = toSend.replace(/ChannelID/g, msg.channel.id);
                    toSend = toSend.replace(/ChannelName/g, msg.channel.name);
                    toSend = toSend.replace(/ChannelLink/g, "<#" + msg.channel.id + ">");
                    toSend = toSend.replace(/ServerID/g, msg.channel.server.id);
                    toSend = toSend.replace(/ServerName/g, msg.channel.server.name);
                    toSend = toSend.replace(/ServerMemberCount/g, msg.channel.server.members.length);
                    bot.sendMessage(msg, toSend);
                } else {
                    var msgString = "Custom Chans - " + Object.keys(CustomCommands[msg.channel.server.id]).sort().map(cmd => "`" + cmd + "`").join(", ");
                    bot.sendMessage(msg, msgString);
                }
            }
        }
    }
}

exports.custom = custom;

function remove(server) {
    delete CustomCommands[server.id];
    console.log(serverC("@" + server.name + ": ") + botC("@WishBot") + " - " + errorC("Removed from Database"));
    updated = true;
}

exports.remove = remove;

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