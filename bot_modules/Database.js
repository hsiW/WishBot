serverSettings = require('./../database/ServerSettings.json');
UsageCheck = require('./../database/UsageCheck.json');
var admins = require('./../options/admins.json').admins;
var fs = require('fs');
var updated = false;
var usageUpdated = false;

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
    serverSettings[msg.channel.server.id] = {};
    console.log(serverC("@" + msg.channel.server.name + ": ") + botC("@WishBot") + " - " + warningC("Added from Database"));
}

function remove(server) {
    delete serverSettings[server.id];
    console.log(serverC("@" + server.name + ": ") + botC("@WishBot") + " - " + errorC("Removed from Database"));
    updated = true;
}

function changePrefix(bot, msg, suffix) {
    if (serverSettings.hasOwnProperty(msg.channel.server.id)) {
        if ((msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1) && suffix === "&") {
            delete serverSettings[msg.channel.server.id]["Prefix"];
            console.log(serverC("@" + msg.channel.server.name + ": ") + botC("@WishBot") + " - Changed prefix to " + warningC(suffix));
            bot.sendMessage(msg, "🆗");
            checkLength(msg);
            updated = true;
        } else if (suffix.includes(' ')) {
            bot.sendMessage(msg, "Prefix's cannot contain spaces, sorry!")
            return;
        } else if (msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1) {
            serverSettings[msg.channel.server.id]["Prefix"] = suffix;
            console.log(serverC("@" + msg.channel.server.name + ": ") + botC("@WishBot") + " - Changed prefix to " + warningC(suffix));
            bot.sendMessage(msg, "🆗");
            checkLength(msg);
            updated = true;
        }
    } else {
        add(msg);
        changePrefix(bot, msg, suffix);
    }
}

function toggle(bot, msg, suffix) {
    if (serverSettings.hasOwnProperty(msg.channel.server.id)) {
        if (serverSettings[msg.channel.server.id].hasOwnProperty(suffix)) {
            delete serverSettings[msg.channel.server.id][suffix];
            console.log(serverC("@" + msg.channel.server.name) + " : " + botC("@WishBot") + " - Toggled " + warningC(suffix) + " to " + errorC("true"));
            bot.sendMessage(msg, "🆗")
            checkLength(msg);
            updated = true;
        } else {
            serverSettings[msg.channel.server.id][suffix] = false;
            console.log(serverC("@" + msg.channel.server.name) + " : " + botC("@WishBot") + " - Toggled " + warningC(suffix) + " to " + errorC("false"));
            bot.sendMessage(msg, "🆗");
            checkLength(msg);
            updated = true;
        }
    } else {
        add(msg);
        toggle(bot, msg, suffix);
    }
}

function checkLength(msg) {
    if (Object.keys(serverSettings[msg.channel.server.id]).length === 0) remove(msg.channel.server)
}

exports.checkInactivity = function(bot) {
    inactiveServers = [];
    var now = Date.now();
    Object.keys(UsageCheck).map(id => {
        if (!bot.servers.find(s => s.id === id)) delete UsageCheck[id];
    });
    bot.servers.map(server => {
        if (server == undefined) return;
        else if (!UsageCheck.hasOwnProperty(server.id)) UsageCheck[server.id] = now;
        else if (now - UsageCheck[server.id] >= 432000000) inactiveServers.push(server.id);
    })
    if (inactiveServers.length > 0) {
        console.log("Will Leave " + inactiveServers.length + " servers on next inactivity tick.");
        usageUpdated = true;
    }
}

exports.removeInactive = function(bot, msg) {
    if (inactiveServers.length === 0) bot.sendMessage(msg, "There is currently no inactive servers!");
    else {
        var count = 0,
            passedOver = 0,
            toSend = "Left servers:"
        var remInterval = setInterval(() => {
            var server = bot.servers.get('id', inactiveServers[passedOver]);
            if (server) {
                toSend += '\n**' + (count + 1) + ':** ' + server.name;
                server.leave();
                console.log("Left Server Due to Nonuse -  " + server.name);
                if (UsageCheck.hasOwnProperty(server.id)) delete UsageCheck[server.id];
                count++;
            }
            delete UsageCheck[inactiveServers[passedOver]];
            passedOver++;
            if (count >= 10 || passedOver >= inactiveServers.length) {
                for (var i = 0; i < passedOver; i++) inactiveServers.shift();
                if (count == 0) bot.sendMessage(msg, 'No Servers to Leave.');
                else bot.sendMessage(msg, toSend);
                clearInterval(remInterval);
                return;
            }
        }, 10000);
        usageUpdated = true;
    }
}

exports.updateTimestamp = function(server) {
    if (!server || !server.id) return;
    else if (UsageCheck.hasOwnProperty(server.id)) UsageCheck[server.id] = Date.now();
    else if (inactiveServers.indexOf(server.id) > -1) inactiveServers.splice(inactiveServers.indexOf(server.id), 1);
    usageUpdated = true;
};

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