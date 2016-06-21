module.exports = {
    usage: "Flips a coin",
    delete: true,
    cooldown: 2,
    process: (bot, msg, suffix) => {
        bot.createMessage(msg.channel.id, "**" + msg.author.username + "**, I flipped a coin and got **" + (Math.random() < 0.5 ? "Heads" : "Tails") + "**! ⚖");
    }
}