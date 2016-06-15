var smug = require('./../../lists/smug.json').smug;
var request = require('request').defaults({
    encoding: null
});

module.exports = {
    usage: "This bot prints a random smug image in the current channel",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        request(smug[Math.floor(Math.random() * (smug.length))], function(err, response, buffer) {
            bot.createMessage(msg.channel.id, null, {
                file: buffer,
                name: 'smug.jpg'
            });
        });
    }
}