var prefix = require("./../options/options.json").prefixes;
var request = require('request');
var eightBall = require("./../lists/8ball.json").ball;
var math = require('mathjs');

function getUser(bot, msg, suffix) {
    var nameRegex = new RegExp(suffix, "i");
    return usersCache = msg.channel.server.members.get('name', nameRegex);
}

var utilities = {
    "call": {
        usage: "Tells everyone you'd like a call",
        delete: true,
        cooldown: 10,
        type: "utilities",
        process: function(bot, msg) {
            if (msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) bot.sendMessage(msg, ":phone: @everyone, **" + msg.author.name + "** would like to have a call! :phone:");
            else bot.sendMessage(msg, ":phone: **Everyone**, **" + msg.author.name + "** would like to have a call! :phone:");
        }
    },
    "letsplay": {
        usage: "Tells everyone you'd like to play a game. Can mention the game if one is mentioned\n`letsplay [game] or [none]`",
        delete: true,
        cooldown: 10,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (suffix.indexOf("everyone") > 0) suffix = "";
            if (suffix && msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) bot.sendMessage(msg, ":video_game: @everyone, **" + msg.author.name + "** would like to play " + suffix + "! :video_game:");
            else if (suffix && !msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) bot.sendMessage(msg, ":video_game: **Everyone**, **" + msg.author.name + "** would like to play " + suffix + "! :video_game:");
            else if (!suffix && msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) bot.sendMessage(msg, ":video_game: @everyone, **" + msg.author.name + "** would like to play a game! :video_game:");
            else if (!suffix && !msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) bot.sendMessage(msg, ":video_game: **Everyone**, **" + msg.author.name + "** would like to play a game! :video_game:");
        }
    },
    "avatar": {
        usage: "Prints the avatar of the user mentioned or the message authors avatar if none mentioned.\n`avatar [user mention] or [none]`",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) bot.sendFile(msg, suffix.avatarURL, null, "**" + suffix.username + "'s** avatar is ");
                else bot.sendFile(msg, msg.author.avatarURL, null, "**" + msg.sender.name + "'s** avatar is ");
            } else bot.sendFile(msg, msg.author.avatarURL, null, "**" + msg.sender.name + "'s** avatar is ");
        }
    },
    "servericon": {
        usage: "Prints the server icon of the current server",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg) {
            bot.sendFile(msg, msg.channel.server.iconURL, null, "**" + msg.channel.server.name + "'s** icon is ");
        }
    },
    "searchdiscrim": {
        usage: "Prints a list of users matching the mentioned discriminator\n`searchdiscrim [4 digit discriminator]`",
        delete: true,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var usersCache = bot.users.getAll('discriminator', suffix);
            var msgString = "```markdown\n### Found These User(s): ###";
            for (i = 0; i < usersCache.length; i++) {
                if (i === 10) {
                    msgString += "\nAnd " + (usersCache.length - i) + " more users...";
                    break;
                }
                msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username;
            }
            bot.sendMessage(msg, msgString + "```");
        }
    },
    "channelinfo": {
        usage: "Outputs info about the current channel",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg) {
            var toSend = "```ruby\n";
            toSend += "Name: \"" + msg.channel.name + "\"";
            toSend += "\nID: " + msg.channel.id;
            toSend += "\nPosition: #" + msg.channel.position;
            toSend += "\nType: " + msg.channel.type;
            toSend += "\n```**Topic:** " + msg.channel.topic;
            bot.sendMessage(msg, toSend);
        }
    },
    "info": {
        usage: "Gives info on the current server or a user if one is mentioned\n`info [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) {
                    var joinedOn = new Date(msg.channel.server.detailsOfUser(suffix).joinedAt);
                    var creationDate = new Date((suffix.id / 4194304) + 1420070400000);
                    var roles = msg.channel.server.rolesOfUser(suffix.id).map(function(role) {
                        return role.name;
                    });
                    roles = roles.join(", ").replace("@", "");
                    var toSend = "```ruby\n";
                    toSend += "Name: \"" + suffix.username + "\"";
                    toSend += "\nID: " + suffix.id;
                    toSend += "\nDiscriminator: #" + suffix.discriminator;
                    toSend += "\nStatus: " + suffix.status;
                    if (suffix.game !== null) toSend += "\nPlaying: \'" + suffix.game.name + "\'";
                    toSend += "\nJoin Date: " + joinedOn.toUTCString();
                    toSend += "\nCreation Date: " + creationDate.toUTCString();
                    if (roles.length <= 1000) toSend += "\nRoles: \"" + roles + "\"";
                    toSend += "\nAvatar:```";
                    bot.sendFile(msg, suffix.avatarURL, null, toSend);
                } else {
                    bot.sendMessage(msg, suffix + " is not a valid user.", function(error, sentMessage) {
                        bot.deleteMessage(sentMessage, {
                            "wait": 5000
                        });
                    });
                }
            } else {
                var creationDate = new Date(msg.channel.server.detailsOfUser(msg.channel.server.owner).joinedAt);
                var toSend = "```ruby\n";
                toSend += "Server: #" + msg.channel.server.name;
                toSend += "\nOwner: \"" + msg.channel.server.owner.name + "\"";
                toSend += "\nDefault Channel: #" + msg.channel.server.defaultChannel.name;
                toSend += "\nVoice Region: " + msg.channel.server.region;
                toSend += "\nCreation Date: " + creationDate.toUTCString();
                toSend += "\nMember Count: " + msg.channel.server.memberCount;
                toSend += "\nChannel Count: " + msg.channel.server.channels.length;
                toSend += "\nServer ID: " + msg.channel.server.id;
                toSend += "\nServer Icon:```";
                bot.sendFile(msg, msg.channel.server.iconURL, null, toSend);
            }
        }
    },
    "strawpoll": {
        usage: "Creates a Strawpoll with the mentioned options\n`strawpoll [option1], [option2], ect`",
        delete: true,
        cooldown: 15,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (!suffix || suffix.split(",").length < 2) {
                bot.sendMessage(msg, "I can't create a strawpoll from that **" + msg.author.username + "**-senpai.", function(error, sentMessage) {
                    bot.deleteMessage(sentMessage, {
                        "wait": 5000
                    });
                });
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
                        "title": msg.author.name + "'s Poll",
                        "options": choices,
                        "multi": false
                    }
                }, (error, response, body) => {
                    if (!error && response.statusCode == 200) bot.sendMessage(msg, "**" + msg.author.name + "** created a **Strawpoll** - <http://strawpoll.me/" + body.id + "> 🎆");
                    else if (error) bot.sendMessage(msg, error);
                    else if (response.statusCode != 201) bot.sendMessage(msg, "Got status code " + response.statusCode);
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
            bot.sendMessage(msg, "**" + msg.author.username + "** rolled a **" + (Math.floor(Math.random() * max) + 1) + "**! 🎲");
        }
    },
    "coinflip": {
        usage: "Flips a coin",
        delete: true,
        cooldown: 2,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var coinflip = Math.random() < 0.5 ? "Heads" : "Tails";
            bot.sendMessage(msg, "**" + msg.author.username + "**, I flipped a coin and got **" + coinflip + "**! 🔔");
        }
    },
    "pick": {
        usage: "Picks from the mentioned options\n`pick [option 1], [option 2], ect`",
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (!suffix || suffix.split(",").length < 2) {
                bot.sendMessage(msg, "I can't pick from that, **" + msg.author.username + "**-senpai.", function(error, sentMessage) {
                    bot.deleteMessage(sentMessage, {
                        "wait": 5000
                    });
                });
            } else {
                var choices = suffix.split(",");
                bot.sendMessage(msg, "**" + msg.author.username + "**, I picked **" + choices[Math.floor(Math.random() * (choices.length))] + "**! ✅");
            }
        }
    },
    "8ball": {
        usage: "A magical 8ball\n`8ball [questions]`",
        cooldown: 2,
        type: "utilities",
        process: function(bot, msg) {
            bot.sendMessage(msg, "**" + msg.author.name + "**-senpai the 8ball reads: **" + eightBall[Math.floor(Math.random() * (eightBall.length))] + "**")
        }
    },
    "id": {
        usage: "Gives the id of the mentioned user or the message sender if no one is mentioned\n`id [user mention] or [none]`",
        delete: true,
        cooldown: 2,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) bot.sendMessage(msg, "**" + suffix.username + "'s** User ID is `" + suffix.id + "`, **" + msg.author.username + "**-senpai.");
                else bot.sendMessage(msg, "Your id is `" + msg.author.id + "`, **" + msg.author.username + "**-senpai.");
            } else {
                bot.sendMessage(msg, "Your id is `" + msg.author.id + "`, **" + msg.author.username + "**-senpai.");
            }
        }
    },
    "calculate": {
        usage: "Prints out the answer to the expression mentioned. Keep in mind * is used for multiplying. Cannot currently solve for values. Can also convert between units by doing:`[number]<current units> to <desired units>`\n`calculate [expression]`",
        cooldown: 10,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var answer = math.eval(suffix);
            bot.sendMessage(msg, "**" + msg.author.name + "** here is the answer to that calculation: ```" + answer + "```");
        }
    },
    "searchusers": {
        usage: "",
        delete: true,
        type: "utilities",
        process: function(bot, msg, suffix) {
            var nameRegex = new RegExp(suffix, "i");
            var usersCache = msg.channel.server.members.getAll('name', nameRegex);
            var msgString = "```markdown\n### Found These User(s): ###";
            for (i = 0; i < usersCache.length; i++) {
                if (i === 10) {
                    msgString += "\nAnd " + (usersCache.length - i) + " more users...";
                    break;
                }
                msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username + " #" + usersCache[i].discriminator;
            }
            bot.sendMessage(msg, msgString + "```");
        }
    },
    "clean": {
        usage: "Cleans the mentioned number of this bots messages from the current channel.\n`delete [# from 1-100]`",
        delete: true,
        cooldown: 5,
        type: "utilities",
        process: function(bot, msg, suffix) {
            if (/^\d+$/.test(suffix)) {
                bot.getChannelLogs(msg.channel, 100, function(error, messages) {
                    if (error) console.log(errorC("There was an error getting logs for the clean command."));
                    else {
                        var toDelete = parseInt(suffix, 10)
                        var dones = 0;
                        for (i = 0; i <= 100; i++) {
                            if (toDelete <= 0 || i === 100) {
                                bot.sendMessage(msg, "Finished cleaning **" + dones + "** message(s) in " + msg.channel + ".", function(error, sentMessage) {
                                    bot.deleteMessage(sentMessage, {
                                        "wait": 5000
                                    })
                                });
                                return;
                            }
                            if (messages[i].author.id === bot.user.id) {
                                bot.deleteMessage(messages[i]);
                                dones++;
                                toDelete--;
                            }
                        }
                    }
                });
            } else {
                bot.sendMessage(msg, "Using the clean command requires a number between 1-100, **" + msg.author.username + "**-senpai.", function(error, sentMessage) {
                    bot.deleteMessage(sentMessage, {
                        "wait": 5000
                    })
                })
            }
        }
    }
};
exports.utilities = utilities;