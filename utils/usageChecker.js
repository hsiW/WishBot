const usageCheck = require('./../database/usageCheck.json'), //usageCheck database thingy
    fs = require('fs');

let usageUpdated = false; //Used to check if usage was updated for saving 

//Global array of inactive guilds
inactiveGuilds = []

//Saves file every 1s if the usage has been updated
setInterval(() => {
    if (usageUpdated) {
        usageUpdated = false;
        saveUsage();
    }
}, 5000);

//Updates usage timestamp to prevent guild from being marked as inactive
exports.updateTimestamp = guild => {
    if (!guild || !guild.id) return; //If no guild recieved or guild doesn't have an id skip it
    if (usageCheck.hasOwnProperty(guild.id)) usageCheck[guild.id] = Date.now(); //If in usageCheck set the last used time to now
    if (inactiveGuilds.indexOf(guild.id) > -1) inactiveGuilds.splice(inactiveGuilds.indexOf(guild.id), 1); //If guild is in the inactiveGuilds array remove it
    usageUpdated = true; //Usage is updated so update whenever 1s internval ticks
}

//Add Guild to usageCheck Database
exports.addToUsageCheck = guild => {
    if (!guild || !guild.id) return; //If no guild recieved or guild doesn't have an id skip it
    if (!usageCheck.hasOwnProperty(guild.id)) usageCheck[guild.id] = Date.now(); //If not in database add it with that last time used as now
    usageUpdated = true; //Usage Updated so save file
}

//Remove Guild from usageCheck Database
exports.removeFromUsageCheck = guild => {
    if (!guild || !guild.id) return; //If no guild recieved or guild doesn't have an id skip it
    if (usageCheck.hasOwnProperty(guild.id)) delete usageCheck[guild.id]; //If in database remove from database
    usageUpdated = true; //Update file
}

//Check for Guild Inactivity
exports.checkInactivity = bot => {
    return new Promise(resolve => {
        //Resets inactive guild array 
        inactiveGuilds = [];
        let now = Date.now();
        //If the guild is in the usageCheck but the bot is no longer in the guild remove it from the database
        Object.keys(usageCheck).map(id => {
            if (!bot.guilds.get(id)) delete usageCheck[id];
        });
        bot.guilds.forEach(guild => {
            if (!usageCheck.hasOwnProperty(guild.id)) usageCheck[guild.id] = now; //If not in usageCheck add to it with the last used value as now
            else if ((now - usageCheck[guild.id]) >= 1.21e+9) inactiveGuilds.push(guild.id); //If last used time is greator than 2 weeks ago add to inactiveGuilds array
        })
        if (inactiveGuilds.length > 0) { //If theres inactive guilds resolve as well as updating file
            usageUpdated = true;
            resolve(`Will Leave ${inactiveGuilds.length} guild(s) on next inactivity tick.`);
        } else if (inactiveGuilds.length <= 0) resolve('Currently No Inactive Guilds'); //If no inactive guilds resolve
    });
}

//Remove Inactive Guilds
exports.removeInactive = bot => {
    return new Promise((resolve, reject) => {
        if (inactiveGuilds.length === 0) reject('Currently No Inactive Guilds') //Reject if no inactive guilds
        else {
            let count = 0,
                guildCount = 0;
            var removalInterval = setInterval(() => { //Try to leave guild every 200ms
                let guild = bot.guilds.get(inactiveGuilds[guildCount]); //Get guild object from ID provided by inactiveGuilds array
                if (count >= inactiveGuilds.length) {
                    if (count === 0) reject('Currently No Inactive Guilds'); //Reject if no inactive guilds
                    else resolve('Left ' + count + ' Inactive Guilds'); //Resolve with number of left guilds
                    usageUpdated = true;
                    clearInterval(removalInterval); //Stop Interval
                    return;
                } else if (guild) {
                    guild.leave().then(console.log(warningC('Left Server Due to Inactivity - ' + guild.name))).catch(err => console.log(errorC(err))); //Leave guild and log if error
                    if (usageCheck.hasOwnProperty(guild.id)) delete usageCheck[guild.id]; //If in usageCheck remove from usageCheck
                    count++; //Add 1 to left count
                } else delete usageCheck[inactiveGuilds[guildCount]];
                guildCount++; //Add 1 to current guild index position
            }, 200)
        }
    });
}

//Save Usage Database File
function saveUsage() {
    fs.writeFile(`${__dirname}/../database/usageCheck-temp.json`, JSON.stringify(usageCheck, null, 4), error => { //Save Json in a more readable format(first using an temp json to prevent loss of data)
        if (error) console.log(error);
        else {
            fs.stat(`${__dirname}/../database/usageCheck-temp.json`, (err, stats) => { //Check size of usageCheck to prevent loss of data
                if (err) console.log(err);
                else if (stats["size"] < 5) console.log(errorC("There was a size mismatch error with usageCheck"));
                else {
                    fs.rename(`${__dirname}/../database/usageCheck-temp.json`, `${__dirname}/../database/usageCheck.json`, e => { //Overwrite main usageCheck with temp usageCheck
                        if (e) console.log(e);
                    });
                }
            });
        }
    })
}