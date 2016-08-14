module.exports = {
    usage: "Tells everyone you'd like to play a game. Can specify a game if desired. Uses an @everyone mention if the user has permission to do so.\n`letsplay [game] or [none]`",
    delete: true,
    cooldown: 10,
    process: (bot, msg, suffix) => {
        if (!suffix) suffix = "a game";
        if (msg.channel.permissionsOf(msg.author.id).has('mentionEveryone')) bot.createMessage(msg.channel.id, {
            content: "🎮 @everyone, **" + msg.author.username + "** would like to play " + suffix + "! 🎮",
            disableEveryone: false
        }).catch();
        else bot.createMessage(msg.channel.id, "🎮 Everyone, **" + msg.author.username + "** would like to play " + suffix + "! 🎮").catch();
    }
}