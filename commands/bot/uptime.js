var serverUptime = require('os').uptime();

module.exports = {
    usage: 'Prints out the bots estimated uptime.',
    delete: true,
    cooldown: 2,
    process: (bot, msg) => {
        var msgString = '```ruby';
        msgString += '\n   Bot Uptime - ' + Math.floor(bot.uptime / 864000000) + 'd : ' + Math.floor((bot.uptime / 3600000) % 24) + 'h : ' + Math.floor((bot.uptime / 60000) % 60) + 'm : ' + Math.floor((bot.uptime / 1000) % 60) + 's';
        msgString += '\nServer Uptime - ' + Math.floor(serverUptime / 86400) + 'd : ' + Math.floor((serverUptime / 3600) % 24) + 'h : ' + Math.floor((serverUptime / 60) % 60) + 'm : ' + Math.floor((serverUptime) % 60) + 's'
        bot.createMessage(msg.channel.id, msgString + '```');
    }
}