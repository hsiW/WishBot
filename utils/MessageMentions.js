module.exports = function(bot, msg) {
    bot.getChannelMessages(msg.channel.id, 5).then(messages => {
        msg.mentions.forEach(i => {
            if(msg.channel.guild.members.get(i).status === "online") return;
            var mentionMessages = "You were mentioned on **" + msg.channel.guild.name + "** at *" + new Date(msg.timestamp).toUTCString() + "*:\n" + messages.map(message => message.author.username + ": " + message.content).reverse().join('\n');
            bot.getDMChannel(i).then(privateChannel => {
                bot.createMessage(privateChannel.id, mentionMessages).catch(err => errorC(err));
            }).catch(err => errorC(err));
        });
    }).catch(err => errorC(err));
}