let mysql = require('mysql'),
    fs = require('fs'),
    options = require('./../options/options.json'),
    pool = mysql.createPool({
        connectionLimit: 100,
        host: options.database.host,
        port: options.database.port,
        user: options.database.user,
        password: options.database.password,
        database: options.database.database
    }),
    guildPrefixes = require('./../database/guildPrefixes.json');

function addGuild(guild) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO server_settings SET ?', {
            guild_id: guild.id,
            settings: JSON.stringify({}),
            disabled_commands: JSON.stringify({})
        }, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

exports.removeGuild = guild => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM server_settings WHERE guild_id = ' + guild.id, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

//Ignore Channel Stuffs
exports.ignoreChannel = channel => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO channel_ignores SET channel_id = ' + channel.id, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

exports.unignoreChannel = channel => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM channel_ignores WHERE channel_id = ' + channel.id, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

exports.checkChannel = channel => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM channel_ignores WHERE channel_id = ' + channel.id, (err, result) => {
            if (err) resolve();
            else if (result.length >= 1) reject();
            else resolve();
        });
    });
}

//Command Stuffs
function toggleCommand(guild, command) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM server_settings WHERE guild_id = ' + guild.id, (err, result) => {
            if (err) console.log(err)
            else if (result.length === 0) addGuild(guild).then(() => toggleCommand(guild, command).then(action => resolve(action))).catch(err => reject(err))
            else {
                let toggled = false;
                if (result[0].disabled_commands != undefined) {
                    var disabled = JSON.parse(result[0].disabled_commands);
                    if (disabled.hasOwnProperty(command)) delete disabled[command];
                    else {
                        disabled[command] = true;
                        toggled = true;
                    }
                } else {
                    var disabled = {};
                    disabled[command] = true;
                    toggled = true;
                }
                let data = {
                    guild_id: guild.id,
                    disabled_commands: JSON.stringify(disabled)
                }
                saveGuild(guild, data).then(() => resolve(`Sucessfully toggled \`${command}\` to \`${!toggled}\``)).catch()
            }
        });
    });
}

function saveGuild(guild, data) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE server_settings SET ? WHERE guild_id = ' + guild.id, data, (err, res) => {
            if (err) reject(err);
            else resolve();
        })
    });
}

exports.checkCommand = (guild, command) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT disabled_commands FROM server_settings WHERE guild_id = ' + guild.id, (err, result) => {
            if (err) {
                console.log(err)
                resolve();
            } else if (result.length === 0) resolve();
            else {
                let disabled = JSON.parse(result[0].disabled_commands) ? JSON.parse(result[0].disabled_commands) : null;
                if (disabled != null && disabled[command] != undefined) reject();
                else resolve();
            }
        });
    });
}
exports.toggleCommand = toggleCommand;

//Settings
function toggleSetting(guild, settingChange, message, channel) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM server_settings WHERE guild_id = ' + guild.id, (err, result) => {
            if (err) console.log(err)
            else if (result.length === 0) addGuild(guild).then(() => toggleSetting(guild, settingChange, message, channel).then(action => resolve(action))).catch(err => reject(err))
            else {
                settingChange = settingChange.toLowerCase();
                var toggled = false,
                    usageChannel = result[0].channel_id != undefined ? result[0].channel_id : channel.id,
                    serverSettings = result[0].settings != undefined ? JSON.parse(result[0].settings) : {};
                if (settingChange === 'tableflip') {
                    if (serverSettings.hasOwnProperty('tableflip')) delete serverSettings.tableflip;
                    else {
                        serverSettings['tableflip'] = true;
                        toggled = true;
                    }
                } else if (settingChange === 'welcome') {
                    if (message) {
                        serverSettings.welcome = message;
                        toggled = true;
                        usageChannel = channel.id;
                    } else delete serverSettings.welcome;
                } else if (settingChange === 'leave') {
                    if (settingChange) {
                        serverSettings.leave = message;
                        toggled = true;
                        usageChannel = channel.id;
                    } else delete serverSettings.leave;
                }
                saveGuild(guild, {
                    guild_id: guild.id,
                    channel_id: usageChannel,
                    settings: JSON.stringify(serverSettings)
                }).then(() => resolve(`Sucessfully toggled \`${settingChange}\` to \`${toggled}\``)).catch()
            }
        });
    });
}
exports.toggleSetting = toggleSetting;

exports.checkSetting = (guild, check) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM server_settings WHERE guild_id = ' + guild.id, (err, result) => {
            if (err) reject(err);
            else if (result.length !== 0) {
                if (result[0].settings && Object.keys(JSON.parse(result[0].settings)).length > 0) {
                    let settings = JSON.parse(result[0].settings);
                    if (settings.hasOwnProperty('tableflip') && check === "tableflip") resolve();
                    else if (settings.hasOwnProperty('welcome') && check === "welcome") {
                        let data = {
                            channel: result[0].channel_id,
                            response: settings.welcome
                        }
                        resolve(data);
                    } else if (settings.hasOwnProperty('leave') && check === "leave") {
                        let data = {
                            channel: result[0].channel_id,
                            response: settings.leave
                        }
                        resolve(data);
                    }
                }
            }
        });
    });
}

//Guild Prefix Code

//Add guild to guildPrefixes object
function addGuildtoJson(guild) {
    return new Promise(resolve => {
        guildPrefixes[guild.id] = {};
        resolve();
    });
}

//Remove guild from guildPrefixes object if it exists in it
function removeGuildfromJson(guild) {
    if (guildPrefixes.hasOwnProperty(guild.id)) delete guildPrefixes[guild.id];
}
exports.removeGuildfromJson = removeGuildfromJson;

//Used for changing the guilds prefix
function changePrefix(guild, newPrefix) {
    return new Promise((resolve, reject) => {
        if (newPrefix === '') reject('The prefix cannot be nothing'); //Reject if prefix is nothing
        else if (newPrefix.includes(' ') || newPrefix === " ") reject('Prefixes cannot contain spaces'); //Reject if prefix contains spaces or is just a space
        else if (guildPrefixes.hasOwnProperty(guild.id)) { //If guild exists in guildPrefixes object already
            if (newPrefix === options.prefix) {
                removeGuildfromJson(guild); //If newPrefix is the same as the default prefix remove guild from json and resolve
                resolve();
            } else {
                guildPrefixes[guild.id] = newPrefix; //Change prefix to new prefix and resolve
                resolve();
            }
        } else addGuildtoJson(guild).then(() => changePrefix(guild, newPrefix).then(() => resolve())).catch(err => reject(err)); //Add guild to json then change prefix
        savePrefixes(); //Save guildPrefixes json file
    });
}
exports.changePrefix = changePrefix;

//Return the guild's prefix if it exists in the guildPrefixes database
exports.getPrefix = guild => {
    if (guildPrefixes.hasOwnProperty(guild.id)) return guildPrefixes[guild.id];
}

//Save guildPrefixes file checking to make sure that a blank file isn't saved
function savePrefixes() {
    fs.writeFile(__dirname + '/../database/guildPrefixes-temp.json', JSON.stringify(guildPrefixes, null, 4), error => {
        if (error) console.log(error);
        else {
            fs.stat(__dirname + '/../database/guildPrefixes-temp.json', (err, stats) => {
                if (err) console.log(err);
                else if (stats["size"] < 5) console.log(errorC("There was a size mismatch error with guildPrefixes"));
                else {
                    fs.renameSync(__dirname + '/../database/guildPrefixes-temp.json', __dirname + '/../database/guildPrefixes.json')
                }
            });
        }
    })
}