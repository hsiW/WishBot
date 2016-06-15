var alias = require('./../../options/alias.json');

module.exports = {
    usage: 'Prints out a list of Command Aliases.',
    delete: true,
    cooldown: 10,
    process: function(bot, msg) {
        var msgString = 'The following are the current command aliases:\n```ruby\n';
        Object.keys(alias).sort().forEach(function(ali) {
            msgString += `\n${alias[ali]}: ${ali}`;
        });
        msgString += '```\n\n```ruby\n[command]: [command alias]```';
        bot.getDMChannel(msg.author.id).then(privateChannel => bot.createMessage(privateChannel.id, msgString)).catch(err => console.log(errorC(err)));
    }
}