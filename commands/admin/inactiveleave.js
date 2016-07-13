let UsageChecker = require('./../../utils/UsageChecker.js');

module.exports = {
    process: function(bot, msg) {
        UsageChecker.checkInactivity(bot).then(UsageChecker.removeInactive(bot, msg).then(success => bot.createMessage(msg.channel.id, success))).catch(err => bot.createMessage(msg.channel.id, err));
    }
}