var options = require("./options/options.json");
var prefix = require("./options/options.json").prefixes;
var Discord = require("discord.js");

var chalk = require("chalk");
var c = new chalk.constructor({enabled: true});

var channelC = c.green.bold;
var userC = c.cyan.bold;
var warningC = c.yellow.bold;
var errorC = c.red.bold;
var botC = c.magenta.bold;

function correctUsage(cmd) {var msg = "Usage: " + prefix[1] + "" + cmd + " " + admin_commands[cmd].usage; return msg;}

var admin_commands = {
	"help":{
		description: "Sends a PM containing all of the Admin Commands.", usage: "[command]", delete: true,
		process: function (bot, msg, suffix){
			if (admin_commands[suffix]){bot.sendMessage(msg.author, correctUsage(suffix))}
			else{
				var msgArray = [];
				msgArray.push("**Admin Commands: **");
				msgArray.push("```");
				Object.keys(admin_commands).sort().forEach(function (cmd){msgArray.push("" + prefix[1] + "" + cmd + ": " + admin_commands[cmd].description + "")});
				msgArray.push("```");
				msgArray.push("Quite a few of these commands require me to have the **Manage Role Permission** to work properly")
				bot.sendMessage(msg.author, msgArray);
			}
		}
	},
	"setcolour":{
		usage: "[mention] + [6 digit hexidecimal colour code]", description: "Creates a new role called \"Colour\" with a custom colour.", delete: true,
			process: function (bot, msg, suffix){
				if (msg.mentions && (parseInt("0x"+(suffix.split(" ")[1]),16)) && suffix.split(" ")[1].length == 6){
					var temp = (suffix.split(" ")[1]);
					var colour = temp;
					if(temp.length = [6] && msg.mentions.length === 1)
					{
						temp = parseInt("0x"+temp,16);
						bot.createRole(msg.channel.server,{position: [2], permissions: [0], name: "Colour " + colour, color: temp}).then(function (permission){bot.addMemberToRole(msg.mentions[0].id, permission).then(function ()
							{bot.sendMessage(msg, "Applied the colour "+colour+" to " + msg.mentions[0]+", Senpai!");})})
					});
					}
				}
				else{bot.sendMessage(msg.author, correctUsage("setcolour")).then(bot.sendMessage(msg.author, "You can use http://www.colorpicker.com/ to get a hex colour code"));}
			}
		},
	"setcolor":{
			usage: "[none]", description: "Its setcolour not setcolor", delete: true,
			process: function (bot, msg){bot.sendMessage(msg.author, correctUsage("setcolour")).then(bot.sendMessage(msg.author, "You can use http://www.colorpicker.com/ to get a hex colour code"))}
		},
	"stats":{
		usage: "[none]", description: "Outputs different stats about this bot", delete: true,
		process: function (bot, msg, suffix, commandsProcessed, talked)
		{
			var statArray = []
			statArray.push("**Info about " + bot.user + "**");
			statArray.push("```Bot Uptime: " + Math.round((bot.uptime / 3600000) % 60) + " hour(s), " + Math.round((bot.uptime / 60000) % 60) + " minute(s), and " + Math.round((bot.uptime / 1000) % 60) + " second(s).");
			statArray.push("Currently connected to " + bot.servers.length + " server(s) and " + bot.channels.length + " channel(s)");
			statArray.push("Being used by "+bot.users.length+" users")
			statArray.push("During the current session " + commandsProcessed + " command(s) have been processed.");
			statArray.push(bot.user.username + " has been talked to " + talked + " time(s)");
			statArray.push("Currently using " + (Math.round(process.memoryUsage().rss / 1024 / 1000)) + "MB of memory```")
			bot.sendMessage(msg, statArray);
		}
	},
	"topic":{
		usage: "[topic]", description: "Sets the topic for the channel. No topic removes the topic.", delete: true,
		process: function (bot, msg, suffix){bot.setChannelTopic(msg.channel, suffix); bot.reply(msg, msg.channel+" had its topic set to "+suffix);}
	},
	"delete":{
		usage: "[number of messages from 1 - 100] and/or <users messages to delete>", description: "Deletes the specified number of messages from the channel", delete: false,
		process: function (bot, msg, suffix){
			if (/^\d+$/.test((suffix.split(" ")[0]))){
				bot.getChannelLogs(msg.channel, 100, function (error, messages)
				{
					if (error){ console.log("there was an error getting the logs"); return;}
					else{
						bot.startTyping(msg.channel);
						var toDelete = parseInt((suffix.split(" ")[0]), 10) + 1;
						var dones = 0;
						var mentioned = false;
						if(msg.mentions.length === 1){mentioned = true; var person = msg.mentions[0];}
								for (i = 0; i <= 100; i++)
								{
									if(toDelete <= 0){bot.stopTyping(msg.channel); bot.sendMessage(msg, "Finished deleting **"+dones - 1+"** messages in "+msg.channel+".") return;}
									if(mentioned && messages[i].author.id === person.id){bot.deleteMessage(messages[i]); dones++; toDelete--;}
									else if(!mentioned){bot.deleteMessage(messages[i]); dones++; toDelete--;}
								}
							}
						});
						bot.stopTyping(msg.channel);
			}
			else{bot.sendMessage(msg, "Using the delete command requires a number between 1-100, Senpai!")}
		}
	}
};

exports.admin_commands = admin_commands;
