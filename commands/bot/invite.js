module.exports = {
    usage: 'Returns a link to invite this bot to your server.',
    delete: true,
    cooldown: 20,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, '__**' + msg.author.username + '-senpai, you can use the following link to invite me to your server:**__\n**<https://discordapp.com/oauth2/authorize?&client_id=161620224305528833&scope=bot&permissions=67365888>**').catch();
    }
}