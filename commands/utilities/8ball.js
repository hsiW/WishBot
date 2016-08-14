let eightBall = require("./../../lists/8ball.json");

module.exports = {
    usage: "A magical 8ball that answers any question asked of it.\n`8ball [question]`",
    cooldown: 5,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, `**${msg.author.username}**-senpai the 8ball reads: **${eightBall[Math.floor(Math.random() * (eightBall.length))]}**`).catch();
    }
}