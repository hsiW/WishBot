module.exports = {
    usage: 'Reverses the mentioned terms\n`reverse [terms]`',
    cooldown: 2,
    process: (bot, msg, suffix) => {
        bot.createMessage(msg.channel.id, `‮ ${suffix}`).catch();
    }
}