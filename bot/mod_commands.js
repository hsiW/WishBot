var options = require("./options.json");
var games = require("./games.json").games;
var Discord = require("discord.js");

function correctUsage(cmd) {
	var msg = "Usage: " + options.command_prefix + "" + cmd + " " + mod_commands[cmd].usage;
	return msg;
}

var mod_commands = {
	"help": {
		description: "Sends a DM containing all of these mod_commands.",
		usage: "[command]",
		permLevel: 0,
		process: function (bot, msg, suffix)
		{
			if(mod_commands[suffix])
			{
				{
					bot.sendMessage(msg.author, correctUsage(suffix))
					bot.deleteMessage(msg);
				}
			}
			else
			{
				var msgArray = [];
				msgArray.push("**mod_commands: **");
				msgArray.push("```");
				Object.keys(mod_commands).forEach(function (cmd) {
					msgArray.push("" + options.mod_command_prefix + "" + cmd + ": " + mod_commands[cmd].description + "");
				});
				msgArray.push("```");
				bot.sendMessage(msg.author, msgArray);
				bot.deleteMessage(msg);
			}
		}
	},
	"servers":
	{
		usage: "[none]",
		description: "lists servers bot is connected to",
		process: function (bot, msg) {
			bot.sendMessage(msg.channel,bot.user+" is currently connected to the following servers:\n ```" +bot.servers+"```");
			bot.deleteMessage(msg);
		}
	},
	"channels":
	{
		usage: ["none"],
		description: "lists channels bot is connected to",
		process: function (bot, msg) {
			bot.sendMessage(msg.channel, bot.channels);
		}
	},
	"stats": {
		usage: "[none]",
		description: "outputs different about the bot",
		process: function (bot, msg, suffix,commandsProcessed,talked) {
			var seconds = Math.round((bot.uptime / 1000) % 60);
			var minutes = Math.round((bot.uptime / (1000 * 60)) % 60);
			var hours = Math.round((bot.uptime / (1000 * 60 * 60)) % 60);
			bot.sendMessage(msg, "**Info about "+bot.user+":** \n```Bot Uptime: " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds.\nConnected to "+bot.servers.length+" server(s) and "+bot.channels.length+" channel(s).\nDuring the current session "+commandsProcessed+" command(s) have been processed.\nTalked to "+talked+" time(s).```");
			bot.deleteMessage(msg);
		}
	},
	"say": {
		usage: "[message]",
		description: "bot says message",
		process: function (bot, msg, suffix) {
			bot.sendMessage(msg.channel, suffix);
			bot.deleteMessage(msg);
		}
	},
	"announce": {
		usage: "[message]",
		description: "bot says message with text to speech",
		process: function (bot, msg, suffix) {
			bot.sendMessage(msg.channel, suffix, {
				tts: true
			});
			bot.deleteMessage(msg);
		}
	},
	"join": {
		usage: "[invite]",
		description: "joins the server it's invited to",
		process: function (bot, msg, suffix) {
			console.log(bot.joinServer(suffix, function (error, server) {
				console.log("callback: " + arguments);
				if (error) {
					bot.sendMessage(msg.channel, "failed to join: " + error);
				} else {
					console.log("Joined server " + server);
					bot.sendMessage(msg.channel, "Successfully joined " + server);
				}
			}));
		}
	},
	"create": {
		usage: "[channel name]",
		description: "creates a new text channel with the given name.",
		process: function (bot, msg, suffix) {
			bot.createChannel(msg.channel.server, suffix, "text").then(function (channel) {
				bot.sendMessage(msg.channel, "created " + channel);
			}).catch(function (error) {
				bot.sendMessage(msg.channel, "failed to create channel: " + error);
			});
		}
	},
	"voice": {
		usage: "[channel name]",
		description: "creates a new voice channel with the give name.",
		process: function (bot, msg, suffix) {
			bot.createChannel(msg.channel.server, suffix, "voice").then(function (channel) {
				bot.sendMessage(msg.channel, "created " + channel.id);
				console.log("created " + channel);
			}).catch(function (error) {
				bot.sendMessage(msg.channel, "failed to create channel: " + error);
			});
		}
	},
	"topic": {
		usage: "[topic]",
		description: "Sets the topic for the channel. No topic removes the topic.",
		process: function (bot, msg, suffix) {
			bot.setChannelTopic(msg.channel, suffix);
			bot.reply(msg, "done!")
		}
	},
	"playing": {
		usage: "[game]",
		description: "allows you to set a game for Onee-chan to play. If nothing specified it will be random.",
		process: function (bot, msg, suffix) {
			if (suffix) {
				bot.setPlayingGame(suffix);
			}
			if (!suffix) {
				bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
			}
			bot.deleteMessage(msg);
		}
	},
	"stop": {
		usage: "[none]",
		description: "stops the bot",
		process: function (bot, msg, suffix) {
			if (msg.author.id === "87600987040120832") {
				bot.reply(msg, "I will be taking my leave.")
				bot.logout();
				console.log("Stopped bot.");
			} else {
				bot.reply(msg, "I CANNOT BE STOPPED BY THE LIKES OF YOU");
			}
			bot.deleteMessage(msg);
		}
	},
	"setname": {
		usage: "[name]",
		description: "Changes the bots username",
		process: function (bot, msg, suffix) {
			if (suffix) {
				bot.setUsername(suffix);
				console.log("Mod Command - Set Username to " + suffix);
			} else {
				bot.setUsername("Onee-chan");
				console.log("Mod Command - Set Username to Onee-chan");
			}
			bot.reply(msg, "done!")
		}
	},
	"remove": {
		usage: "[channel name]",
		description: "deletes the specified channel",
		process: function (bot, msg, suffix) {
			var channel = bot.channels.get("id", suffix);
			if (suffix.startsWith('[#')) {
				channel = bot.channels.get("id", suffix.substr(2, suffix.length - 3));
			}
			if (!channel) {
				var channels = bot.channels.getAll("name", suffix);
				if (channels.length > 1) {
					https: //github.com/chalda/DiscordBot/issues/new
						var response = "Multiple channels match, please use id:";
					for (var i = 0; i < channels.length; i++) {
						response += channels[i] + ": " + channels[i].id;
					}
					bot.sendMessage(msg.channel, response);
					return;
				} else if (channels.length == 1) {
					channel = channels[0];
				} else {
					bot.sendMessage(msg.channel, "Couldn't find channel " + suffix + " to delete!");
					return;
				}
			}
			bot.sendMessage(msg.channel, "deleting channel " + suffix + " at " + msg.author + "'s request");
			bot.deleteChannel(channel).then(function (channel) {
				console.log("deleted " + suffix + " at " + msg.author + "'s request");
			}).catch(function (error) {
				bot.sendMessage(msg.channel, "couldn't delete channel: " + error);
			});
		}
	},
	"delete": {
		usage: "[number of messages from 1 - 100]",
		description: "Deletes the specified number of messages from the channel",
		process: function (bot, msg, suffix)
		{
			if(suffix && /^\d+$/.test(suffix))
			{
				bot.getChannelLogs(msg.channel, 100, function(error,messages)
				{
					if(error)
					{
						console.log("there was an error getting the logs");
						return;
					}
					else {
						bot.startTyping(msg.channel);
						var deletes = parseInt(suffix, 10) + 1;
						console.log(deletes);
						var dones = 0;
						for (count of messages)
						{
							bot.deleteMessage(count);
							dones++;
							deletes--;
							console.log(dones);
							if(deletes == 0 || dones == 100)
							{
								console.log("Finished deleting "+deletes+" messages in "+msg.channel);
								bot.stopTyping(msg.channel);
								return;
							}
						}
						bot.stopTyping(msg.channel);
					}
				});
			}
			else
			{
					bot.reply(msg,"using the delete command requires a interger between 1-500")
			}
		}
	},
	/*,
	"eval": {
		usage: "[command]",
		description: 'Executes arbitrary javascript in the bot process.',
		process: function(bot,msg,suffix) {
				bot.sendMessage(msg.channel, eval(suffix,bot));
		}
	}*/
};

function rssfeed(bot, msg, url, count, full) {
	var FeedParser = require('feedparser');
	var feedparser = new FeedParser();
	var request = require('request');
	request(url).pipe(feedparser);
	feedparser.on('error', function (error) {
		bot.sendMessage(msg.channel, "failed reading feed: " + error);
	});
	var shown = 0;
	feedparser.on('readable', function () {
		var stream = this;
		shown += 1
		if (shown > count) {
			return;
		}
		var item = stream.read();
		bot.sendMessage(msg.channel, item.title + " - " + item.link, function () {
			if (full === true) {
				var text = htmlToText.fromString(item.description, {
					wordwrap: false,
					ignoreHref: true
				});
				bot.sendMessage(msg.channel, text);
			}
		});
		stream.alreadyRead = true;
	});
}
exports.mod_commands = mod_commands;
