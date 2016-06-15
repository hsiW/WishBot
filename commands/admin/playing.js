var games = require("./../../lists/games.json").games;

module.exports = {
    usage: "Sets the currently playing game to the mentioned word or to a random game if none mentioned\n`playing [game] or [none]",
    delete: true,
    process: function(bot, msg, suffix) {
        if (suffix) bot.editGame({
            name: suffix
        })
        else bot.editGame(null);
        bot.createMessage(msg.channel.id, '🆗');
    }
}