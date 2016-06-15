var Ignored = require('./../../utils/Ignored.js');

module.exports = {
    delete: true,
    process: function(bot, msg, suffix) {
        var userID;
        if (msg.mentions.length === 1) userID = msg.mentions[0];
        else if (bot.users.get('id', suffix)) userID = suffix;
        else {
            bot.createMessage(msg.channel.id, `Cannot add ${suffix} to ignore.`)
            return;
        }
        Ignored.add(bot, msg, userID);
    }
}