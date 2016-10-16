let UsageCheck = require('./../database/UsageCheck.json'), //UsageCheck database thingy
    fs = require('fs'),
    usageUpdated = false;

//Global array of inactive guilds
inactiveGuilds = []

//Saves file every 1s if the usage has been updated
setInterval(() => {
    if (usageUpdated) {
        usageUpdated = false;
        saveUsage();
    }
}, 1000);

//Updates usage timestamp to prevent guild from being marked as inactive
exports.updateTimestamp = guild => {
    if (!guild || !guild.id) return; //If no guild recieved or guild doesn't have an id skip it
    if (UsageCheck.hasOwnProperty(guild.id)) UsageCheck[guild.id] = Date.now(); //If in UsageCheck set the last used time to now
    if (inactiveGuilds.indexOf(guild.id) > -1) inactiveGuilds.splice(inactiveGuilds.indexOf(guild.id), 1); //If guild is in the inactiveGuilds array remove it
    usageUpdated = true; //Usage is updated so update whenever 1s internval ticks
}

//Add Guild to UsageCheck Database
exports.addToUsageCheck = guild => {
    if (!guild || !guild.id) return; //If no guild recieved or guild doesn't have an id skip it
    if (!UsageCheck.hasOwnProperty(guild.id)) UsageCheck[guild.id] = Date.now(); //If not in database add it with that last time used as now
    usageUpdated = true; //Usage Updated so save file
}

exports.removeFromUsageCheck = guild => {
    if (!guild || !guild.id) return; //If no guild recieved or guild doesn't have an id skip it
    if (UsageCheck.hasOwnProperty(guild.id)) delete UsageCheck[guild.id]; //If in databse remove from database
    usageUpdated = true; //Update file
}

exports.checkInactivity = bot => {
    return new Promise(resolve => {
        //Resets inactive guild array 
        inactiveGuilds = [];
        let now = Date.now();
        //If the server is in the UsageCheck but the bot is no longer in the guild remove it from the database
        Object.keys(UsageCheck).map(id => {
            if (!bot.guilds.get(id)) delete UsageCheck[id];
        });
        bot.guilds.forEach(guild => {
            if (!UsageCheck.hasOwnProperty(guild.id)) UsageCheck[guild.id] = now; //If not in UsageCheck add to it with the last used value as now
            else if ((now - UsageCheck[guild.id]) >= 1.21e+9) inactiveGuilds.push(guild.id); //If last used time is greator than 2 weeks ago add to inactiveGuilds array
        })
        if (inactiveGuilds.length > 0) { //If theres inactive guilds resolve as well as updating file
            usageUpdated = true;
            resolve(`Will Leave ${inactiveGuilds.length} guild(s) on next inactivity tick.`);
        } else if (inactiveGuilds.length <= 0) resolve('Currently No Inactive Guilds'); //If no inactive guilds resolve
    });
}

exports.removeInactive = bot => {
    return new Promise((resolve, reject) => {
        if (inactiveGuilds.length === 0) reject('Currently No Inactive Guilds') //Reject if no inactive guilds
        else {
            let count = 0,
                serverCount = 0;
            var removalInterval = setInterval(() => { //Try to leave guild every 200ms
                let server = bot.guilds.get(inactiveGuilds[serverCount]); //Get server object from ID provided by inactiveGuilds array
                if (count >= inactiveGuilds.length) {
                    if (count === 0) reject('Currently No Inactive Guilds'); //Reject if no inactive guilds
                    else resolve('Left ' + count + ' Inactive Guilds'); //Resolve with number of left guilds
                    usageUpdated = true;
                    clearInterval(removalInterval); //Stop Interval
                    return;
                } else if (server) {
                    bot.leaveGuild(server.id).then(console.log(warningC('Left Server Due to Inactivity - ' + server.name))).catch(err => console.log(errorC(err))); //Leave server and log if error
                    if (UsageCheck.hasOwnProperty(server.id)) delete UsageCheck[server.id]; //If in UsageCheck remove from UsageCheck
                    count++; //Add 1 to left count
                } else delete UsageCheck[inactiveGuilds[serverCount]];
                serverCount++; //Add 1 to current server index position
            }, 200)
        }
    });
}

//Save usage json
function saveUsage() {
    fs.writeFile(__dirname + '/../database/UsageCheck-temp.json', JSON.stringify(UsageCheck, null, 4), error => { //Save Json in a more readable format(first using an temp json to prevent loss of data)
        if (error) console.log(error);
        else {
            fs.stat(__dirname + '/../database/UsageCheck-temp.json', (err, stats) => { //Check size of UsageCheck to prevent loss of data
                if (err) console.log(err);
                else if (stats["size"] < 5) console.log(errorC("There was a size mismatch error with UsageCheck"));
                else {
                    fs.rename(__dirname + '/../database/UsageCheck-temp.json', __dirname + '/../database/UsageCheck.json', e => { //Overwrite main UsageCheck with temp UsageCheck
                        if (e) console.log(e);
                    });
                }
            });
        }
    })
}