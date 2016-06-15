var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'Onee',
    password: 'Boudreau18!',
    database: 'database'
});

module.exports = {
    usage: 'Pings this bot, useful for checking if the bots working correctly.',
    cooldown: 5,
    process: function(bot, msg, suffix) {
        console.log("Command")
        pool.query('INSERT INTO whateveriwant SET test=?', suffix, function(err, rows, res) {
            if (err) {
                console.log('Error while performing query');
            } else {
                pool.query('SELECT * FROM whateveriwant ORDER BY RAND() LIMIT 1', function(err, rows, res) {
                    console.log(rows)
                    if (err) {
                        console.log(err);
                    } else {
                        bot.createMessage(msg.channel.id, "rows " + rows[0].test);
                    }
                })
            }
        });
    }
}