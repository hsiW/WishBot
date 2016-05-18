var prefix = require("./../options/options.json").prefixes;
var request = require('request').defaults({
    encoding: null
});
var eightBall = require("./../lists/8ball.json").ball;
var math = require('mathjs');

var utilities = {
    "call": {
        usage: "Tells everyone you'd like a call",
        delete: true,
        cooldown: 10,
        type: "utilities",
        process: function(bot, msg) {
            if (msg.channel.permissionsOf(msg.author.id).json.mentionEveryone) bot.createMessage(msg.channel.id, {
                content: "☎ @everyone, **" + msg.author.username + "** would like to have a call! ☎",
                disableEveryone: false
            });
            else bot.createMessage(msg.channel.id, "☎ Everyone, **" + msg.author.username + "** would like to have a call! ☎");
        }
    },
    "letsplay": {
        usage: "Tells everyone you'd like to play a game. Can mention the game if one is mentioned\n`letsplay [game] or [none]`",
        delete: true,
        cooldown: 10,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (!suffix) suffix = "a game";
            if (msg.channel.permissionsOf(msg.author.id).json['mentionEveryone']) bot.createMessage(msg.channel.id, {
                content: "🎮 @everyone, **" + msg.author.username + "** would like to play " + suffix + "! 🎮",
                disableEveryone: false
            });
            else bot.createMessage(msg.channel.id, "🎮 Everyone, **" + msg.author.username + "** would like to play " + suffix + "! 🎮");
        }
    },
    "avatar": {
        usage: "Prints the avatar of the user mentioned or the message authors avatar if none mentioned.\n`avatar [user mention] or [none]`",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (msg.mentions.length === 1) {
                request("https://discordapp.com/api/users/" + msg.channel.guild.members.get(msg.mentions[0]).user.id + "/avatars/" + msg.channel.guild.members.get(msg.mentions[0]).user.avatar + ".jpg", function(err, response, buffer) {
                    bot.createMessage(msg.channel.id, "**" + msg.channel.guild.members.get(msg.mentions[0]).user.username + "'s** avatar is:", {
                        file: buffer,
                        name: msg.channel.guild.members.get(msg.mentions[0]).user.username + '.jpg'
                    });
                });
            } else {
                request("https://discordapp.com/api/users/" + msg.author.id + "/avatars/" + msg.author.avatar + ".jpg", function(err, response, buffer) {
                    bot.createMessage(msg.channel.id, "**" + msg.author.username + "'s** avatar is:", {
                        file: buffer,
                        name: msg.author.username + '.jpg'
                    });
                });
            }
        }
    },
    "servericon": {
        usage: "Prints the server icon of the current server",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg) {
            request("https://discordapp.com/api/guilds/" + msg.channel.guild.id + "/icons/" + msg.channel.guild.icon + ".jpg", function(err, response, buffer) {
                bot.createMessage(msg.channel.id, "**" + msg.channel.guild.name + "'s** icon is:", {
                    file: buffer,
                    name: 'servericon.jpg'
                });
            });
        }
    },
    "searchdiscrim": {
        usage: "Prints a list of users matching the mentioned discriminator\n`searchdiscrim [4 digit discriminator]`",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (suffix.length != 4) suffix = msg.author.discriminator;
            if (!/^\d+$/.test(suffix)) suffix = msg.author.discriminator;
            var usersCache = [];
            bot.users.forEach(user => {
                if (user.discriminator === suffix) usersCache.push(user)
            })
            if (usersCache.length < 1) var msgString = "```markdown\n### No Users Found: (" + suffix + ") ###";
            else {
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
    "channelinfo": {
        usage: "Outputs info about the current channel",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg) {
            var creationDate = new Date((msg.channel.id / 4194304) + 1420070400000);
            var toSend = "```ruby\n";
            toSend += "         Name: \"" + msg.channel.name + "\"";
            toSend += "\n           ID: " + msg.channel.id;
            toSend += "\nCreation Date: " + creationDate.toUTCString();
            toSend += "\n     Position: #" + msg.channel.position;
            toSend += "\n         Type: " + msg.channel.type;
            toSend += "\n```**Topic:** " + msg.channel.topic;
            bot.createMessage(msg.channel.id, toSend);
        }
    },
    "info": {
        usage: "Gives info on the user or a then mentioned user if one is mentioned\n`info [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            msg.mentions.length === 1 ? user = msg.channel.guild.members.get(msg.mentions[0]) : user = msg.channel.guild.members.get(msg.author.id);
            if (user) {
                var creationDate = new Date((user.id / 4194304) + 1420070400000);
                var toSend = "```ruby\n";
                toSend += "         Name: \"" + user.user.username + "\"";
                toSend += "\n     Nickname: \"" + user.nick + "\"";
                toSend += "\n      User ID: " + user.id;
                toSend += "\nDiscriminator: #" + user.user.discriminator;
                toSend += "\n       Status: " + user.status;
                if (user.game !== null) toSend += "\n      Playing: \'" + user.game.name + "\'";
                toSend += "\n    Join Date: " + new Date(user.joinedAt).toUTCString();
                toSend += "\nCreation Date: " + creationDate.toUTCString();
                toSend += "\n   Avatar URL: \n\"https://discordapp.com/api/users/" + user.id + "/avatars/" + user.user.avatar + ".jpg" + "\"```";
                bot.createMessage(msg.channel.id, toSend);
            } else {
                bot.createMessage(msg.channel.id, suffix + " is not a valid user.")
            }
        }
    },
    "serverinfo": {
        usage: "Gives info on the current server",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg) {
            var server = msg.channel.guild;
            var creationDate = new Date((server.id / 4194304) + 1420070400000);
            var toSend = "```ruby";
            toSend += "\n         Server: #" + server.name;
            toSend += "\n      Server ID: " + server.id;
            toSend += "\n          Owner: " + bot.users.get(server.ownerID).username + " #" + bot.users.get(server.ownerID).discriminator;
            toSend += "\nDefault Channel: #" + server.channels.get(server.id).name;
            toSend += "\n   Voice Region: " + server.region;
            toSend += "\n  Creation Date: " + creationDate.toUTCString();
            toSend += "\n      Join Date: " + new Date(server.joinedAt).toUTCString();
            toSend += "\n   Member Count: " + server.memberCount;
            toSend += "\n  Channel Count: " + server.channels.size;
            toSend += "\n       Shard ID: " + server.shard.id;
            toSend += "\nServer Icon URL: \n\"https://discordapp.com/api/guilds/" + msg.channel.guild.id + "/icons/" + msg.channel.guild.icon + ".jpg\"```";
            bot.createMessage(msg.channel.id, toSend);
        }
    },
    "strawpoll": {
        usage: "Creates a Strawpoll with the mentioned options\n`strawpoll [option1], [option2], ect`",
        delete: true,
        cooldown: 15,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (!suffix || suffix.split(",").length < 2) {
                bot.createMessage(msg.channel.id, "I can't create a strawpoll from that **" + msg.author.username + "**-senpai.");
            } else {
                var choices = suffix.split(",");
                request({
                    uri: "https://strawpoll.me/api/v2/polls",
                    method: "POST",
                    followAllRedirects: true,
                    maxRedirects: 10,
                    headers: {
                        "content-type": "application/json"
                    },
                    json: true,
                    body: {
                        "title": msg.author.username + "'s Poll",
                        "options": choices,
                        "multi": false
                    }
                }, (error, response, body) => {
                    if (!error && response.statusCode == 200) bot.createMessage(msg.channel.id, "**" + msg.author.username + "** created a **Strawpoll** - <http://strawpoll.me/" + body.id + "> 🎆");
                    else if (error) bot.createMessage(msg.channel.id, error);
                    else if (response.statusCode != 201) bot.createMessage(msg.channel.id, "Got status code " + response.statusCode);
                })
            }
        }
    },
    "roll": {
        usage: "Rolls a dice with 6 sides or more if a number is mentioned\n`[max value] or [none]`",
        delete: true,
        cooldown: 2,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var max = 6;
            if (suffix) max = suffix;
            bot.createMessage(msg.channel.id, "**" + msg.author.username + "** rolled a **" + (Math.floor(Math.random() * max) + 1) + "**! 🎲");
        }
    },
    "coinflip": {
        usage: "Flips a coin",
        delete: true,
        cooldown: 2,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var coinflip = Math.random() < 0.5 ? "Heads" : "Tails";
            bot.createMessage(msg.channel.id, "**" + msg.author.username + "**, I flipped a coin and got **" + coinflip + "**! ⚖");
        }
    },
    "pick": {
        usage: "Picks from the mentioned options\n`pick [option 1], [option 2], ect`",
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (!suffix || suffix.split(",").length < 2) {
                bot.createMessage(msg.channel.id, "I can't pick from that, **" + msg.author.username + "**-senpai.");
            } else {
                var choices = suffix.split(",");
                bot.createMessage(msg.channel.id, "**" + msg.author.username + "**, I picked **" + choices[Math.floor(Math.random() * (choices.length))] + "**! ✅");
            }
        }
    },
    "8ball": {
        usage: "A magical 8ball\n`8ball [questions]`",
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "**" + msg.author.username + "**-senpai the 8ball reads: **" + eightBall[Math.floor(Math.random() * (eightBall.length))] + "**")
        }
    },
    "id": {
        usage: "Gives the id of the mentioned user or the message sender if no one is mentioned\n`id [user mention] or [none]`",
        delete: true,
        cooldown: 2,
        type: "utilities",
        process: function(bot, msg, suffix) {
            msg.mentions.length === 1 ? user = msg.channel.guild.members.get(msg.mentions[0]) : user = msg.channel.guild.members.get(msg.author.id);
            bot.createMessage(msg.channel.id, "**" + user.user.username + "'s** User ID is `" + user.id + "`, **" + msg.author.username + "**-senpai.");
        }
    },
    "calculate": {
        usage: "Prints out the answer to the expression mentioned. Keep in mind * is used for multiplying. Cannot currently solve for values. Can also convert between units by doing:`[number]<current units> to <desired units>`\n`calculate [expression]`",
        cooldown: 10,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var answer = math.eval(suffix);
            bot.createMessage(msg.channel.id, "**" + msg.author.username + "** here is the answer to that calculation: ```xl\n" + answer + "```");
        }
    },
    "searchusers": {
        usage: "Prints a list of users matching the mentioned name\n`searchdiscrim [name]`",
        delete: true,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var nameRegex = new RegExp(suffix, "i");
            var usersCache = [];
            msg.channel.guild.members.forEach(user => {
                if (nameRegex.test(user.user.username)) usersCache.push(user.user);
                console.log(user.user.username);
            })
            if (usersCache.length < 1) var msgString = "```markdown\n### No Users Found: (" + suffix + ") ###";
            else {
                var msgString = "```markdown\n### Found These User(s): (" + suffix + ") ###";
                for (i = 0; i < usersCache.length; i++) {
                    if (i === 10) {
                        msgString += "\nAnd " + (usersCache.length - i) + " more users...";
                        break;
                    }
                    msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username + " #" + usersCache[i].discriminator;
                }
            }
            bot.createMessage(msg.channel.id, msgString + "```");
        }
    },
    "clean": {
        usage: "Cleans the mentioned number of this bots messages from the current channel.\n`delete [# from 1-100]`",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (/^\d+$/.test(suffix)) {
                if (!msg.channel.permissionsOf(bot.user.id).json['manageMesssages']) {
                    bot.getChannelMessages(msg.channel.id, 100).then(messages => {
                        var toDelete = parseInt(suffix, 10)
                        var dones = 0;
                        for (i = 0; i <= 100; i++) {
                            if (toDelete <= 0 || i === 100) {
                                bot.createMessage(msg.channel.id, "Finished cleaning **" + dones + "** message(s) in <#" + msg.channel.id + ">.")
                                return;
                            }
                            if (messages[i].author.id === bot.user.id) {
                                bot.deleteMessage(msg.channel.id, messages[i].id).catch(err => errorC(err.stack));
                                dones++;
                                toDelete--;
                            }
                        }
                    }).catch(err => console.log(errorC(err.stack)));
                } else bot.purgeChannel(msg.channel.id, parseInt(suffix), message => message.author.id === bot.user.id).catch(err => errorC(err));
            } else bot.createMessage(msg.channel.id, "Using the clean command requires a number, **" + msg.author.username + "**-senpai.");
        }
    }
};
exports.utilities = utilities;