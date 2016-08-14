module.exports = {
    usage: "Flips a coin to return heads or tails.",
    delete: true,
    cooldown: 2,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, `**${msg.author.username}**, I flipped a coin and got **${Math.random() < 0.5 ? "Heads" : "Tails"}**! ⚖`).catch();
    }
}