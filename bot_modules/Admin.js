var games = require("./../lists/games.json").games;
var db = require("./Database.js");
var b64img = require('request').defaults({
    encoding: null
});
var Ignored = require('./Ignored.js');

var admin = {
    "say": {
        usage: "Makes the bot say the mentioned message",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg, suffix);
        }
    },
    "message": {
        usage: "Secret",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            var postSuffix = suffix.substr(suffix.indexOf(' ') + 1);
            suffix = suffix.split(" ")[0];
            bot.sendMessage(suffix, "Message from **" + msg.author.name + "**: " + postSuffix + " - I'm a Bot, Bleep Bloop. If you'd like to message this user directly please join my bot server by doing `server`")
                .then(bot.sendMessage(msg, "Successfully sent message to `" + suffix + "`"));
        }
    },
    "playing": {
        usage: "Sets the currently playing game to the mentioned word or to a random game if none mentioned\n`playing [game] or [none]",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            if (suffix) {
                bot.setPlayingGame(suffix);
            } else {
                bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
            }
        }
    },
    "logout": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg, "Logging Out").then(bot.logout());
        }
    },
    "restart": {
        usage: "Restarts the bot if running on heroku",
        delete: true,
        type: "admin",
        process: function(bot, msg) {
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
            bot.sendMessage(msg, "__**" + bot.user.name + " is connected to the following large servers:**__\n```sql\n" + bot.servers.filter(s => s.members.length >= 250).map(s => s.name + ": " + s.members.length).join("\n") + "```");
        }
    },
    "searchallusers": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            var nameRegex = new RegExp(suffix, "i");
            var usersCache = bot.users.getAll('name', nameRegex);
            var msgString = "```markdown\n### Found These User(s): ###";
            for (i = 0; i < usersCache.length; i++) {
                if (i === 10) {
                    msgString += "And " + (usersCache.length - i) + " more users...";
                    break;
                }
                msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username + " #" + usersCache[i].discriminator;
            }

            bot.sendMessage(msg, msgString + "```");
        }
    },
    "searchservers": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            var nameRegex = new RegExp(suffix, "i");
            var serverCache = bot.servers.getAll('name', nameRegex);
            var msgString = ["```markdown\n### Found These servers(s): ###"];
            for (i = 0; i < serverCache.length; i++) {
                if (i === 25) {
                    msgString += "And " + (serverCache.length - i) + " more servers...";
                    break;
                }
                var bots = serverCache[i].members.getAll('bot', true).length;
                var people = serverCache[i].members.length - bots;
                msgString += "\n[" + (i + 1) + "]: " + serverCache[i].name + " - " + bots + "/" +people+" "+((bots/people)*100).toFixed(2)+"%";
            }

            bot.sendMessage(msg, msgString+"```");
        }
    },
    "leaveserver": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            bot.leaveServer(bot.servers.get('id', suffix));
        }
    },
    "usage": {
        usage: "Displays command usage statistics of the current session",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix, cmdIndex, cmdUsage) {
            var msgArray = ["__**Command Usage:**__```ruby"]
            cmdIndex.forEach(function(cmd, index) {
                msgArray.push(cmdIndex[index] + " : " + cmdUsage[index]);
            })
            msgArray.push("```")
            bot.sendMessage(msg, msgArray)
        }
    },
    "setavatar": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            b64img.get(suffix, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                    bot.setAvatar(data);
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
            if (msg.mentions.length === 1) {
                userID = msg.mentions[0].id;
            } else if (bot.users.get('id', suffix)) {
                userID = suffix;
            } else {
                bot.sendMessage(msg, "Cannot add " + suffix + " to ignore.")
            }
            console.log("GOT TO COMMAND")
            Ignored.add(bot, msg, userID);
        }
    },
    "unignore": {
        usage: "",
        delete: true,
        type: "admin",
        process: function(bot, msg, suffix) {
            var userID;
            if (msg.mentions.length === 1) {
                userID = msg.mentions[0].id;
            } else if (bot.users.get('id', suffix)) {
                userID = suffix;
            } else {
                bot.sendMessage(msg, "Cannot add " + suffix + " to ignore.")
            }
            Ignored.remove(bot, msg, userID);
        }
    },
    "eval": {
        usage: "",
        type: "admin",
        process: function(bot, msg, suffix) {
            var result;
            try {
                result = eval("try{" + suffix + "}catch(err){console.log(\" ERROR \"+err);bot.sendMessage(msg, \"```\"+err+\"```\");}");
            } catch (e) {
                console.log("ERROR" + e);
                bot.sendMessage(msg, "```" + e + "```");
            }
            if (result && typeof result !== "object") {
                bot.sendMessage(msg, result);
            }
        }
    }
}

exports.admin = admin;