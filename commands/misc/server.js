module.exports = {
    usage: 'Prints out a link to this bots help/testing server.',
    delete: true,
    cooldown: 20,
    process: function(bot, msg) {
        bot.createMessage(msg.channel.id, "__**" + msg.author.username + "-senpai, heres a invite to my server:**__\nhttps://discord.gg/0lBiROCNVaGw5Eqk");
    }
}