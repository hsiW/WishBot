module.exports = {
    usage: "Picks from the mentioned options\n`pick [option 1], [option 2], ect`",
    cooldown: 5,
    process: function(bot, msg, suffix) {
        if (!suffix || suffix.split(",").length < 2) {
            bot.createMessage(msg.channel.id, "I can't pick from that, **" + msg.author.username + "**-senpai.");
        } else {
            var choices = suffix.split(",");
            bot.createMessage(msg.channel.id, "**" + msg.author.username + "**, I picked **" + choices[Math.floor(Math.random() * (choices.length))] + "**! ✅");
        }
    }
}