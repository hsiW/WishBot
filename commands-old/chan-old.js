let CustomTags = require('./../../database/customTags.json'),
    fs = require('fs'),
    updated = false;

setInterval(() => {
    if (updated) {
        updated = false;
        saveCustomTags();
    }
}, 1000);

module.exports = {
    usage: "Creates and manipulates Custom Chans(which are essentially another name for tags).\n\nTo create a chan use `chan add [chan name] [chan content]`\nTo edit a chan use `chan edit [chan name] [chan content]`\nTo remove a chan use `chan delete [chan name]`\nTo view created chans use `chan`\n\nChan's are run by doing `chan [chan name]`.",
    dm: false,
    delete: false,
    cooldown: 2,
    process: (bot, msg, suffix) => {
        if (suffix.split(" ")[0] === "add" || suffix.split(" ")[0] === "write") {
            suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2)
            let add = suffix.substr(0, suffix.indexOf(' ')).toLowerCase();
            let toAdd = suffix.substr(suffix.indexOf(' ') + 1);
            if (CustomTags.hasOwnProperty(msg.channel.guild.id) && CustomTags[msg.channel.guild.id].hasOwnProperty(add)) bot.createMessage(msg.channel.id, add + " already exists as a command.");
            else if (add === "add" || add === "write" || add === "delete" || add === "edit") bot.createMessage(msg.channel.id, "I'm sorry but " + add + " cannot be a command name.").catch();
            else if (!CustomTags.hasOwnProperty(msg.channel.guild.id) && add !== "") {
                CustomTags[msg.channel.guild.id] = {};
                CustomTags[msg.channel.guild.id][add] = toAdd;
                console.log(serverC("@" + msg.channel.guild.name + ": ") + botC("@WishBot") + " - Added Command " + warningC(add));
                bot.createMessage(msg.channel.id, "🆗").catch();
                updated = true;
            } else if (CustomTags.hasOwnProperty(msg.channel.guild.id) && !CustomTags[msg.channel.guild.id].hasOwnProperty(add) && add !== "") {
                CustomTags[msg.channel.guild.id][add] = toAdd;
                console.log("Added " + botC(add) + " to " + serverC(msg.channel.guild.name));
                bot.createMessage(msg.channel.id, "🆗").catch();
                updated = true;
            } else bot.createMessage(msg.channel.id, "There was an error creating that command please try again.").catch();
        } else if (suffix.split(" ")[0] === "delete") {
            suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2);
            if (CustomTags.hasOwnProperty(msg.channel.guild.id) && CustomTags[msg.channel.guild.id].hasOwnProperty(suffix)) {
                delete CustomTags[msg.channel.guild.id][suffix];
                bot.createMessage(msg.channel.id, "🆗", {}, function(err, msg) {
                    if (!err) {
                        if (isEmpty(CustomTags[msg.channel.guild.id])) {
                            delete CustomTags[msg.channel.guild.id];
                            console.log(serverC("@" + msg.channel.guild.name + ": ") + botC("@WishBot") + " - " + warningC("Removed server from command database"));
                        }
                        updated = true;
                    } else console.log(errorC(err));
                }).catch();
            } else bot.createMessage(msg.channel.id, "Cannot remove that as its not created").catch();
        } else if (suffix.split(" ")[0] === "edit") {
            suffix = suffix.substring((suffix.split(" ")[0].substring(1)).length + 2);
            let toEdit = suffix.substr(0, suffix.indexOf(' '));
            let editted = suffix.substr(suffix.indexOf(' ') + 1);
            if (CustomTags.hasOwnProperty(msg.channel.guild.id) && CustomTags[msg.channel.guild.id].hasOwnProperty(toEdit)) {
                CustomTags[msg.channel.guild.id][toEdit] = editted;
                bot.createMessage(msg.channel.id, "🆗");
            } else bot.createMessage(msg.channel.id, "Cannot edit that which doesn't exist").catch();
        } else {
            if (!CustomTags.hasOwnProperty(msg.channel.guild.id)) bot.createMessage(msg.channel.id, "No Chans Found on this Server").catch();
            else if (CustomTags[msg.channel.guild.id][suffix.split(" ")[0]]) bot.createMessage(msg.channel.id, CustomTags[msg.channel.guild.id][suffix.split(" ")[0]]);
            else {
                let msgString = "Chans - " + Object.keys(CustomTags[msg.channel.guild.id]).sort().map(cmd => "`" + cmd + "`").join(", ");
                bot.createMessage(msg.channel.id, msgString).catch();
            }
        }
    }
}

exports.remove = function(server) {
    delete CustomTags[server.id];
    updated = true;
}

function saveCustomTags() {
    fs.writeFile(__dirname + '/../../database/CustomTags-temp.json', JSON.stringify(CustomTags, null, 4), error => {
        if (error) console.log(error);
        else {
            fs.stat(__dirname + '/../../database/CustomTags-temp.json', (err, stats) => {
                if (err) console.log(err);
                else if (stats["size"] < 5) console.log(errorC("There was a size mismatch error with CustomTags"));
                else {
                    fs.rename(__dirname + '/../../database/CustomTags-temp.json', __dirname + '/../../database/CustomTags.json', e => {
                        if (e) console.log(e);
                    });
                }
            });
        }
    })
}