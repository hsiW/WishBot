module.exports = {
    usage: 'Gives you a link to the source for this bot.',
    delete: true,
    cooldown: 30,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, 'The source code for this bot may be found here:\n**<https://github.com/hsiw/Wishbot>**');
    }
}