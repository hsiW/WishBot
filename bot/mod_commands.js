var options = require("./options.json");
var games = require("./games.json").games;
var Discord = require("discord.js");

var chalk = require("chalk");
var c = new chalk.constructor({enabled: true});

var channelC = c.green.bold;
var userC = c.cyan.bold;
var warningC = c.yellow.bold;
var errorC = c.red.bold;
var botC = c.magenta.bold;

function correctUsage(cmd) {
	var msg = "Usage: " + options.command_prefix + "" + cmd + " " + mod_commands[cmd].usage;
	return msg;
}

var mod_commands = {
	"help":
	{
		description: "Sends a DM containing all of these mod_commands.",
		usage: "[command]",
  	delete: false,
		permLevel: 0,
		process: function (bot, msg, suffix)
		{
			if (mod_commands[suffix])
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
				Object.keys(mod_commands)
					.forEach(function (cmd)
					{
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
  	delete: false,
		process: function (bot, msg)
		{
			bot.sendMessage(msg.channel, bot.user + " is currently connected to the following servers:\n ```" + bot.servers + "```");
			bot.deleteMessage(msg);
		}
	},
	"stats":
	{
		usage: "[none]",
		description: "outputs different about the bot",
  	delete: false,
		process: function (bot, msg, suffix, commandsProcessed, talked)
		{
			var seconds = Math.round((bot.uptime / 1000) % 60);
			var minutes = Math.round((bot.uptime / (1000 * 60)) % 60);
			var hours = Math.round((bot.uptime / (1000 * 60 * 60)) % 60);
			var statArray = []
			statArray.push("**Info about " + bot.user + "**");
			statArray.push("```Bot Uptime: " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds.");
			statArray.push("Currently connected to " + bot.servers.length + " server(s) and " + bot.channels.length + " channel(s)");
			statArray.push("During the current session " + commandsProcessed + " command(s) have been processed.");
			statArray.push(bot.user.username + "has been talked to " + talked + " time(s)");
			statArray.push("Currently using " + (Math.round(process.memoryUsage()
				.rss / 1024 / 1000)) + "MB of memory```")
			bot.sendMessage(msg, statArray);
			bot.deleteMessage(msg);
		}
	},
	"say":
	{
		usage: "[message]",
		description: "bot says message",
		delete: false,
		process: function (bot, msg, suffix)
		{
			bot.sendMessage(msg.channel, suffix);
			bot.deleteMessage(msg);
		}
	},
	"announce":
	{
		usage: "[message]",
		description: "bot says message with text to speech",
    delete: false,
		process: function (bot, msg, suffix)
		{
			bot.sendMessage(msg.channel, suffix,
			{
				tts: true
			});
			bot.deleteMessage(msg);
		}
	},
	"join":
	{
		usage: "[invite]",
		description: "joins the server it's invited to",
  	delete: false,
		process: function (bot, msg, suffix)
		{
			bot.joinServer(suffix, function (error, server)
			{
				if (error)
				{
					bot.sendMessage(msg.channel, "Failed to join");
					console.log(errorC("Failed to join - " + error));
				}
				else
				{
					console.log(warningC("Joined server " + server));
					bot.sendMessage(msg.channel, "Successfully joined " + server);
				}
			});
		}
	},
	"setcolour":
	{
		usage: "[mention] + [1-8 digit decimal colour code]",
		description: "Creates a new role called \"Colour\" with a custom colour.",
  	delete: false,
		process: function (bot, msg, suffix)
		{
			if (suffix && msg.mentions && suffix.split(" ")[1] && suffix.split(" ")[1].length < [9] && /^\d+$/.test(suffix.split(" ")[1]))
			{
				var colour = (suffix.split(" ")[1]).toString();
				msg.mentions.map(function (usr)
					{
						bot.createRole(msg.channel.server,
							{
								position: [2],
								name: "Colour " + colour,
								color: colour,
							})
							.then(function (permission)
							{
								bot.addMemberToRole(usr.id, permission)
									.then(function ()
									{
										bot.sendMessage(msg.channel, "Applied the colour "+colour+" to <@" + usr.id + ">.");
										console.log(channelC("#" + msg.channel.name) + ": " + botC("@WishBot") + " - New Role was made " + warningC("Colour ") + colour + " by " + userC(msg.author.username));
									})
							})
					})
			}
			else
			{
				bot.sendMessage(msg.author, correctUsage("setcolour"));
				bot.sendMessage(msg.author, "Use http://www.mathsisfun.com/hexadecimal-decimal-colors.html to get a decimal colour code.");
			}
			bot.deleteMessage(msg);
		}
	},
	"topic":
	{
		usage: "[topic]",
		description: "Sets the topic for the channel. No topic removes the topic.",
  	delete: false,
		process: function (bot, msg, suffix)
		{
			bot.setChannelTopic(msg.channel, suffix);
			console.log(botC("@WishBot - ") + warningC("Set topic of " + msg.channel));
			bot.reply(msg, "done!")
		}
	},
	"playing":
	{
		usage: "[game]",
		description: "allows you to set a game for Onee-chan to play. If nothing specified it will be random.",
  	delete: false,
		process: function (bot, msg, suffix)
		{
			if (suffix)
			{
				bot.setPlayingGame(suffix);
			}
			if (!suffix)
			{
				bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
			}
			bot.deleteMessage(msg);
		}
	},
	"stop":
	{
		usage: "[none]",
		description: "stops the bot",
  	delete: false,
		process: function (bot, msg, suffix)
		{
			if (msg.author.id === "87600987040120832")
			{
				bot.reply(msg, "I will be taking my leave.")
				bot.logout();
				setTimeout(function ()
				{
					console.log("@WishBot - Stopped bot.");
					process.exit(0);
				}, 1000);
			}
			else
			{
				bot.reply(msg, "I CANNOT BE STOPPED BY THE LIKES OF YOU");
			}
			bot.deleteMessage(msg);
		}
	},
	"setname":
	{
		usage: "[name]",
		description: "Changes the bots username",
		delete: false,
		process: function (bot, msg, suffix)
		{
			if (suffix)
			{
				bot.setUsername(suffix);
				console.log(channelC("#" + msg.channel.name) + ": " + botC("@WishBot") + " - Username set to " + warningC(suffix) + " by " + userC(msg.author.username));
			}
			else
			{
				bot.setUsername("Onee-chan");
				console.log(channelC("#" + msg.channel.name) + ": " + botC("@WishBot") + " - Username set to " + warningC("Onee-chan") + " by " + userC(msg.author.username));
			}
			bot.reply(msg, "done!")
		}
	},
	"delete":
	{
		usage: "[number of messages from 1 - 100]",
		description: "Deletes the specified number of messages from the channel",
  	delete: false,
		process: function (bot, msg, suffix)
		{
			if (suffix && /^\d+$/.test(suffix))
			{
				bot.getChannelLogs(msg.channel, 100, function (error, messages)
				{
					if (error)
					{
						console.log("there was an error getting the logs");
						return;
					}
					else
					{
						bot.startTyping(msg.channel);
						var deletes = parseInt(suffix, 10) + 1;
						var dones = 0;
						for (count of messages)
						{
							bot.deleteMessage(count);
							dones++;
							deletes--;
							if (deletes == 0 || dones == 100)
							{
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
				bot.reply(msg, "using the delete command requires a interger between 1-500")
			}
		}
	}
	/*,
	"eval": {
		usage: "[command]",
		description: 'Executes arbitrary javascript in the bot process.',
		delete: false,
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
