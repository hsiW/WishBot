UsageCheck = require('./../database/UsageCheck.json'),
inactiveServers = [];
var fs = require('fs'),
    updated = false,
    usageUpdated = false;

setInterval(() => {
    if (usageUpdated) {
        updated = false;
        saveUsage();
    }
}, 30000);

exports.checkInactivity = function(bot) {
    inactiveServers = [];
    var now = Date.now();
    Object.keys(UsageCheck).map(id => {
        if (!bot.guilds.get(id)) delete UsageCheck[id];
    });
    bot.guilds.forEach(server => {
        if (server == undefined) return;
        else if (!UsageCheck.hasOwnProperty(server.id)) UsageCheck[server.id] = now;
        else if (now - UsageCheck[server.id] >= 6.048e+8) inactiveServers.push(server.id);
    })
    if (inactiveServers.length > 0) {
        console.log(botC(`Will Leave ${inactiveServers.length} server(s) on next inactivity tick.`));
        usageUpdated = true;
    }
}

exports.updateTimestamp = function(guild) {
    if (!guild || !guild.id) return;
    if (UsageCheck.hasOwnProperty(guild.id)) UsageCheck[guild.id] = Date.now();
    if (inactiveServers.indexOf(guild.id) > -1) inactiveServers.splice(inactiveServers.indexOf(guild.id), 1);
    usageUpdated = true;
}

exports.removeInactive = function(bot, msg) {
    if (inactiveServers.length === 0) bot.createMessage(msg.channel.id, "There are currently no inactive servers!");
    else {
        var toSend = "Left servers:",
            count = 0;
        var remInterval = setInterval(() => {
            var server = bot.guilds.get('id', inactiveServers[passedOver]);
            if (count >= inactiveServers.length) {
                for (var i = 0; i < passedOver; i++) inactiveServers.shift();
                if (count == 0) bot.createMessage(msg.channel.id, 'No Servers to Leave.');
                else bot.createMessage(msg.channel.id, toSend);
                clearInterval(remInterval);
                return;
            }
            if (server) {
                toSend += '\n**' + (count + 1) + ':** ' + server.name;
                bot.leaveGuild(server.id).then(console.log('Left Server Due to Nonuse -  ' + server.name)).catch(console.log);
                if (UsageCheck.hasOwnProperty(server.id)) delete UsageCheck[server.id];
                count++;
            } else {
                delete UsageCheck[inactiveServers[count]];
            }
            count++;

        }, 10000);
        usageUpdated = true;
    }
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