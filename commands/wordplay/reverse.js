module.exports = {
    usage: 'Reverses the inputted text.\n`reverse [text]`',
    cooldown: 2,
    process: (bot, msg, suffix) => {
        bot.createMessage(msg.channel.id, `‮ ${suffix}`).catch();
    }
}