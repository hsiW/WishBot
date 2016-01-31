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
	var msg = "Usage: " + options.mod_command_prefix + "" + cmd + " " + mod_commands[cmd].usage;
	return msg;
}

var mod_commands = {
	"help":
	{
		description: "Sends a PM containing all of these Mod Commands.",
		usage: "[command]",
  	delete: true,
		process: function (bot, msg, suffix)
		{
			if (mod_commands[suffix]){bot.sendMessage(msg.author, correctUsage(suffix))}
			else
			{
				var msgArray = [];
				msgArray.push("**Mod Commands: **");
				msgArray.push("```");
				Object.keys(mod_commands).sort().forEach(function (cmd){msgArray.push("" + options.mod_command_prefix + "" + cmd + ": " + mod_commands[cmd].description + "")});
				msgArray.push("```");
				bot.sendMessage(msg.author, msgArray);
			}
		}
	},
	"setcolour":
		{
			usage: "[mention] + [6 digit hexidecimal colour code]",
			description: "Creates a new role called \"Colour\" with a custom colour.",
	  	delete: true,
			process: function (bot, msg, suffix)
			{
				if (msg.mentions && (parseInt("0x"+(suffix.split(" ")[1]),16)) && suffix.split(" ")[1].length == 6)
				{
					var temp = (suffix.split(" ")[1]);
					var colour = temp;
					if(temp.length = [6])
					{
						temp = parseInt("0x"+temp,16);
						msg.mentions.map(function (usr)
						{
						bot.createRole(msg.channel.server,
								{
									position: [2],
									permissions: [0],
									name: "Colour " + colour,
									color: temp,
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
					});
					}
				}
				else
				{
					bot.sendMessage(msg.author, correctUsage("setcolour")).then(bot.sendMessage(msg.author, "You can use http://www.colorpicker.com/ to get a hex colour code"));
				}
			}
		},
		"setcolor":
		{
			usage: "[none]",
			description: "Its setcolour not setcolor",
	    delete: true,
			process: function (bot, msg, suffix)
			{bot.sendMessage(msg.author, correctUsage("setcolour")).then(bot.sendMessage(msg.author, "You can use http://www.colorpicker.com/ to get a hex colour code"))}
		},
	"stats":
	{
		usage: "[none]",
		description: "Outputs different stats about this bot",
  	delete: true,
		process: function (bot, msg, suffix, commandsProcessed, talked)
		{
			var statArray = []
			statArray.push("**Info about " + bot.user + "**");
			statArray.push("```Bot Uptime: " + Math.round((bot.uptime / 3600000) % 60) + " hour(s), " + Math.round((bot.uptime / 60000) % 60) + " minute(s), and " + Math.round((bot.uptime / 1000) % 60) + " second(s).");
			statArray.push("Currently connected to " + bot.servers.length + " server(s) and " + bot.channels.length + " channel(s)");
			statArray.push("During the current session " + commandsProcessed + " command(s) have been processed.");
			statArray.push(bot.user.username + " has been talked to " + talked + " time(s)");
			statArray.push("Currently using " + (Math.round(process.memoryUsage().rss / 1024 / 1000)) + "MB of memory```")
			bot.sendMessage(msg, statArray);
		}
	},
	"join":
	{
		usage: "[invite]",
		description: "Joins the server it's invited to",
  	delete: true,
		process: function (bot, msg, suffix)
		{
			bot.joinServer(suffix, function (error, server)
			{
				if (error){bot.sendMessage(msg.channel, "Failed to join").then(console.log(errorC("Failed to join server - " + error)))}
				else{bot.sendMessage(msg.channel, "Successfully joined " + server).then(console.log(warningC("Joined server " + server)))}
			});
		}
	},
	"topic":
	{
		usage: "[topic]",
		description: "Sets the topic for the channel. No topic removes the topic.",
  	delete: true,
		process: function (bot, msg, suffix)
		{
			bot.setChannelTopic(msg.channel, suffix);
			console.log(botC("@WishBot - ") + warningC("Set topic of " + msg.channel))
			bot.reply(msg, msg.channel.name+" had its topic set to "+suffix)
		}
	},
	"delete":
	{
		usage: "[number of messages from 1 - 100]",
		description: "Deletes the specified number of messages from the channel",
  	delete: true,
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

exports.mod_commands = mod_commands;
