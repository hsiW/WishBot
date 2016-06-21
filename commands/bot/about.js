var libVersion = require('./../../node_modules/eris/package.json').version;
var botVersion = require('./../../package.json').version;
var prefix = require('./../../options/options.json').prefix;

module.exports = {
    usage: "Gives you basic information about this bot.",
    delete: true,
    cooldown: 30,
    process: (bot, msg) => {
        var toSend = "```tex\n";
        toSend += "$ WishBot [" + bot.user.username + "] $";
        toSend += "\n\nLib: {Eris - v" + libVersion + "}";
        toSend += "\nVersion: {v" + botVersion + "a}";
        toSend += "\nCreator: { hsiW and Florestina }";
        toSend += "\nDefault Prefix: {" + prefix + "}";
        toSend += "\n\n% Use " + prefix + "help for command info."
        toSend += "\n% Support Server: https://discord.gg/0lBiROCNVaDaE8rR";
        toSend += "\n% Source: https://github.com/hsiw/Wishbot";
        bot.createMessage(msg.channel.id, toSend + "```")
    }
}