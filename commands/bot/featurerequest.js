module.exports = {
    usage: 'Sends a feature request to the maker of this bot\n`request [feature to request]`',
    delete: true,
    cooldown: 60,
    process: (bot, msg, suffix) => {
        if (!suffix) return;
        bot.createMessage(msg.channel.id, 'Your request for \'**' + suffix + '**\' was successfully sent, **' + msg.author.username + '**-senpai.').catch()
        bot.createMessage('142794318837579777', '__Requested on the server **' + msg.channel.guild.name + '** by **' + msg.author.username + '**:__`' + msg.author.id + '`\n' + suffix).catch();
    }
}