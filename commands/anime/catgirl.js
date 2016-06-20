var mysql = require('mysql');
var options = require('./../../options/options.json');
var pool = mysql.createPool({
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
    process: function(bot, msg) {
        pool.query('SELECT * FROM catgirl ORDER BY RAND() LIMIT 1', function(err, rows, res) {
            if (err) console.log(errorC('Error while performing Query'));
            else bot.createMessage(msg.channel.id, rows[0].url);
        });
    }
}