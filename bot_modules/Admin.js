var games = require("./../lists/games.json").games;
var db = require("./Database.js");
var ignoreDB = require("./Ignored.js")
var b64img = require('request').defaults({encoding: null});

var admin = {
	"say": {
		usage: "Makes the bot say the mentioned message",
		delete: true,
		process: function(bot, msg, suffix) {
			bot.sendMessage(msg, suffix);
		}
	},
	"message": {
		usage: "Secret",
		delete: true,
		process: function(bot, msg, suffix) {
			var postSuffix = suffix.substr(suffix.indexOf(' ')+1);
			suffix = suffix.split(" ")[0];
			bot.sendMessage(suffix, "Message from **"+msg.author.name+"**: "+postSuffix+" - I'm a Bot, Bleep Bloop. If you'd like to message this user directly please join my bot server by doing `server`")
			.then(bot.sendMessage(msg, "Successfully sent message to `"+suffix+"`"))
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
	"logout": {
		usage: "",
		delete: true,
		process: function(bot, msg, suffix) {
			bot.sendMessage(msg, "Logging Out").then(bot.logout());
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
	"searchusers": {
		usage: "",
		delete: true,
		process: function(bot, msg, suffix) {
			var nameRegex = new RegExp(suffix,"i");
			var usersCache = msg.channel.server.members.getAll('name', nameRegex);
			var msgArray = ["__**Found These Users:**__"];
			for (i = 0; i < usersCache.length; i++)
			{
				if(i === 10){
					msgArray.push("And "+(usersCache.length - i)+" more users...");
					break;
				}
				msgArray.push(usersCache[i].username+" #*"+usersCache[i].discriminator+"*");
			}

			bot.sendMessage(msg, msgArray);
		}
	},
	"searchservers": {
		usage: "",
		delete: true,
		process: function(bot, msg, suffix) {
			var nameRegex = new RegExp(suffix,"i");
			var serverCache = bot.servers.getAll('name', nameRegex);
			var msgArray = ["__**Found These Servers:**__"];
			for (i = 0; i < serverCache.length; i++)
			{
				if(i === 25){
					msgArray.push("And "+(serverCache.length - i)+" more servers...");
					break;
				}
				msgArray.push(serverCache[i].name+" #*"+serverCache[i].id+"*");
			}

			bot.sendMessage(msg, msgArray);
		}
	},
	"leaveserver": {
		usage: "",
		delete: true,
		process: function(bot, msg, suffix)
		{
			bot.leaveServer(bot.servers.get('id', suffix));
		}
	},
	"searchchannels": {
		usage: "",
		delete: true,
		process: function(bot, msg, suffix) {
			var nameRegex = new RegExp(suffix,"i");
			var channelCache = msg.channel.server.channels.getAll('name', nameRegex);
			console.log(channelCache);
			var msgArray = ["__**Found These Channels:**__"];
			for (i = 0; i < channelCache.length; i++)
			{
				if(i === 10){
					msgArray.push("And "+(channelCache.length - i)+" more channels...");
					break;
				}
				msgArray.push(channelCache[i]);
			}

			bot.sendMessage(msg, msgArray);
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
	"setavatar": {
		usage: "",
		delete: true,
		process: function(bot, msg, suffix)
		{
			b64img.get(suffix, (error, response, body) => {
				if (!error && response.statusCode == 200) {
					var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
					bot.setAvatar(data);
				}
		});
	}
	},
	"database": {
		usage: "",
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
			else if (formatedSuffix === "load") {
				db.load(bot, msg);
			}
			else if (formatedSuffix === "test") {
				db.test(bot, msg);
			}
		}
	},
	"ignore": {
		usage: "",
		delete: true,
		process: function(bot, msg, suffix) {
			ignoreDB.ignore(bot, msg, suffix)
		}
	},
	"unignore": {
		usage: "",
		delete: true,
		process: function(bot, msg, suffix) {
			ignoreDB.unignore(bot, msg, suffix)
		}
	}
}
exports.admin = admin;
