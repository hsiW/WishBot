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
    if (serverSettings.hasOwnProperty(msg.channel.server.id) && serverSettings[msg.channel.server.id][cmdTxt] === false) return;
    else if ((Commands[cmdTxt].type === "mod" || Commands[cmdTxt].type === "mod") && !(msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1)) return;
    else if (Commands[cmdTxt].type === "admin" && admins.indexOf(msg.author.id) <= -1) return;
    else {
        processCmd(bot, msg, suffix, cmdTxt, msgPrefix);
        Database.updateTimestamp(msg.channel.server.id)
    }
}

function processCmd(bot, msg, suffix, cmdTxt, msgPrefix) {
    var cmd = Commands[cmdTxt]
    commandUsage(cmdTxt);
    if (cmd == null) bot.sendMessage(msg, "There was an error with that command, Please try again");
    else if (cmd.privateServer && msg.channel.server.id != "87601506039132160") {
        bot.sendMessage(msg, ":warning: I'm sorry but that command doesn't exist on this server. :warning:");
        bot.deleteMessage(msg);
    } else {
        if (!(admins.indexOf(msg.author.id) > -1) && cmd.cooldown > 0) {
            if (!lastExecTime.hasOwnProperty(cmd)) lastExecTime[cmd] = {};
            if (!lastExecTime[cmd].hasOwnProperty(msg.author.id)) lastExecTime[cmd][msg.author.id] = new Date().valueOf();
            else {
                var currentTime = Date.now();
                if (currentTime < lastExecTime[cmd][msg.author.id] + (cmd.cooldown * 1000)) {
                    bot.sendMessage(msg, "**" + msg.author.name + "**-senpai that command is currently on cooldown for **" + Math.round(((lastExecTime[cmd][msg.author.id] + cmd.cooldown * 1000) - currentTime) / 1000) + "** more seconds.", (err, sent) => {
                        bot.deleteMessage(sent, {
                            "wait": 10000
                        });
                    });
                    bot.deleteMessage(msg, {
                        "wait": 15000
                    });
                    return;
                }
                lastExecTime[cmd][msg.author.id] = currentTime;
            }
        }
        console.log(serverC("@" + msg.channel.server.name + ":") + channelC(" #" + msg.channel.name) + ": " + botC("@WishBot") + " - " + warningC(msgPrefix + "" + cmdTxt) + " was used by " + userC(msg.author.username));
        try {
            cmd.process(bot, msg, suffix, cmdIndex, cmdUsage);
            if (cmd.delete) bot.deleteMessage(msg);
        } catch (err) {
            bot.sendMessage(msg, "```" + err + "```");
            console.log(errorC(err));
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

function reload(bot, msg) {
    delete require.cache[require.resolve("./bot_modules/Cleverbot.js")];
    delete require.cache[require.resolve("./bot_modules/Utilities.js")];
    delete require.cache[require.resolve("./bot_modules/Misc.js")];
    delete require.cache[require.resolve("./bot_modules/Admin.js")];
    delete require.cache[require.resolve("./options/admins.json")];
    delete require.cache[require.resolve("./bot_modules/Mod.js")];
    delete require.cache[require.resolve("./bot_modules/Interactions.js")];
    delete require.cache[require.resolve("./bot_modules/WordPlay.js")];
    delete require.cache[require.resolve("./bot_modules/Defaults.js")];
    delete require.cache[require.resolve("./bot_modules/Search.js")];
    delete require.cache[require.resolve("./bot_modules/Management.js")];
    delete require.cache[require.resolve("./bot_modules/Database.js")];
    delete require.cache[require.resolve("./bot_modules/Ignored.js")];
    Cleverbot = require("./bot_modules/Cleverbot.js").Clever;
    chatbot = require("./bot_modules/Cleverbot.js").chatbot;
    utilities = require("./bot_modules/Utilities.js").utilities;
    misc = require("./bot_modules/Misc.js").misc;
    admin = require("./bot_modules/Admin.js").admin;
    admins = require("./options/admins.json").admins;
    mod = require("./bot_modules/Mod.js").mod;
    interactions = require("./bot_modules/Interactions.js").interactions;
    words = require("./bot_modules/WordPlay.js").words;
    defaults = require("./bot_modules/Defaults.js").defaults;
    searches = require("./bot_modules/Search.js").searches;
    management = require("./bot_modules/Management.js").management;
    db = require("./bot_modules/Database.js");
    ignoreDB = require("./bot_modules/Ignored.js");
    console.log(botC("@WishBot") + " - " + errorC("Reload All Modules") + " was used by " + userC(msg.author.username));
    bot.sendMessage(msg, "All modules reloaded.")
}