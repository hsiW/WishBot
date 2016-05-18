var chalk = require("chalk"),
    c = new chalk.constructor({
        enabled: true
    });
var serverC = c.black.bold,
    channelC = c.green.bold,
    userC = c.cyan.bold,
    warningC = c.yellow.bold,
    errorC = c.red.bold,
    botC = c.magenta.bold;

var cmdIndex = [];
var cmdUsage = [];
var lastExecTime = {}
setInterval(() => {
    lastExecTime = {}
}, 3600000);

exports.commandHandler = function(bot, msg, suffix, cmdTxt, msgPrefix) {
    if (serverSettings.hasOwnProperty(msg.channel.guild.id) && serverSettings[msg.channel.guild.id][cmdTxt] === false) return;
    else if ((Commands[cmdTxt].type === "mod" || Commands[cmdTxt].type === "mod") && !((msg.channel.permissionsOf(msg.author.id).json['manageRoles']) || admins.indexOf(msg.author.id) > -1)) return;
    else if (Commands[cmdTxt].type === "admin" && admins.indexOf(msg.author.id) === -1) return;
    else {
        processCmd(bot, msg, suffix, cmdTxt, msgPrefix);
        Database.updateTimestamp(msg.channel.guild);
    }
}

function processCmd(bot, msg, suffix, cmdTxt, msgPrefix) {
    var cmd = Commands[cmdTxt]
    commandUsage(cmdTxt);
    if (cmd == null) bot.createMessage(msg.channel.id, "There was an error with that command, Please try again");
    else if (cmd.privateServer && msg.channel.guild.id != "87601506039132160") {
        bot.createMessage(msg.channel.id, ":warning: I'm sorry but that command doesn't exist on this server. :warning:");
        bot.deleteMessage(msg.channel.id, msg.id);
    } else {
        if (!(admins.indexOf(msg.author.id) > -1) && cmd.cooldown > 0) {
            if (!lastExecTime.hasOwnProperty(cmdTxt)) lastExecTime[cmdTxt] = {};
            if (!lastExecTime[cmdTxt].hasOwnProperty(msg.author.id)) lastExecTime[cmdTxt][msg.author.id] = new Date().valueOf();
            else {
                var currentTime = Date.now();
                if (currentTime < (lastExecTime[cmdTxt][msg.author.id] + (cmd.cooldown * 1000))) {
                    bot.createMessage(msg.channel.id, "**" + msg.author.username + "**-senpai that command is currently on cooldown for **" + Math.round(((lastExecTime[cmdTxt][msg.author.id] + cmd.cooldown * 1000) - currentTime) / 1000) + "** more seconds.");
                    return;
                }
                lastExecTime[cmdTxt][msg.author.id] = currentTime;
            }
        }
        console.log(serverC("@" + msg.channel.guild.name + ":") + channelC(" #" + msg.channel.name) + ": " + botC("@WishBot") + " - " + warningC(msgPrefix + "" + cmdTxt) + " was used by " + userC(msg.author.username));
        try {
            cmd.process(bot, msg, suffix, cmdIndex, cmdUsage);
            if (cmd.delete) bot.deleteMessage(msg.channel.id, msg.id);
        } catch (err) {
            bot.createMessage(msg.channel.id, "```" + err + "```");
            console.log(errorC(err.stack));
        }
    }
}

exports.processCmd = processCmd;

function commandUsage(cmdTxt) {
    if (cmdIndex.indexOf(cmdTxt) > -1) {
        cmdUsage[cmdIndex.indexOf(cmdTxt)]++;
    } else {
        cmdIndex.push(cmdTxt);
        cmdUsage.push(1);
    }
}