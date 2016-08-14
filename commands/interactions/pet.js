let getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Pets the user, can take a username/nickname(can take a mention if a match isnt found) to hug that pet.`pet [user] or [none]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        let links = ["http://i.imgur.com/Y3GB3K1.gif", "http://i.imgur.com/f7ByidM.gif", "http://i.imgur.com/LUpk6b6.gif"]
        if (suffix && (msg.mentions || getName(msg, suffix))) {
            msg.mentions.length === 1 ? user = msg.mentions[0] : user = getName(msg, suffix).user;
            bot.createMessage(msg.channel.id, user.mention + " was petted by **" + msg.author.username + "**\n" + links[Math.floor(Math.random() * (links.length))]).catch();
        } else bot.createMessage(msg.channel.id, bot.user.mention + " was petted by **" + msg.author.username + "**\n" + links[Math.floor(Math.random() * (links.length))]).catch();
    }
}