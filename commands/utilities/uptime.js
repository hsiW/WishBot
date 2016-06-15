var serverUptime = require('os').uptime();

module.exports = {
    usage: 'Prints out the bots estimated uptime.',
    delete: true,
    cooldown: 2,
    process: function(bot, msg) {
        var msgString = '```ruby';
        msgString += '\n   Bot Uptime - ' + Math.round(bot.uptime / 864000000) + 'd : ' + Math.round((bot.uptime / 3600000) % 24) + 'h : ' + Math.round((bot.uptime / 60000) % 60) + 'm : ' + Math.round((bot.uptime / 1000) % 60) + 's';
        msgString += '\nServer Uptime - ' + Math.round(serverUptime / 86400) + 'd : ' + Math.round((serverUptime / 3600) % 24) + 'h : ' + Math.round((serverUptime / 60) % 60) + 'm : ' + Math.round((serverUptime) % 60) + 's'
        bot.createMessage(msg.channel.id, msgString + '```');
    }
}