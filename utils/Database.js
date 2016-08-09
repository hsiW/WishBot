let mysql = require('mysql'),
    options = require('./../options/options.json'),
    pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost', //Its local you cant do anything anyway
        port: '3306',
        user: 'Onee',
        password: 'Boudreau18!',
        database: 'database'
    }),
    utils = require('./utils.js');

exports.changePrefix = (guild, prefix) => {

}

exports.checkPrefix = (guild, prefix) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM sever_settings WHERE prefix = ' + prefix, (err, rows) => {
            if (err) {
                console.log(errorC(err));
                reject();
            } else if (rows.length <= 1) resolve();
            else reject();
        });
    });
}

exports.ignoreChannel = channel => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO channel_ignores SET channel_id=?', channel.id, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

exports.unignoreChannel = channel => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM channel_ignores WHERE channel_id=' + channel.id, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

exports.checkChannel = channel => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM channel_ignores WHERE channel_id = ' + channel.id, (err, rows) => {
            if (err) resolve();
            else if (rows.length >= 1) reject();
            else resolve();
        });
    });
}

exports.toggleCommand = (guild, command) => {

}

exports.checkCommand = (guild, command) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM server_settings WHERE guild = ' + guild.id, (err, rows) => {
            if (err) {
                console.log(errorC(err));
                reject();
            } else if (rows.length <= 1) resolve();
            else reject();
        });
    });
}

exports.toggleSetting = (guild, setting) => {
    return false;
}

exports.checkSetting = (guild, setting) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM server_settings WHERE guild = ' + guild.id, (err, rows) => {
            if (err) {
                console.log(errorC(err));
                reject();
            } else if (rows.length <= 1) resolve();
            else reject();
        });
    });
}