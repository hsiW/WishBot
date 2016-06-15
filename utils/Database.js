serverSettings = require('./../database/ServerSettings.json');
UsageCheck = require('./../database/UsageCheck.json');
var admins = require('./../options/admins.json').admins;
var fs = require('fs');
var updated = false;
var usageUpdated = false;
inactiveServers = [];

setInterval(() => {
    if (updated) {
        updated = false;
        saveDatabase();
    }
    if (usageUpdated) {
        updated = false;
        saveUsage();
    }
}, 30000);

function add(msg) {
    serverSettings[msg.channel.guild.id] = {};
    console.log(serverC("@" + msg.channel.guild.name + ": ") + botC("@WishBot") + " - " + warningC("Added from Database"));
}

function remove(server) {
    delete serverSettings[server.id];
    updated = true;
}

function changePrefix(bot, msg, suffix) {
    if (serverSettings.hasOwnProperty(msg.channel.guild.id)) {
        if ((msg.channel.permissionsOf(msg.author.id).json['manageRoles'] || admins.indexOf(msg.author.id) > -1) && suffix === "&") {
            delete serverSettings[msg.channel.guild.id]["Prefix"];
            console.log(serverC("@" + msg.channel.guild.name + ": ") + botC("@WishBot") + " - Changed prefix to " + warningC(suffix));
            bot.createMessage(msg.channel.id, "🆗");
            checkLength(msg);
            updated = true;
        } else if (suffix.includes(' ')) {
            bot.createMessage(msg.channel.id, "Prefix's cannot contain spaces, sorry!")
            return;
        } else if (msg.channel.permissionsOf(msg.author.id).json['manageRoles'] || admins.indexOf(msg.author.id) > -1) {
            serverSettings[msg.channel.guild.id]["Prefix"] = suffix;
            console.log(serverC("@" + msg.channel.guild.name + ": ") + botC("@WishBot") + " - Changed prefix to " + warningC(suffix));
            bot.createMessage(msg.channel.id, "🆗");
            checkLength(msg);
            updated = true;
        }
    } else {
        add(msg);
        changePrefix(bot, msg, suffix);
    }
}

function toggle(bot, msg, suffix) {
    if (serverSettings.hasOwnProperty(msg.channel.guild.id)) {
        if (serverSettings[msg.channel.guild.id].hasOwnProperty(suffix)) {
            delete serverSettings[msg.channel.guild.id][suffix];
            console.log(serverC("@" + msg.channel.guild.name) + " : " + botC("@WishBot") + " - Toggled " + warningC(suffix) + " to " + errorC("true"));
            if (suffix === "welcome") bot.createMessage(msg.channel.id, "❎"); //Toggle welcome off
            else bot.createMessage(msg.channel.id, "✅");
            checkLength(msg);
            updated = true;
        } else {
            serverSettings[msg.channel.guild.id][suffix] = false;
            console.log(serverC("@" + msg.channel.guild.name) + " : " + botC("@WishBot") + " - Toggled " + warningC(suffix) + " to " + errorC("false"));
            if (suffix === "welcome") bot.createMessage(msg.channel.id, "✅"); //Toggle welcome on
            else bot.createMessage(msg.channel.id, "❎");
            checkLength(msg);
            updated = true;
        }
    } else {
        add(msg);
        toggle(bot, msg, suffix);
    }
}

function checkLength(msg) {
    if (Object.keys(serverSettings[msg.channel.guild.id]).length === 0) remove(msg.channel.guild);
}

exports.checkInactivity = function(bot) {
    inactiveServers = [];
    var now = Date.now();
    Object.keys(UsageCheck).map(id => {
        if (!bot.guilds.get(id)) delete UsageCheck[id];
    });
    bot.guilds.filter(server => {
        if (server == undefined) return;
        else if (!UsageCheck.hasOwnProperty(server.id)) UsageCheck[server.id] = now;
        else if (now - UsageCheck[server.id] >= 1210000000) inactiveServers.push(server.id);
    })
    if (inactiveServers.length > 0) {
        console.log("Will Leave " + inactiveServers.length + " servers on next inactivity tick.");
        usageUpdated = true;
    }
}

exports.removeInactive = function(bot, msg) {
    if (inactiveServers.length === 0) bot.createMessage(msg.channel.id, "There are currently no inactive servers!");
    else {
        var count = 0,
            passedOver = 0,
            toSend = "Left servers:"
        var remInterval = setInterval(() => {
            var server = bot.guilds.get('id', inactiveServers[passedOver]);
            if (server) {
                toSend += '\n**' + (count + 1) + ':** ' + server.name;
                bot.leaveGuild(server.id).then(console.log('"Left Server Due to Nonuse -  " + server.name')).catch(console.log);
                if (UsageCheck.hasOwnProperty(server.id)) delete UsageCheck[server.id];
                count++;
            }
            delete UsageCheck[inactiveServers[passedOver]];
            passedOver++;
            if (count >= 3000 || passedOver >= inactiveServers.length) {
                for (var i = 0; i < passedOver; i++) inactiveServers.shift();
                if (count == 0) bot.createMessage(msg.channel.id, 'No Servers to Leave.');
                else bot.createMessage(msg.channel.id, toSend);
                clearInterval(remInterval);
                return;
            }
        }, 10000);
        usageUpdated = true;
    }
}

exports.updateTimestamp = function(guild) {
    if (!guild || !guild.id) return;
    if (UsageCheck.hasOwnProperty(guild.id)) UsageCheck[guild.id] = Date.now();
    if (inactiveServers.indexOf(guild.id) > -1) inactiveServers.splice(inactiveServers.indexOf(guild.id), 1);
    usageUpdated = true;
}

function saveUsage() {
    fs.writeFile(__dirname + '/../database/UsageCheck-temp.json', JSON.stringify(UsageCheck, null, 4), error => {
        if (error) console.log(error)
        else {
            fs.stat(__dirname + '/../database/UsageCheck-temp.json', (err, stats) => {
                if (err) console.log(err)
                else if (stats["size"] < 5) console.log("ERROR due to size");
                else {
                    fs.rename(__dirname + '/../database/UsageCheck-temp.json', __dirname + '/../database/UsageCheck.json', e => {
                        if (e) console.log(e);
                    });
                }
            });
        }
    })
}

function saveDatabase() {
    fs.writeFile(__dirname + '/../database/ServerSettings-temp.json', JSON.stringify(serverSettings, null, 4), error => {
        if (error) console.log(error)
        else {
            fs.stat(__dirname + '/../database/ServerSettings-temp.json', (err, stats) => {
                if (err) console.log(err)
                else if (stats["size"] < 5) console.log("ERROR due to size");
                else {
                    fs.rename(__dirname + '/../database/ServerSettings-temp.json', __dirname + '/../database/ServerSettings.json', e => {
                        if (e) console.log(e);
                    });
                }
            });
        }
    })
}

exports.changePrefix = changePrefix;
exports.toggle = toggle;
exports.add = add;
exports.remove = remove;