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
		bot.joinServer(suffix, function (error, server) {
				if (error) {
					bot.sendMessage(msg.channel, "Failed to join");
					console.log(errorC("Failed to join - "+error));
				}
				else {
					console.log(warningC("Joined server " + server));
					bot.sendMessage(msg.channel, "Successfully joined " + server);
				}
			});
		}
	},
	"topic": {
		usage: "[topic]",
		description: "Sets the topic for the channel. No topic removes the topic.",
		process: function (bot, msg, suffix) {
			bot.setChannelTopic(msg.channel, suffix);
			console.log(botC("@WishBot - ")+warningC("Set topic of "+msg.channel));
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
				setTimeout(function(){
					console.log("@WishBot - Stopped bot.");
					process.exit(0);
				}, 1000);
			}
			else {
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
				console.log(channelC("#" + msg.channel.name) + ": "+botC("@WishBot")+" - Username set to "+warningC(suffix)+" by " + userC(msg.author.username));
			} else {
				bot.setUsername("Onee-chan");
				console.log(channelC("#" + msg.channel.name) + ": "+botC("@WishBot")+" - Username set to "+warningC("Onee-chan")+" by " + userC(msg.author.username));
			}
			bot.reply(msg, "done!")
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
	}/*,
	"update": {
		usage: "[none]",
		description:"Updates the bot to the most current veresion on github",
		process: function(bot, msg)
		{
			if (msg.author.id === "87600987040120832" && options.github)
			{
				bot.sendMessage(msg.channel,"fetching updates...",function(error,sentMsg){
						console.log("updating...");
					var spawn = require('child_process').spawn;
						var log = function(err,stdout,stderr){
								if(stdout){console.log(stdout);}
								if(stderr){console.log(stderr);}
						};
						var fetch = spawn('git', ['fetch']);
						fetch.stdout.on('data',function(data){
								console.log(data.toString());
						});
						fetch.on("close",function(code){
								var reset = spawn('git', ['reset','--hard','origin/master']);
								reset.stdout.on('data',function(data){
										console.log(data.toString());
								});
								reset.on("close",function(code){
										var npm = spawn('npm', ['install']);
										npm.stdout.on('data',function(data){
												console.log(data.toString());
										});
										npm.on("close",function(code){
												console.log("goodbye");
												bot.sendMessage(msg.channel,"brb!",function(){
														bot.logout(function(){
																process.exit();
														});
												});
										});
								});
						});
				});
			}
			else
			{

			}
		}
	}*/
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
