var options = require("./options.json");
var Discord = require("discord.js");
var request = require('request');
var xml2js = require('xml2js');
var qs = require("querystring");
var YouTube = require('youtube-node');
var Wiki = require('wikijs');
var quote = require("./animequotes.json").animequotes;
var fix = require('entities');
var cool = require('cool-ascii-faces');

var chalk = require("chalk");
var c = new chalk.constructor({enabled: true});

var channelC = c.green.bold;
var userC = c.cyan.bold;
var warningC = c.yellow.bold;
var errorC = c.red.bold;
var botC = c.magenta.bold;

var youTube = new YouTube();
youTube.setKey(options.youtube_api_key);

function correctUsage(cmd) {
	var msg = "Usage: " + options.command_prefix + "" + cmd + " " + commands[cmd].usage;
	return msg;
}

var commands = {
	"help": {
		usage: "[command]",
		description: "Sends a DM containing all of the commands.",
    delete: true,
		process: function (bot, msg, suffix) {
			if(commands[suffix])
			{
				bot.sendMessage(msg.author, correctUsage(suffix))
			}
			else
			{
				var msgArray = [];
				msgArray.push("**Commands: **");
				msgArray.push("```");
				Object.keys(commands).sort().forEach(function (cmd) {
					msgArray.push("" + options.command_prefix + "" + cmd + ": " + commands[cmd].description + "");
				});20
				msgArray.push("```");
				bot.sendMessage(msg.author, msgArray);
			}
		}
	},
	"info": {
		usage: "[none]",
		description: "Gives info about the server",
    delete: true,
		process: function (bot, msg, suffix) {
			var msgArray = [];
			msgArray.push("You requested info on **" + msg.channel.server.name + "**");
			msgArray.push("Owner: " + msg.channel.server.owner + " (id: " + msg.channel.server.owner.id + ")\n");
			msgArray.push("```Server ID: " + msg.channel.server.id + "");
			msgArray.push("Region: " + msg.channel.server.region + "");
			msgArray.push("Default channel: #" + msg.channel.server.defaultChannel.name + "");
			msgArray.push("This channel's id: " + msg.channel.id + "```");
			var rsO = msg.channel.server.roles;
			var rols /* = "undefined@everyone, "*/ ;
			for (rO of rsO) {
				rols += (rO.name + ", ");
			}
			msgArray.push("```Roles: " + rols.substring(9, rols.length - 2) + "```");
			msgArray.push("Icon URL: " + msg.channel.server.iconURL + "");
			bot.sendMessage(msg, msgArray);
		}
	},
	"ping": {
		usage: "[none]",
		description: "responds pong, useful for checking if bot is alive",
    delete: false,
		process: function (bot, msg, suffix) {bot.reply(msg, "PONG!")}
	},
	"animequote":
	{
		usage: "[none]",
		description: "Give a random anime quote",
  	delete: true,
		process: function (bot, msg){bot.sendMessage(msg.channel, quote[Math.floor(Math.random() * (quote.length))]);}
	},
	"vquote": {
		usage: "[quote message]",
		description: "logs message to quotes chat with voice tag",
  	delete: true,
		process: function (bot, msg, suffix) {
			if(msg.channel.server.id === "87601506039132160"){
				if (!suffix){bot.reply(msg, "you'll need to have a quote to quote something, Senpai.")}
				else{bot.sendMessage("136558567082819584", "__From voice chat:__ \n" + suffix)}
			}
			else {bot.reply(msg,"I'm sorry but that command doesnt work on this server.")}
		}
	},
	"tquote": {
		usage: "[quote message]",
		description: "logs message to quotes chat with text tag",
    	delete: true,
		process: function (bot, msg, suffix) {
			if(msg.channel.server.id === "87601506039132160")
			{
			if(!suffix){bot.reply(msg, "you'll need to have a quote to quote something, Senpai.")}
			else{bot.sendMessage("136558567082819584", "__From text chat:__ \n" + suffix)}
		  }
			else {bot.reply(msg,"I'm sorry but that command doesnt work on this server.")}
		}
	},
	"gif": {
		usage: "[image tags]",
		description: "returns a random gif matching the tags passed",
  	delete: true,
		process: function (bot, msg, suffix) {
			var tags = suffix.split(" ");
			get_gif(tags, function (id) {
				if (typeof id !== "undefined") {bot.sendMessage(msg.channel, "http://media.giphy.com/media/" + id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]")}
				else{bot.sendMessage(msg.channel, "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]")}
			});
		}
	},
	"reddit": {
		usage: "[subreddit]",
		description: "Links the top post on /r/all or the top post on the subreddit entered",
  	delete: false,
		process: function (bot, msg, suffix) {
			var path = "/.rss"
			if (suffix) {path = "/r/" + suffix + path}
			rssfeed(bot, msg, "https://www.reddit.com" + path, 1, false);
		}
	},
	"roll": {
		usage: "[max value]",
		description: "returns a random number between 1 and max value. If no max is specified it is 10",
  	delete: true,
		process: function (bot, msg, suffix) {
			var max = 6;
			if (suffix) {max = suffix}
			bot.reply(msg, "you rolled a " + (Math.floor(Math.random() * max) + 1) + "! 🎲")
		}
	},
	"lenny": {
		usage: "[no usage]",
		description: "puts a lenny face",
  	delete: true,
		process: function (bot, msg) {bot.sendMessage(msg.channel, "( ͡° ͜ʖ ͡°)");}
	},
	"facelist": {
		usage: "[no usage]",
		description: "gives you a list of the faces you can use with the face command",
  	delete: true,
		process: function (bot, msg) {
			var msgArray = [];
			msgArray.push("__Below is a list of the faces you can do with the face comannd:__")
			msgArray.push("```")
			for(i = 0; i < cool.faces.length; i++)
			{
				msgArray.push(i+": "+cool.faces[i])
			}
			msgArray.push("```")
			bot.sendMessage(msg.author, msgArray);
			}
	},
	"face": {
		usage: "[A number]",
		description: "Sends an ascii face at random or sends the ascii for the number",
  	delete: true,
		process: function (bot, msg, suffix)
		{
		if(suffix &&  /^\d+$/.test(suffix) && cool.faces.length >= parseInt(suffix))
		{
			bot.sendMessage(msg.channel, cool.faces[suffix])
		}
		else
		{
				bot.sendMessage(msg.channel, cool.faces[Math.floor(Math.random() * (cool.faces.length))])
		}
		}
	},
	"wiki": {
		usage: "[information to be brought up]",
		description: "Gives you a wikipedia url based on the entered text",
  	delete: true,
		process: function (bot, msg, suffix)
		{
			if(suffix)
			{
        new Wiki().search(suffix,1).then(function(data) {
      	new Wiki().page(data.results[0]).then(function(page)
				{bot.sendMessage(msg.channel, page.fullurl)});
			});
		}
		else{bot.sendMessage(msg.channel, "You need to enter a topic to be wiki'd!")}
		}
	},
	"hug": {
        usage: "[no usage]",
        description: "puts a (>^_^)> <(^.^<)",
        delete: true,
        process: function (bot, msg, suffix) {
            if (!suffix){bot.sendMessage(msg.channel, "(>^_^)> <(^.^<)")}
            else {msg.mentions.map(function (usr) {bot.sendMessage(msg, msg.author + " (>^_^)> <(^.^<) " + "<@" + usr.id + ">");})}
        }
    },
	"flamethrower": {
		usage: "[no usage]",
		description: "puts a (╯°□°)╯︵ǝɯɐlℲ",
  	delete: true,
		process: function (bot, msg) {bot.sendMessage(msg.channel, "(╯°□°)╯︵ǝɯɐlℲ")}
	},
	"botserver": {
		usage: "[no usage]",
		description: "Posts a invite to this bots server",
  	delete: true,
		process: function (bot, msg) {bot.sendMessage(msg.channel, "__**Heres a invite to my server:**__ https://discord.gg/0lBiROCNVaDaE8rR")}
	},
	"sing": {
		usage: "[no usage]",
		description: "sings a lovely song",
  	delete: true,
		process: function (bot, msg){bot.sendMessage(msg.channel, "*🎵sings a beautiful song about Onii-chan🎵*");}
	},
	"weedle": {
		usage: "[no usage]",
		description: "weedle weedle weedle wee",
		delete: true,
		process: function (bot, msg) {bot.sendMessage(msg.channel,"Weedle Weedle Weedle Wee").then(	bot.sendMessage(msg.channel, "http://media.giphy.com/media/h3Jm3lzxXMaY/giphy.gif"))}
	},
	"letsplay": {
		usage: "[game]",
		description: "Tells everyone to play a game.",
  	delete: true,
		process: function (bot, msg, suffix) {
			if (suffix) {bot.sendMessage(msg.channel, ":video_game: @everyone, " + msg.author + " would like to play " + suffix + "!")}
			else {bot.sendMessage(msg.channel, ":video_game: @everyone, " + msg.author + " would like to play a game!")}
		}
	},
	"call": {
		usage: "[none]",
		description: "Tells everyone you want to call.",
  	delete: true,
		process: function (bot, msg, suffix) {bot.sendMessage(msg.channel, ":phone: @everyone, " + msg.author + " would like to have a call!")}
	},
	"randomquote": {
		usage: "[none]",
		description: "Tells everyone you want to call.",
  	delete: true,
		process: function (bot, msg){
			if(msg.channel.server.id === "87601506039132160"){
			bot.getChannelLogs("136558567082819584", 100, function(error,messages){
			if(error){console.log(error); return;}
			else{bot.sendMessage(msg.channel,messages[Math.floor((Math.random() * messages.length) + 1)])}
		});
	}
		else {bot.reply(msg,"I'm sorry but that command doesnt work on this server.")}
		}
	},
	"youtube": {
		usage: "[topic]",
		description: "Probably gives you a link to the first result of the searched term.",
  	delete: true,
		process: function (bot, msg, suffix) {
			youTube.search(suffix, 10, function (error, result)
			{
				if (error || !result || !result.items || result.items.length < 1) {bot.sendMessage(msg.channel, "Your search resulted in an error. Please forgive me senpai! ;-;")}
				else {
					if (typeof result.items[0].id.videoId === "undefined")
					{
						for(i = 1; i < result.items.length; i++)
						{
							if(typeof result.items[i].id.videoId !== "undefined")
							{
									bot.sendMessage(msg.channel, "http://www.youtube.com/watch?v=" + result.items[i].id.videoId);
									return;
							}
						}
					}
					else{bot.sendMessage(msg.channel, "http://www.youtube.com/watch?v=" + result.items[0].id.videoId)}
				}
			});
		}
	},
	"avatar": {
		usage: "outputs the avatar of the user of the command or the person linked.",
		description: "Outputs an avatar url",
		delete: true,
		process: function (bot, msg, suffix) {
			if (!suffix || !msg.mentions) {bot.reply(msg, msg.author.avatarURL);}
			else {msg.mentions.map(function (usr) {bot.reply(msg, usr.username + "'s avatar is " + usr.avatarURL)})}
		}
	},
	"id": {
		usage: "outputs the id of the user of the command or the person linked.",
		description: "Outputs an id",
  	delete: true,
		process: function (bot, msg, suffix) {
			if (!suffix) {bot.reply(msg, "your id is ```" + msg.author.id + "```")}
			else {msg.mentions.map(function (usr) {bot.reply(msg, usr.username + "'s id is ```" + usr.id + "```")})}
		}
	},
	"anime": {
		usage: "[no usage]",
		description: "Gives information about the anime mentioned",
  	delete: false,
		process: function (bot, msg, suffix) {
			var anime = msg.content.split(" ").slice(1).join("+");
			var apiURL = "http://myanimelist.net/api/anime/search.xml?q=" + anime;
			request(apiURL, {
				"auth": {"user": "hsiw","pass": "RrzY3ykoK>4^^SKUK6sHCOwZ^mwY#1","sendImmediately": true}
			}, function (error, response, body) {
				if (error) {
					console.log(errorC(error));
				}
				if (!error && response.statusCode == 200) {
					xml2js.parseString(body, function (err, result) {
						var animeArray = [];
						var synopsis = result.anime.entry[0].synopsis.toString();
						synopsis = synopsis.replace(/<br \/>/g, " "); synopsis = synopsis.replace(/\[(.{1,10})\]/g, "");
						synopsis = synopsis.replace(/\r?\n|\r/g, " "); synopsis = synopsis.replace(/\[(i|\/i)\]/g, "*");
						synopsis = synopsis.replace(/\[(b|\/b)\]/g, "**");
						synopsis = fix.decodeHTML(synopsis);
						animeArray.push("__**"+result.anime.entry[0].title+"**__ - __**"+result.anime.entry[0].english+"**__ • *"+result.anime.entry[0].start_date+"*  to *"+result.anime.entry[0].end_date+"*\n");
						animeArray.push("**Type:** *"+result.anime.entry[0].type+"*  **Episodes:** *"+result.anime.entry[0].episodes+"*  **Score:** *"+result.anime.entry[0].score+"*");
						animeArray.push(synopsis);
						bot.sendMessage(msg, animeArray);
					});
				}
				else {bot.sendMessage(msg, "No anime found for: \"" + suffix + "\"")}
			});
		}
	},
	"weather": {
		desc: "Get the weather",
		usage: "[usage]",
		delete: true,
		process: function(bot, msg, suffix) {
			if (suffix) {
				suffix = suffix.replace(" ", "");
				var rURL = (/\d/.test(suffix) == false) ? "http://api.openweathermap.org/data/2.5/weather?q=" + suffix + "&APPID=" + options.weather_api_key : "http://api.openweathermap.org/data/2.5/weather?zip=" + suffix + "&APPID=" + options.weather_api_key;
				request(rURL, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						body = JSON.parse(body);
						if (!body.hasOwnProperty("weather")) { return; }
						var msgArray = [];
						msgArray.push("__**Weather for "+body.name+", "+body.sys.country+":**__ • (*"+body.coord.lon+", "+body.coord.lat+"*)")
						msgArray.push("")
						msgArray.push("**Current Temperature:** "+Math.round(body.main.temp - 273.15)+"°C / "+Math.round(((body.main.temp - 273.15)* 1.8)+32)+"°F")
						msgArray.push("**Humidity:** "+body.main.humidity+"%")
						msgArray.push("**Cloudiness:** "+body.clouds.all+"%")
						var sunrise = new Date(body.sys.sunrise*1000)
						var formattedSunrise = (sunrise.getHours()) + ':' + ("0" + sunrise.getMinutes()).substr(-2)
						var sunset = new Date(body.sys.sunset*1000)
						var formattedSunset = (sunset.getHours()) + ':' + ("0" + sunset.getMinutes()).substr(-2)
						msgArray.push("**Sunrise:** "+formattedSunrise+" UTC / **Sunset:** "+formattedSunset+" UTC")
						bot.sendMessage(msg, msgArray);
					} else { console.log(error); }
				});
		}
		else
		{
			bot.sendMessage(msg.channel, "You need to enter a place to get the weather for.")
		}
		}
	}
}
function get_gif(tags, func) {
	//limit=1 will only return 1 gif
	var params = {"api_key": "dc6zaTOxFJmzC", "rating": "r", "format": "json", "limit": 1};
	var query = qs.stringify(params);
	if (tags !== null) {query += "&tag=" + tags.join('+')}
	var request = require("request");
	request("http://api.giphy.com/v1/gifs/random?" + query, function (error, response, body) {
		if (error || response.statusCode !== 200) {
			console.log();(errorC("giphy: Got error: " + body));
			console.log(errorC(error));
		} else {
			try {
				var responseObj = JSON.parse(body)
				func(responseObj.data.id);
			} catch (err) {
				func(undefined);
			}
		}}.bind(this));
}

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

exports.commands = commands;
