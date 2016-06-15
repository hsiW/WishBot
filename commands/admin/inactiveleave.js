module.exports = {
    process: function(bot, msg) {
        Database.removeInactive(bot, msg);
    }
}