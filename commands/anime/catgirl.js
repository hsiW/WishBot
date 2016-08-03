let mysql = require('mysql'),
    options = require('./../../options/options.json'),
    pool = mysql.createPool({
        connectionLimit: options.connectionLimit,
        host: options.host,
        port: options.port,
        user: options.user,
        password: options.password,
        database: options.database
    });

module.exports = {
    usage: '',
    cooldown: 5,
    process: (bot, msg) => {
        pool.query('SELECT * FROM catgirl ORDER BY RAND() LIMIT 1', (err, rows, res) => {
            if (err) console.log(errorC('Error while performing Query'));
            else bot.createMessage(msg.channel.id, rows[0].url);
        });
    }
}