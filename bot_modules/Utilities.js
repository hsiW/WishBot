var prefix = require("./../options/options.json").prefixes;
var strawpoll = require('strawpoll');
var JSONStream = require('JSONStream');
var concat = require('concat-stream');
var eightBall = require("./../lists/8ball.json").ball;
var math = require('mathjs');

function getUser(bot, msg, suffix){
  var nameRegex = new RegExp(suffix,"i");
  return usersCache = msg.channel.server.members.get('name', nameRegex);
}

var utilities = {
	"call": {
		usage: "Tells everyone you'd like a call",
		delete: true,
    cooldown: 10,
		process: function(bot, msg) {
			if (msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {bot.sendMessage(msg, ":phone: @everyone, **" + msg.author.name + "** would like to have a call! :phone:");
			}
			else {bot.sendMessage(msg, ":phone: **Everyone**, **" + msg.author.name + "** would like to have a call! :phone:");
			}
		}
	},
	"letsplay": {
		usage: "Tells everyone you'd like to play a game. Can mention the game if one is mentioned\n`letsplay [game] or [none]`",
		delete: true,
    cooldown: 10,
		process: function(bot, msg, suffix) {
			if (suffix.indexOf("everyone") > 0) {suffix = "";}
			if (suffix && msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {
				bot.sendMessage(msg, ":video_game: @everyone, **" + msg.author.name + "** would like to play " + suffix + "! :video_game:");
			}
			else if (suffix && !msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {
				bot.sendMessage(msg, ":video_game: **Everyone**, **" + msg.author.name + "** would like to play " + suffix + "! :video_game:");
			}
			else if (!suffix && msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {
				bot.sendMessage(msg, ":video_game: @everyone, **" + msg.author.name + "** would like to play a game! :video_game:");
			}
			else if (!suffix && !msg.channel.permissionsOf(msg.sender).hasPermission("mentionEveryone")) {
				bot.sendMessage(msg, ":video_game: **Everyone**, **" + msg.author.name + "** would like to play a game! :video_game:");
			}
		}
	},
	"avatar": {
		usage: "Prints the avatar of the user mentioned or the message authors avatar if none mentioned.\n`avatar [user mention] or [none]`",
		delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix) {
			if(suffix) {
        suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot,msg,suffix);
        if(suffix != null){bot.sendMessage(msg, "**" + suffix.username + "'s** avatar is ");bot.sendFile(msg, suffix.avatarURL)}
        else {bot.sendMessage(msg, "**" + msg.sender.name + "'s** avatar is ");bot.sendFile(msg,msg.author.avatarURL)}
			}
			else {
				bot.sendMessage(msg, "**" + msg.sender.name + "'s** avatar is ");bot.sendFile(msg,msg.author.avatarURL)
			}
		}
	},
	"info": {
		usage: "Gives info on the current server or a user if one is mentioned\n`info [mentioned user] or [none]`",
		delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix) {
      if(suffix) {
        suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot,msg,suffix);
        if(suffix != null){
					var joinedOn = new Date(msg.channel.server.detailsOfUser(suffix).joinedAt);
					var roles = msg.channel.server.rolesOfUser(suffix.id).map(function (role) {return role.name;});
					roles = roles.join(", ").replace("@", "");
					var msgArray = [];
					msgArray.push("```ruby");
					msgArray.push("Name: \"" + suffix.username+"\"");
					msgArray.push("ID: " + suffix.id);
					msgArray.push("Discriminator: #" + suffix.discriminator);
					msgArray.push("Status: " + suffix.status);
					if (suffix.game !== null) {msgArray.push("Playing: \'" + suffix.game.name+"\'");}
					msgArray.push("Joined Server On: " + joinedOn.toUTCString());
					if (roles.length <= 1000) {msgArray.push("Roles: \"" + roles + "\"");}
					msgArray.push("Avatar: ");
					msgArray.push("```");
					bot.sendMessage(msg, msgArray,{tts: false}, function(error,message){if(!error){bot.sendFile(msg,suffix.avatarURL);}});
					return;
        }
        else{bot.sendMessage(msg, suffix + " is not a valid user.",function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000});});}
			}
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
		usage: "Creates a Strawpoll with the mentioned options\n`strawpoll [option1], [option2], ect`",
		delete: true,
    cooldown: 15,
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
		usage: "Rolls a dice with 6 sides or more if a number is mentioned\n`[max value] or [none]`",
		delete: true,
    cooldown: 2,
		process: function (bot, msg, suffix) {
			var max = 6;
			if (suffix) {max = suffix;}
			bot.sendMessage(msg,"**"+msg.author.username + "** rolled a **" + (Math.floor(Math.random() * max) + 1) + "**! 🎲");
		}
	},
	"coinflip": {
		usage: "Flips a coin",
		delete: true,
    cooldown: 2,
		process: function (bot, msg, suffix) {
			var coinflip = Math.random() < 0.5 ? "Heads" : "Tails";
			bot.sendMessage(msg,"**"+msg.author.username+"**, I flipped a coin and got **"+coinflip+"**! 🔔");
		}
	},
	"pick": {
		usage: "Picks from the mentioned options\n`pick [option 1], [option 2], ect`",
    cooldown: 5,
		process: function (bot, msg, suffix){
			if(!suffix || suffix.split(",").length < 2){bot.sendMessage(msg, "I can't pick from that, **"+msg.author.username+"**-senpai.",function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000});});}
			else{var choices = suffix.split(","); bot.sendMessage(msg, "**"+msg.author.username+"**, I picked **"+choices[Math.floor(Math.random() * (choices.length))]+"**! ✅");}
		}
	},
  "8ball": {
		usage: "A magical 8ball\n`8ball [questions]`",
    cooldown: 2,
		process: function (bot, msg){
      bot.sendMessage(msg,"**"+msg.author.name+"**-senpai the 8ball reads: **"+eightBall[Math.floor(Math.random() * (eightBall.length))]+"**")
		}
	},
	"id": {
		usage: "Gives the id of the mentioned user or the message sender if no one is mentioned\n`id [user mention] or [none]`",
		delete: true,
    cooldown: 2,
		process: function(bot, msg, suffix) {
      if(suffix) {
        suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot,msg,suffix);
        if(suffix != null) bot.sendMessage(msg, "**" + suffix.username + "'s** User ID is `" + suffix.id + "`, **" + msg.author.username + "**-senpai.");
        else bot.sendMessage(msg, "Your id is `" + msg.author.id + "`, **" + msg.author.username + "**-senpai.");
			}
			else{
				bot.sendMessage(msg, "Your id is `" + msg.author.id + "`, **" + msg.author.username + "**-senpai.");
			}
		}
	},
  "calculate": {
		usage: "Prints out the answer to the expression mentioned. Keep in mind * is used for multiplying. Cannot currently solve for values. Can also convert between units by doing:`[number]<current units> to <desired units>`\n`calculate [expression]`",
    cooldown: 10,
		process: function (bot, msg, suffix){
			var answer = math.eval(suffix);
			bot.sendMessage(msg,"**"+msg.author.name+"** here is the answer to that calculation: ```"+answer+"```");
		}
	},
  "clean": {
		usage: "Cleans the mentioned number of this bots messages from the current channel.\n`delete [# from 1-100]`",
		delete: true,
    cooldown: 5,
		process: function(bot, msg, suffix) {
			if (/^\d+$/.test((suffix.split(" ")[0]))) {
				bot.getChannelLogs(msg.channel, 250, function(error, messages) {
					if (error) {
						console.log("there was an error getting the logs");
						return;
					} else {
						var toDelete = parseInt((suffix.split(" ")[0]), 10)
						var dones = 0;
						for (i = 0; i <= 100; i++) {
							if (toDelete <= 0) {
								bot.sendMessage(msg, "Finished cleaning **" + dones + "** messages in " + msg.channel + ".", function(error, sentMessage) {
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
