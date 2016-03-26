var games = require("./../lists/games.json").games;
var db = require("./Database.js");
var request = require('request');

var admin = {
	"say": {
		usage: "Makes the bot say the mentioned message",
		delete: true,
		process: function(bot, msg, suffix) {
			bot.sendMessage(msg, suffix)
		}
	},
	"playing": {
		usage: "Sets the currently playing game to the mentioned word or to a random game if none mentioned\n`playing [game] or [none]",
		delete: true,
		process: function(bot, msg, suffix) {
			if (suffix) {bot.setPlayingGame(suffix)}
	    else {bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))])}
		}
	},
	"restart": {
		usage: "Restarts the bot if running on heroku",
		delete: true,
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
		process: function(bot, msg) {
			bot.sendMessage(msg, "__**" + bot.user + " is connected to the following Large Servers(250+ Users):**__```ruby\n" + bot.servers.filter(s => s.members.length >= 250).map(s => s.name + ": " + s.members.length).join("\n") + "```");
		}
	},
	"usage": {
		usage: "Displays command usage statistics of the current session",
		delete: true,
		process: function(bot, msg, suffix, cmdIndex, cmdUsage)
		{
			var msgArray = ["__**Command Usage:**__```ruby"]
			cmdIndex.forEach(function(cmd, index) {msgArray.push(cmdIndex[index] + " : " + cmdUsage[index]);})
			msgArray.push("```")
			bot.sendMessage(msg, msgArray)
		}
	},
	"database": {
		usage: "Lists the large servers this bot is connected to",
		delete: true,
		process: function(bot, msg, suffix) {
			var formatedSuffix = suffix.split(" ")[0];
			console.log(formatedSuffix);
			if(formatedSuffix === "settings"){
				db.Settings(msg, function(loadedEntity) {
					console.log(loadedEntity);
				});
			}
			else if (formatedSuffix === "remove") {
				db.remove(bot,msg);
			}
			else if (formatedSuffix === "prefix" || formatedSuffix === "modprefix") {
			}
			else if (formatedSuffix === "create") {
				db.create();
			}
		}
	}
}

exports.admin = admin;
