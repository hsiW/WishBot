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
var custom = require('./Custom.js').custom;
var libVersion = require('./../node_modules/eris/package.json').version;
var botVersion = require('./../package.json').version;

var defaults = {
    "help": {
        usage: "",
        delete: true,
        cooldown: 30,
        type: "default",
        process: function(bot, msg, suffix) {
            if (Commands.hasOwnProperty(suffix)) {
                bot.createMessage(msg.channel.id, "__Command usage for **" + suffix + ":**__\n\n" + Commands[suffix].usage + "\n**Cooldown:** `" + Commands[suffix].cooldown + "s`")
            } else if (suffix.toLowerCase() === "mod") {
                var helpMsg = "__**Mod Commands:**__\n";
                helpMsg += "\n**Mod Utilities: **";
                helpMsg += Object.keys(mod).sort().map(cmd => "`" + cmd + "`").join(", ");
                bot.createMessage(msg.channel.id, helpMsg);
            } else if (suffix.toLowerCase() === "admin") {
                var helpMsg = "__**Admin Commands:**__\n\n**Admin Utilities: **";
                helpMsg += Object.keys(admin).sort().map(cmd => "`" + cmd + "`").join(", ");
                bot.createMessage(msg.channel.id, helpMsg);
            } else {
                var helpMsg = "__**General Commands:**__\n";
                helpMsg += "\n**Cleverbot: **`chat`, `@" + bot.user.username + "`";
                helpMsg += "\n**Chan's:** `chan`, `chan read`, `chan write`, `chan edit`, `chan delete`\n"
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
                bot.createMessage(msg.channel.id, helpMsg);
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
            bot.getDMChannel(msg.author.id).then(privateChannel => bot.createMessage(privateChannel.id, msgString)).catch(err => console.log(errorC(err)));
        }
    },
    "changelog": {
        usage: "Prints out the last 5 changes for this bot.",
        delete: true,
        cooldown: 10,
        type: "default",
        process: function(bot, msg) {
            bot.getChannelMessages("143904176613752832", 5).then(messages => {
                var msgString = "__**Changelog**__\n";
                messages.forEach(index => {
                    msgString += "\n\n" + index.content;
                });
                bot.getDMChannel(msg.author.id).then(privateChannel => bot.createMessage(privateChannel.id, msgString))
            }).catch(err => console.log(errorC(err)));
        }
    },
    "about": {
        usage: "Gives you basic information about this bot.",
        delete: true,
        cooldown: 30,
        type: "default",
        process: function(bot, msg) {
            var toSend = "```tex\n";
            toSend += "$ WishBot [" + bot.user.username + "] $";
            toSend += "\n\nLib: {Eris - v" + libVersion + "}";
            toSend += "\nVersion: {v" + botVersion + "a}";
            toSend += "\nCreator: { M!sɥ }";
            toSend += "\nDefault Prefix: {" + prefix + "}";
            toSend += "\n\n% Use -help for command info."
            toSend += "\n% Support Server: https://discord.gg/0lBiROCNVaDaE8rR";
            toSend += "\n% Source: https://github.com/hsiw/Wishbot";
            bot.createMessage(msg.channel.id, toSend + "```")
        }
    },
    "source": {
        usage: "Gives you a link to the source for this bot.",
        delete: true,
        cooldown: 30,
        type: "default",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "The source code for this bot may be found here:\n<https://github.com/hsiw/Wishbot>");
        }
    },
    "donate": {
        usage: "Gives you a link to donate to the development of this bot.",
        delete: true,
        cooldown: 30,
        type: "default",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "Because I work on the developement of this bot in my free time, please consider donating to the developement,\nhttps://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JCSVXZTUD7F5C");
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
            if ((msg.channel.permissionsOf(msg.author.id).json['manageRoles'] || admins.indexOf(msg.author.id) > -1) && Commands.hasOwnProperty(suffix)) {
                if (Commands[suffix].noToggle) bot.createMessage(msg.channel.id, "I'm sorry, **" + msg.author.name + "**-senpai but that command is not togglable.")
                else Database.toggle(bot, msg, suffix);
            } else if ((msg.channel.permissionsOf(msg.author.id).json['manageRoles'] || admins.indexOf(msg.author.id) > -1) && (suffix === "unflip" || suffix === "welcome")) Database.toggle(bot, msg, suffix)
            else if ((msg.channel.permissionsOf(msg.author.id).json['manageRoles'] || admins.indexOf(msg.author.id) > -1) && !(Commands.hasOwnProperty(suffix))) {
                bot.createMessage(msg.channel.id, "Thats not a valid toggle, please use `welcome`, `unflip`, or any command name.")
            } else if (!(msg.channel.permissionsOf(msg.author.id).json['manageRoles'] || admins.indexOf(msg.author.id) > -1)) {
                bot.createMessage(msg.channel.id, "That command requires the `manageRoles` permission, sorry!")
            }
        }
    },
    "uptime": {
        usage: "Prints out the bots estimated uptime.",
        delete: true,
        cooldown: 2,
        type: "default",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "```ruby\nUptime - " + Math.round((bot.uptime / 3600000) % 60) + "h : " + Math.round((bot.uptime / 60000) % 60) + "m : " + Math.round((bot.uptime / 1000) % 60) + "s```")
        }
    },
    "server": {
        usage: "Prints out a link to this bots help/testing server.",
        delete: true,
        cooldown: 20,
        type: "default",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "__**" + msg.author.username + "-senpai, heres a invite to my server:**__\nhttps://discord.gg/0lBiROCNVaGw5Eqk");
        }
    },
    "invite": {
        usage: "Prints out a link to invite this bot to your server",
        delete: true,
        cooldown: 20,
        type: "default",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "__**" + msg.author.username + "-senpai, heres a link to invite me to your server:**__\nhttps://discordapp.com/oauth2/authorize?&client_id=161620224305528833&scope=bot&permissions=8");
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
                serverSettings.hasOwnProperty(msg.channel.guild.id) && serverSettings[msg.channel.guild.id].hasOwnProperty("Prefix") ? msgPrefix = serverSettings[msg.channel.guild.id]["Prefix"] : msgPrefix = prefix;
                var msgString = "The current command prefix is: `" + msgPrefix + "`";
                msgString += "\n\n To change this prefix use `prefix [new prefix]`";
                bot.createMessage(msg.channel.id, msgString);
            } else {
                if (msg.channel.permissionsOf(msg.author.id).json['manageRoles'] || admins.indexOf(msg.author.id) > -1) Database.changePrefix(bot, msg, suffix);
                else bot.createMessage(msg.channel.id, "This command requires the `manageRoles` premission to be used, Sorry.");
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
            bot.createMessage(msg.channel.id, "Your request for \"**" + suffix + "**\" was successfully sent, **" + msg.author.name + "**-senpai.")
            bot.createMessage("142794318837579777", "__Requested on the server **" + msg.channel.guild.name + "** by **" + msg.author.username + "**:__`" + msg.author.id + "`\n" + suffix);
        }
    },
    "ping": {
        cooldown: 5,
        usage: "Pings this bot, useful for checking if the bots working corrently.",
        type: "default",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "PONG!").then(message => {
                bot.editMessage(msg.channel.id, message.id, "PONG! | *" + ((new Date(message.timestamp)) - (new Date(msg.timestamp))) + "*ms").catch(err => console.log(errorC(err)))
            }).catch(err => console.log(errorC(err)))
        }
    }
}

exports.defaults = defaults;