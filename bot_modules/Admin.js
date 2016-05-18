var games = require("./../lists/games.json").games;
var db = require("./Database.js");
var request = require('request').defaults({
    encoding: null
});
var Ignored = require('./Ignored.js');
var os = require("os");

var admin = {
    "say": {
        usage: "Makes the bot say the mentioned message",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            bot.createMessage(msg.channel.id, suffix);
        }
    },
    "message": {
        usage: "Secret",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            var postSuffix = suffix.substr(suffix.indexOf(' ') + 1);
            suffix = suffix.split(" ")[0];
            bot.getDMChannel(suffix).then(privateChannel =>
                bot.createMessage(privateChannel.id, "Message from **" + msg.author.username + "**: \n\"" + postSuffix + "\"\n - I'm a Bot, Bleep Bloop. If you'd like to message this user directly please join my bot server by doing `server`")
            );
        }
    },
    "playing": {
        usage: "Sets the currently playing game to the mentioned word or to a random game if none mentioned\n`playing [game] or [none]",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            if (suffix) bot.editGame({
                name: suffix
            })
            else bot.editGame(null);
            bot.createMessage(msg.channel.id, '🆗');
        }
    },
    "restart": {
        usage: "Restarts the bot if running on heroku",
        delete: true,
        type: "admin",
        process: function(bot, msg) {
            bot.disconnect()
            setTimeout(function() {
                console.log("@WishBot - Restarted bot.");
                process.exit(0);
            }, 1000);
        }
    },
    "servers": {
        usage: "Lists the large servers this bot is connected to",
        delete: true,
        type: "admin",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "__**" + bot.user.username + " is connected to the following large threshold servers:**__\n```xl\n" + bot.guilds.filter(s => s.members.size >= 250).map(s => s.name + ": " + s.members.size).join("\n") + "```");
        }
    },
    "searchallusers": {
        usage: "Prints a list of users matching the mentioned name\n`searchdiscrim [name]`",
        delete: true,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var nameRegex = new RegExp(suffix, "i");
            var usersCache = [];
            bot.users.forEach(user => {
                if (nameRegex.test(user.username)) usersCache.push(user);
            })
            if (usersCache.length < 1) {
                var msgString = "```markdown\n### No Users Found: (" + suffix + ") ###";
            } else {
                var msgString = "```markdown\n### Found These User(s): (" + suffix + ") ###";
                for (i = 0; i < usersCache.length; i++) {
                    if (i === 10) {
                        msgString += "\nAnd " + (usersCache.length - i) + " more users...";
                        break;
                    }
                    msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username;
                }
            }
            bot.createMessage(msg.channel.id, msgString + "```");
        }
    },
    "searchservers": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            var nameRegex = new RegExp(suffix, "i");
            var serverCache = [];
            bot.guilds.forEach(guild => {
                if (nameRegex.test(guild.name)) serverCache.push(guild);
            })
            if (serverCache.length < 1) {
                bot.createMessage(msg.channel.id, "```markdown\n### No Servers Found ###```")
                return;
            }
            var msgString = ["```markdown\n### Found These servers(s): ###"];
            for (i = 0; i < serverCache.length; i++) {
                if (i === 25) {
                    msgString += "\nAnd " + (serverCache.length - i) + " more servers...";
                    break;
                }
                var bots = serverCache[i].members.filter(user => user.user.bot).length;
                var people = serverCache[i].members.size - bots;
                msgString += "\n[" + (i + 1) + "]: " + serverCache[i].name + " - " + bots + "/" + people + " " + ((bots / serverCache[i].members.size) * 100).toFixed(2) + "%";
            }

            bot.createMessage(msg.channel.id, msgString + "```");
        }
    },
    "usage": {
        usage: "Displays command usage statistics of the current session",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix, cmdIndex, cmdUsage) {
            var msgString = "__**Command Usage:**__```ruby";
            cmdIndex.forEach(function(cmd, index) {
                msgString += "\n" + cmdIndex[index] + " : " + cmdUsage[index];
            })
            msgString += "```";
            bot.createMessage(msg.channel.id, msgString)
        }
    },
    "setavatar": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            request.get(suffix, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = "data:" + response.headers["content-type"] + ";base64," + body.toString('base64');
                    bot.editSelf({
                        avatar: data
                    }).then(bot.createMessage(msg.channel.id, "Success")).catch(err => bot.createMessage(msg.channel.id, err));
                }
            });
        }
    },
    "ignore": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            var userID;
            if (msg.mentions.length === 1) userID = msg.mentions[0];
            else if (bot.users.get('id', suffix)) userID = suffix;
            else {
                bot.createMessage(msg.channel.id, "Cannot add " + suffix + " to ignore.")
                return;
            }
            Ignored.add(bot, msg, userID);
        }
    },
    "unignore": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            var userID;
            if (msg.mentions.length === 1) userID = msg.mentions[0].id;
            else if (bot.users.get('id', suffix)) userID = suffix;
            else {
                bot.createMessage(msg.channel.id, "Cannot add " + suffix + " to ignore.")
                return;
            }
            Ignored.remove(bot, msg, userID);
        }
    },
    "checkinactive": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg) {
            Database.checkInactivity(bot);
            bot.createMessage(msg.channel.id, "🆗");
        }
    },
    "inactiveleave": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg) {
            Database.removeInactive(bot, msg);
        }
    },
    "eval": {
        usage: "",
        type: "admin",
        process: function(bot, msg, suffix) {
            var result;
            try {
                result = eval("try{" + suffix + "}catch(err){console.log(\" ERROR \"+err);bot.createMessage(msg.channel.id, \"```\"+err+\"```\");}");
            } catch (e) {
                console.log("ERROR" + e);
                bot.createMessage(msg.channel.id, "```" + e + "```");
            }
            if (result && typeof result !== "object") bot.createMessage(msg.channel.id, result);
            else if (result && typeof result === "object") bot.createMessage(msg.channel.id, "```xl\n" + result + "```")
        }
    }
}

exports.admin = admin;