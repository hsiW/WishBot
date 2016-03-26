var prefix = require("./../options/options.json").prefixes;
var strawpoll = require('strawpoll');
var JSONStream = require('JSONStream');
var concat = require('concat-stream');

var utilities = {
	"call": {
		usage: "Tells everyone you'd like a call",
		delete: true,
		process: function(bot, msg) {
			if (msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {bot.sendMessage(msg, ":phone: @everyone, **" + msg.author.name + "** would like to have a call! :phone:");
			}
			else {bot.sendMessage(msg, ":phone: **Everyone**, **" + msg.author.name + "** would like to have a call! :phone:");
			}
		}
	},
	"letsplay": {
		usage: "Tells everyone you'd like to play a game. Can mention the game if one is mentioned\n`"+prefix[0]+"letsplay [game] or [none]`",
		delete: true,
		process: function(bot, msg, suffix) {
			if (suffix.indexOf("everyone") > 0) {suffix = "";}
			if (suffix && msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {
				bot.sendMessage(msg, ":video_game: @everyone, **" + msg.author.name + "** would like to play " + suffix + "! :video_game:");
			}
			if (suffix && !msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {
				bot.sendMessage(msg, ":video_game: **Everyone**, **" + msg.author.name + "** would like to play " + suffix + "! :video_game:");
			}
			if (!suffix && msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {
				bot.sendMessage(msg, ":video_game: @everyone, **" + msg.author.name + "** would like to play a game! :video_game:");
			}
			if (!suffix && !msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {
				bot.sendMessage(msg, ":video_game: **Everyone**, **" + msg.author.name + "** would like to play a game! :video_game:");
			}
		}
	},
	"info": {
		usage: "Gives info on the current server or a user if one is mentioned\n`"+prefix[0]+"info [mentioned user] or [none]`",
		delete: true,
		process: function (bot, msg, suffix) {
			if (msg.mentions.length === 1 && suffix) {
					var joinedOn = new Date(msg.channel.server.detailsOfUser(msg.mentions[0]).joinedAt);
					var roles = msg.channel.server.rolesOfUser(msg.mentions[0].id).map(function (role) {return role.name;});
					roles = roles.join(", ").replace("@", "");
					var msgArray = [];
					msgArray.push("```ruby");
					msgArray.push("Name: \"" + msg.mentions[0].username+"\"");
					msgArray.push("ID: " + msg.mentions[0].id);
					msgArray.push("Discriminator: #" + msg.mentions[0].discriminator);
					msgArray.push("Status: " + msg.mentions[0].status);
					if (msg.mentions[0].game !== null) {msgArray.push("Playing: \'" + msg.mentions[0].game.name+"\'");}
					msgArray.push("Joined Server On: " + joinedOn.toUTCString());
					if (roles.length <= 1000) {msgArray.push("Roles: \"" + roles + "\"");}
					msgArray.push("Avatar: ");
					msgArray.push("```");
					bot.sendMessage(msg, msgArray,{tts: false}, function(error,message){if(!error){bot.sendFile(msg,msg.mentions[0].avatarURL);}});
					return;
			}
			else if ((suffix && !msg.mentions) || msg.everyoneMentioned) {bot.sendMessage(msg, suffix + " is not a valid user.",function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000});});}
			else{
				var msgArray = [];
				msgArray.push("```ruby");
				msgArray.push("Server: #" + msg.channel.server.name);
				msgArray.push("Owner: \"" + msg.channel.server.owner.name+"\"");
				msgArray.push("Default Channel: #" + msg.channel.server.defaultChannel.name);
				msgArray.push("Voice Region: " + msg.channel.server.region);
				msgArray.push("Server ID: " + msg.channel.server.id);
				msgArray.push("Server Icon:```");
				bot.sendMessage(msg, msgArray,{tts: false}, function(error,message){if(!error){bot.sendFile(msg,msg.channel.server.iconURL);}});
				return;
			}
		}
	},
	"strawpoll": {
		usage: "Creates a Strawpoll with the mentioned options\n`"+prefix[0]+"strawpoll [option1], [option2], ect`",
		delete: true,
		process: function (bot, msg, suffix){
			if(!suffix || suffix.split(",").length < 2){bot.sendMessage(msg, "I can't create a strawpoll from that **"+msg.author.username+"**-senpai.", function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000});});}
			else
			{
				var choices = suffix.split(",");
				var stream = strawpoll({title: msg.channel.server.name+"'s Poll", options: choices, multi : false, permissive: true}).pipe(JSONStream.parse('id')).pipe(concat(function(id) {
				bot.sendMessage(msg, "**"+msg.author.name+"** created a **Strawpoll** - http://strawpoll.me/"+id.toString()+" 🎆");}));
		 }
		}
	},
	"roll": {
		usage: "Rolls a dice with 6 sides or more if a number is mentioned\n`"+prefix[0]+"[max value] or [none]`",
		delete: true,
		process: function (bot, msg, suffix) {
			var max = 6;
			if (suffix) {max = suffix;}
			bot.sendMessage(msg,"**"+msg.author.username + "** rolled a **" + (Math.floor(Math.random() * max) + 1) + "**! 🎲");
		}
	},
	"coinflip": {
		usage: "Flips a coin",
		delete: true,
		process: function (bot, msg, suffix) {
			var coinflip = Math.random() < 0.5 ? "Heads" : "Tails";
			bot.sendMessage(msg,"**"+msg.author.username+"**, I flipped a coin and got **"+coinflip+"**! 🔔");
		}
	},
	"pick": {
		usage: "Picks from the mentioned options\n`"+prefix[0]+"[option 1], [option 2], ect`",
		process: function (bot, msg, suffix){
			if(!suffix || suffix.split(",").length < 2){bot.sendMessage(msg, "I can't pick from that, **"+msg.author.username+"**-senpai.",function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000});});}
			else{var choices = suffix.split(","); bot.sendMessage(msg, "**"+msg.author.username+"**, I picked **"+choices[Math.floor(Math.random() * (choices.length))]+"**! ✅");}
		}
	},
	"id": {
		usage: "Gives the id of the mentioned user or the message sender if no one is mentioned\n`"+prefix[0]+"[user mention] or [none]",
		delete: true,
		process: function(bot, msg, suffix) {
			if (!suffix) {
				bot.sendMessage(msg, "Your id is `" + msg.author.id + "`, **" + msg.author.username + "**-senpai.");
			}
			if (msg.mentions.length === 1 && suffix) {
				bot.sendMessage(msg, "**" + msg.mentions[0].username + "'s** User ID is `" + msg.mentions[0].id + "`, **" + msg.author.username + "**-senpai.");
			}
		}
	},
};
exports.utilities = utilities;
