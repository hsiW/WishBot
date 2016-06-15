module.exports = {
    usage: "Restarts the bot if running on something that causes it to restart when closed",
    delete: true,	
    process: function(bot, msg) {
        bot.disconnect()
        setTimeout(function() {
            console.log("@WishBot - Restarted bot.");
            process.exit(0);
        }, 1000);
    }
}