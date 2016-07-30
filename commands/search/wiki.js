var axios = require('axios');

module.exports = {
    usage: "Prints out a Wikipedia link for the mentioned terms\n`wiki [terms]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix) {
            axios.get(`https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=${suffix.replace(' ','_')}`).then(response => {
                bot.createMessage(msg.channel.id, `**${msg.author.username}**, I searched for **\"${suffix}\"** and found this, Senpai: \n**<https://en.wikipedia.org/?curid=${response.data.parse.pageid}>**`);
            }).catch(console.log)
        } else bot.createMessage(msg.channel.id, "You need to enter a topic to be searched, **" + msg.author.username + "**-senpai.").then(message => utils.messageDelete(bot, message, null));;
    }
}