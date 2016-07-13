let UsageCheck = require('./../database/UsageCheck.json'),
    fs = require('fs'),
    updated = false,
    usageUpdated = false;

inactiveServers = []

setInterval(() => {
    if (usageUpdated) {
        updated = false;
        saveUsage();
    }
}, 30000);

exports.checkInactivity = function(bot) {
    return new Promise((resolve, reject) => {
        inactiveServers = [];
        let now = Date.now();
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
            resolve();
            usageUpdated = true;
        } else if (inactiveServers.length <= 0) {
            reject('Currently No Inactive Servers');
        }
    });
}

exports.updateTimestamp = function(guild) {
    if (!guild || !guild.id) return;
    if (UsageCheck.hasOwnProperty(guild.id)) UsageCheck[guild.id] = Date.now();
    if (inactiveServers.indexOf(guild.id) > -1) inactiveServers.splice(inactiveServers.indexOf(guild.id), 1);
    usageUpdated = true;
}

exports.removeInactive = function(bot, msg) {
    bot.createMessage(msg.channel.id, 'Starting...')
    return new Promise((resolve, reject) => {
        if (inactiveServers.length === 0) reject('Currently no inactive servers to leave.')
        else {
            let count = 0,
                serverCount = 0;
            var removalInterval = setInterval(() => {
                let server = bot.guilds.get(inactiveServers[serverCount]);
                if (count >= inactiveServers.length) {
                    if (count === 0) reject('Currently no inactive servers to leave.');
                    else resolve('Left ' + count + ' Inactive Servers');
                    usageUpdated = true;
                    clearInterval(removalInterval);
                    return;
                } else if (server) {
                    bot.leaveGuild(server.id).then(console.log(warningC('Left Server Due to Inactivity - ' + server.name))).catch(err => console.log(errorC(err)));
                    if (UsageCheck.hasOwnProperty(server.id)) delete UsageCheck[server.id];
                    count++;
                } else {
                    delete UsageCheck[inactiveServers[serverCount]];
                }
                serverCount++;
            }, 10000)
        }
    });
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