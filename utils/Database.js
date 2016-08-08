let mysql = require('mysql'),
    options = require('./../../options/options.json'),
    pool = mysql.createPool({
        connectionLimit: 100,
        host: options.database.host,
        port: options.database.port,
        user: options.database.user,
        password: options.database.password,
        database: options.database.database,
        charset: 'utf8mb4_general_ci'
    }),
    utils = require('./../../utils/utils.js');

exports.changePrefix = (guild, prefix) => {

}

exports.checkPrefix = (guild, prefix) => {
    pool.query('SELECT * FROM sever_settings WHERE prefix = ' + prefix, (err, rows) => {
        if (err) {
            console.log(errorC('Error while performing Query'));
            return false;
        } else if (rows.length < 1) return false;
        else return true;
    });
}

exports.ignoreChannel = channel => {

}

exports.checkChannel = channel => {
    pool.query('SELECT * FROM channel_ignores WHERE channel_id = ' + channel.id, (err, rows) => {
        if (err) {
            console.log(errorC('Error while performing Query'));
            return false;
        } else if (rows.length < 1) return false;
        else return true;
    });
}

exports.toggleCommand = (guild, command) => {

}

exports.checkCommand = (guild, command) => {
    pool.query('SELECT * FROM server_settings WHERE guild = ' + guild.id, (err, rows) => {
        if (err) {
            console.log(errorC('Error while performing Query'));
            return false;
        } else if (rows.length < 1) return false;
        else {
            if (command is yes) return true;
            else return false;
        }
    });
}

exports.toggleSetting = (guild, setting) => {

}