module.exports = {
    usage: 'Reverses the mentioned terms\n`reverse [terms]`',
    delete: true,
    cooldown: 2,
    process: function(bot, msg, suffix) {
        bot.createMessage(msg.channel.id, `‮ ${suffix}`);
    }
}