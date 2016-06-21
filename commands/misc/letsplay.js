module.exports = {
    usage: "Tells everyone you'd like to play a game. Can mention the game if one is mentioned\n`letsplay [game] or [none]`",
    delete: true,
    cooldown: 10,
    process: (bot, msg, suffix) =>{
        if (!suffix) suffix = "a game";
        if (msg.channel.permissionsOf(msg.author.id).json.mentionEveryone) bot.createMessage(msg.channel.id, {
            content: "🎮 @everyone, **" + msg.author.username + "** would like to play " + suffix + "! 🎮",
            disableEveryone: false
        });
        else bot.createMessage(msg.channel.id, "🎮 Everyone, **" + msg.author.username + "** would like to play " + suffix + "! 🎮");
    }
}