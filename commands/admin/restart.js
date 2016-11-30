module.exports = {
    usage: 'Restart the bot if using forever/pm2 otherwise the bot will be shutdown.',
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            resolve({
                message: 'Restarting...'
            })
            bot.disconnect();
            setTimeout(function() {
                console.log("@WishBot - Restarted bot.");
                process.exit(0);
            }, 1000);
        });
    }
}