module.exports = {
    usage: "Secret",
    delete: true,
    process: function(bot, msg, suffix) {
        var postSuffix = suffix.substr(suffix.indexOf(' ') + 1);
        suffix = suffix.split(" ")[0];
        bot.getDMChannel(suffix).then(privateChannel =>
            bot.createMessage(privateChannel.id, `Message from **${msg.author.username}**: \n\"${postSuffix}\"\n - I'm a Bot, Bleep Bloop. If you'd like to message this user directly please join my bot server by doing \`server\``)
        );
    }
}