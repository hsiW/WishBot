let mysql = require('mysql'),
    fs = require('fs'),
    options = require('./../options/options.json'),
    pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost', //Its local you cant do anything anyway
        port: '3306',
        user: 'Onee',
        password: 'Boudreau18!',
        database: 'database'
    }),
    utils = require('./utils.js'),
    guildPrefixes = require('./../database/guildPrefixes.json')

function addGuild(guild) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO server_settings SET guild_id = ' + guild.id, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

exports.removeGuild = (guild) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM server_settings WHERE guild_id = ' + guild.id, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

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

exports.toggleCommand = (guild, command) => {

}

exports.checkCommand = (guild, command) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM server_settings WHERE guild = ' + guild.id, (err, result) => {
            if (err) {
                console.log(errorC(err));
                reject();
            } else if (result.length <= 1) resolve();
            else reject();
        });
    });
}

exports.toggleSetting = (guild, setting) => {
    return false;
}

exports.checkSetting = (guild, setting) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM server_settings WHERE guild = ' + guild.id, (err, result) => {
            if (err) {
                console.log(errorC(err));
                reject();
            } else if (result.length <= 1) resolve();
            else reject();
        });
    });
}

function addGuildtoJson(guild) {
    return new Promise((resolve, reject) => {
        guildPrefixes[guild.id] = {};
        resolve();
    });
}

function changePrefix(guild, newPrefix) {
    return new Promise((resolve, reject) => {
        if (guildPrefixes.hasOwnProperty(guild.id)) {
            if (newPrefix === options.prefix) {
                delete guildPrefixes[guild.id];
                resolve();
            } else if (newPrefix.includes(' ')) {
                reject('Prefixes cannot contain spaces');
            } else {
                guildPrefixes[guild.id] = newPrefix;
                resolve();
            }
        } else {
            addGuildtoJson(guild).then(() => changePrefix(guild, newPrefix).then(() => resolve()))
        }
        savePrefixes();
    });
}
exports.changePrefix = changePrefix;

exports.checkPrefix = (guild) => {
    if (guildPrefixes.hasOwnProperty(guild.id)) return guildPrefixes[guild.id];
}


function savePrefixes() {
    fs.writeFile(__dirname + '/../database/guildPrefixes-temp.json', JSON.stringify(guildPrefixes, null, 4), error => {
        if (error) console.log(errorC(error))
        else {
            fs.stat(__dirname + '/../database/guildPrefixes-temp.json', (err, stats) => {
                if (err) console.log(errorC(err))
                else if (stats["size"] < 5) console.log("ERROR due to size");
                else {
                    fs.rename(__dirname + '/../database/guildPrefixes-temp.json', __dirname + '/../database/guildPrefixes.json', e => {
                        if (e) console.log(errorC(e));
                    });
                }
            });
        }
    })
}