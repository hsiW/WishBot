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
    bot.createMessage(msg.channel.id, 'Starting...')
    if (inactiveServers.length === 0) bot.createMessage(msg.channel.id, "There are currently no inactive servers!");
    else {
        let count = 0,
            serverCount = 0;
        var removalInterval = setInterval(() => {
            let server = bot.guilds.get(inactiveServers[serverCount]);
            if (count >= inactiveServers.length) {
                if (count === 0) bot.createMessage(msg.channel.id, 'No Servers to Leave.');
                else bot.createMessage(msg.channel.id, 'Left ' + count + ' Inactive Servers');
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
} //going to rewrite

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