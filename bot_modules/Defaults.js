var prefix = require('./../options/options.json').prefix;
var alias = require('./../options/alias.json');
var admins = require('./../options/admins.json').admins;
var Cleverbot = require('./Cleverbot.js').Clever;
var chatbot = require('./Cleverbot.js').chatbot;
var utilities = require('./Utilities.js').utilities;
var misc = require('./Misc.js').misc;
var admin = require('./Admin.js').admin;
var mod = require('./Mod.js').mod;
var interactions = require('./Interactions.js').interactions;
var words = require('./WordPlay.js').words;
var defaults = require('./Defaults.js').defaults;
var searches = require('./Search.js').searches;
var management = require('./Management.js').management;
var custom = require('./Custom.js').custom;
var libVersion = require('./../node_modules/discord.js/package.json').version;
var botVersion = require('./../package.json').version;

var defaults = {
    "help": {
        usage: "",
        delete: true,
        cooldown: 30,
        type: "default",
        process: function(bot, msg, suffix) {
            if (Commands.hasOwnProperty(suffix)) {
                bot.sendMessage(msg, "__Command usage for **" + suffix + ":**__\n\n" + Commands[suffix].usage + "\n**Cooldown:** `" + Commands[suffix].cooldown + "s`")
            } else if (suffix.toLowerCase() === "mod") {
                var helpMsg = "__**Mod Commands:**__\n";
                helpMsg += "\n**Mod Utilities: **";
                helpMsg += Object.keys(mod).sort().map(cmd => "`" + cmd + "`").join(", ");
                helpMsg += "\n**Mod Management: **";
                helpMsg += Object.keys(management).sort().map(cmd => "`" + cmd + "`").join(", ");
                bot.sendMessage(msg, helpMsg);
            } else if (suffix.toLowerCase() === "admin") {
                var helpMsg = "__**Admin Commands:**__\n\n**Admin Utilities: **";
                helpMsg += Object.keys(admin).sort().map(cmd => "`" + cmd + "`").join(", ");
                bot.sendMessage(msg, helpMsg);
            } else {
                var helpMsg = "__**General Commands:**__\n";
                helpMsg += "\n**Cleverbot: **`chat`, `@" + bot.user.name + "`";
                helpMsg += "\n**Custom:** `chan`, `chan read`, `chan write`, `chan edit`, `chan remove`\n"
                helpMsg += "**Default: **";
                helpMsg += Object.keys(defaults).sort().map(cmd => "`" + cmd + "`").join(", ");
                helpMsg += "\n**Interactions: **";
                helpMsg += Object.keys(interactions).sort().map(cmd => "`" + cmd + "`").join(", ");
                helpMsg += "\n**Misc: **";
                helpMsg += Object.keys(misc).sort().map(cmd => "`" + cmd + "`").join(", ");
                helpMsg += "\n**Searches: **";
                helpMsg += Object.keys(searches).sort().map(cmd => "`" + cmd + "`").join(", ");
                helpMsg += "\n**Utilities: **";
                helpMsg += Object.keys(utilities).sort().map(cmd => "`" + cmd + "`").join(", ");
                helpMsg += "\n**Word Play: **";
                helpMsg += Object.keys(words).sort().map(cmd => "`" + cmd + "`").join(", ");
                helpMsg += "\n\nFor usage and info about these commands use `help [command]`\nTo View the Mod Commmands Help use `help mod`";
                bot.sendMessage(msg, helpMsg);
            }
        }
    },
    "alias": {
        usage: "Prints out a list of Command Aliases.",
        delete: true,
        cooldown: 10,
        type: "default",
        process: function(bot, msg) {
            var msgString = "The following are the current command aliases:\n```ruby\n";
            Object.keys(alias).sort().forEach(function(ali) {
                msgString += "\n" + alias[ali] + ": " + ali;
            });
            msgString += "```\n\n```ruby\n[command]: [command alias]```";
            bot.sendMessage(msg.author, msgString);
        }
    },
    "changelog": {
        usage: "Prints out the last 5 changes for this bot.",
        delete: true,
        cooldown: 10,
        type: "default",
        process: function(bot, msg) {
            bot.getChannelLogs("143904176613752832", 5, function(error, messages) {
                if (error) {
                    console.log("there was an error getting the logs");
                    return;
                } else {
                    var msgString = "__**Changelog**__\n\n";
                    for (i = 4; i >= 0; i--) {
                        msgString += "\n" + messages[i];
                        if (i != 0) {
                            msgString += "\n━━━━━━━━━━━━━━━━━━━";
                        }
                    }
                    bot.sendMessage(msg.author, msgString)
                }
            });
        }
    },
    "about": {
        usage: "Gives you basic information about this bot.",
        delete: true,
        cooldown: 30,
        type: "default",
        process: function(bot, msg) {
            var toSend = "```tex\n";
            toSend += "$ WishBot [" + bot.user.name + "] $\n\n";
            toSend += "Lib: {discordjs - v" + libVersion + "}\n";
            toSend += "Version: {v" + botVersion + "a}\n";
            toSend += "Creator: { M!sɥ }\n";
            toSend += "Default Prefix: {" + prefix + "}\n";
            toSend += "\n% Use -help for command info."
            toSend += "\n% Support Server: https://discord.gg/0lBiROCNVaDaE8rR";
            toSend += "\n% Source: https://github.com/hsiw/Wishbot";
            bot.sendMessage(msg, toSend + "```")
        }
    },
    "source": {
        usage: "Gives you a link to the source for this bot.",
        delete: true,
        cooldown: 30,
        type: "default",
        process: function(bot, msg) {
            bot.sendMessage(msg, "The source code for this bot may be found here:\n<https://github.com/hsiw/Wishbot>")
        }
    },
    "donate": {
        usage: "Gives you a link to donate to the development of this bot.",
        delete: true,
        cooldown: 30,
        type: "default",
        process: function(bot, msg) {
            bot.sendMessage(msg, "Because I work on the developement of this bot in my free time, please consider donating to the developement,\nhttps://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JCSVXZTUD7F5C");
        }
    },
    "toggle": {
        usage: "Toggles the currently enabled modules. Not entering a module type with send a message of the options to the message author. Requires the user to have the `manageRoles` premission.\n`toggle [module to toggle]`",
        delete: true,
        cooldown: 5,
        noToggle: true,
        type: "default",
        process: function(bot, msg, suffix) {
            suffix = suffix.toLowerCase();
            if ((msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1) && Commands.hasOwnProperty(suffix)) {
                if (Commands[suffix].noToggle) bot.sendMessage(msg, "I'm sorry, **" + msg.author.name + "**-senpai but that command is not togglable.")
                else Database.toggle(bot, msg, suffix);
            } else if ((msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1) && (suffix === "unflip" || suffix === "welcome")) Database.toggle(bot, msg, suffix)
            else bot.sendMessage(msg, "This command requires the `manageRoles` premission to be used, Sorry.")
        }
    },
    "uptime": {
        usage: "Prints out the bots estimated uptime.",
        delete: true,
        cooldown: 2,
        type: "default",
        process: function(bot, msg) {
            bot.sendMessage(msg, "```ruby\nUptime - " + Math.round((bot.uptime / 3600000) % 60) + "h : " + Math.round((bot.uptime / 60000) % 60) + "m : " + Math.round((bot.uptime / 1000) % 60) + "s```")
        }
    },
    "server": {
        usage: "Prints out a link to this bots help/testing server.",
        delete: true,
        cooldown: 20,
        type: "default",
        process: function(bot, msg) {
            bot.sendMessage(msg, "__**" + msg.author.username + "-senpai, heres a invite to my server:**__\nhttps://discord.gg/0lBiROCNVaDaE8rR");
        }
    },
    "invite": {
        usage: "Prints out a link to invite this bot to your server",
        delete: true,
        cooldown: 20,
        type: "default",
        process: function(bot, msg) {
            bot.sendMessage(msg, "__**" + msg.author.username + "-senpai, heres a link to invite me to your server:**__\nhttps://discordapp.com/oauth2/authorize?&client_id=161620224305528833&scope=bot&permissions=16886814");
        }
    },
    "prefix": {
        usage: "Prints out the current command prefix.",
        delete: true,
        cooldown: 20,
        noToggle: true,
        type: "default",
        process: function(bot, msg, suffix) {
            if (!suffix) {
                var msgPrefix;
                serverSettings.hasOwnProperty(msg.channel.server.id) && serverSettings[msg.channel.server.id].hasOwnProperty("Prefix") ? msgPrefix = serverSettings[msg.channel.server.id]["Prefix"] : msgPrefix = prefix;
                var msgArray = ["The current command prefix is: `" + msgPrefix + "`"];
                msgArray.push("\n To change this prefix use `prefix [new prefix]`");
                bot.sendMessage(msg, msgArray);
            } else {
                if (msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1) Database.changePrefix(bot, msg, suffix);
                else bot.sendMessage(msg, "This command requires the `manageRoles` premission to be used, Sorry.");
            }
        }
    },
    "featurerequest": {
        usage: "Sends a feature request to the maker of this bot\n`request [feature to request]`",
        delete: true,
        cooldown: 60,
        type: "default",
        process: function(bot, msg, suffix) {
            if (!suffix) return;
            bot.sendMessage(msg, "Your request for \"**" + suffix + "**\" was successfully sent, **" + msg.author.name + "**-senpai.")
            bot.sendMessage("142794318837579777", "__Requested on the server **" + msg.channel.server.name + "** by **" + msg.author.username + "**:__`" + msg.author.id + "`\n" + suffix);
        }
    },
    "ping": {
        cooldown: 5,
        usage: "Pings this bot, useful for checking if the bots working corrently.",
        type: "default",
        process: function(bot, msg) {
            bot.sendMessage(msg, "PONG!", function(error, message) {
                if (!error) bot.updateMessage(message, "PONG! | *" + (message.timestamp - msg.timestamp) + "*ms");
            })
        }
    }
}

exports.defaults = defaults;