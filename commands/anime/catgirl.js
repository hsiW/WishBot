let mysql = require('mysql'),
    options = require('./../../options/options.json'),
    pool = mysql.createPool({
        connectionLimit: 100,
        host: options.database.host,
        port: options.database.port,
        user: options.database.user,
        password: options.database.password,
        database: options.database.database
    });

module.exports = {
    usage: 'Returns random image of a catgirl.',
    cooldown: 5,
    process: (bot, msg) => {
        pool.query('SELECT * FROM catgirl ORDER BY RAND() LIMIT 1', (err, rows, res) => {
            if (err) console.log(errorC('Error while performing Query'));
            else bot.createMessage(msg.channel.id, rows[0].url).catch();
        });
    }
}