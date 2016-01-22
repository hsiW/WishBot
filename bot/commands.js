var options = require("./options.json");
var Discord = require("discord.js");
var request = require('request');
var xml2js = require('xml2js');
var qs = require("querystring");
var YouTube = require('youtube-node');
var fs = require('fs');
var define = require('define-it').definitions;
var Wiki = require('wikijs');

var chalk = require("chalk");
var c = new chalk.constructor({enabled: true});

var channelC = c.green.bold;
var userC = c.cyan.bold;
var warningC = c.yellow.bold;
var errorC = c.red.bold;
var botC = c.magenta.bold;

var youTube = new YouTube();
youTube.setKey(options.youtube_api_key);

var giphy_config = {
	"api_key": "dc6zaTOxFJmzC",
	"rating": "r",
	"url": "http://api.giphy.com/v1/gifs/random",
	"permission": ["NORMAL"]
};

function correctUsage(cmd) {
	var msg = "Usage: " + options.command_prefix + "" + cmd + " " + commands[cmd].usage;
	return msg;
}

var commands = {
	"help": {
		description: "Sends a DM containing all of the commands.",
		usage: "[command]",
		permLevel: 0,
		process: function (bot, msg, suffix) {
			if(commands[suffix])
			{
				bot.sendMessage(msg.author, correctUsage(suffix))
				bot.deleteMessage(msg);
			}
			else
			{
				var msgArray = [];
				msgArray.push("**Commands: **");
				msgArray.push("```");
				Object.keys(commands).forEach(function (cmd) {
					msgArray.push("" + options.command_prefix + "" + cmd + ": " + commands[cmd].description + "");
				});20
				msgArray.push("```");
				bot.sendMessage(msg.author, msgArray);
				bot.deleteMessage(msg);
			}
		}
	},
	"info": {
		usage: "[none]",
		description: "Gives info about the server",
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
		process: function (bot, msg, suffix) {
			bot.reply(msg, "PONG!");
		}
	},
	"vquote": {
		usage: "[quote message]",
		description: "logs message to quotes chat with voice tag",
		process: function (bot, msg, suffix) {
			if (!suffix)
			{
				bot.reply(msg, "you'll need to have a quote to quote something, Senpai.")
				bot.deleteMessage(msg);
			}
			else
			{
				bot.sendMessage("136558567082819584", "From voice chat: " + suffix)
				bot.deleteMessage(msg);
			}
		}
	},
	"tquote": {
		usage: "[quote message]",
		description: "logs message to quotes chat with text tag",
		process: function (bot, msg, suffix) {
			if(!suffix)
			{
				bot.reply(msg, "you'll need to have a quote to quote something, Senpai.")
				bot.deleteMessage(msg);
			}
			else
			{
				bot.sendMessage("136558567082819584", "From text chat: " + suffix)
				bot.deleteMessage(msg);
			}
		}
	},
	"gif": {
		usage: "[image tags]",
		description: "returns a random gif matching the tags passed",
		process: function (bot, msg, suffix) {
			var tags = suffix.split(" ");
			get_gif(tags, function (id) {
				if (typeof id !== "undefined") {
					bot.sendMessage(msg.channel, "http://media.giphy.com/media/" + id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]");
				} else {
					bot.sendMessage(msg.channel, "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
				}
			});
			bot.deleteMessage(msg);
		}
	},
	"reddit": {
		usage: "[subreddit]",
		description: "Links the top post on /r/all or the top post on the subreddit entered",
		process: function (bot, msg, suffix) {
			var path = "/.rss"
			if (suffix) {
				path = "/r/" + suffix + path;
			}
			rssfeed(bot, msg, "https://www.reddit.com" + path, 1, false);
			bot.deleteMessage(msg);
		}
	},
	"roll": {
		usage: "[max value]",
		description: "returns a random number between 1 and max value. If no max is specified it is 10",
		process: function (bot, msg, suffix) {
			var max = 6;
			if (suffix) max = suffix;
			var roll = Math.floor(Math.random() * max) + 1;
			bot.reply(msg, "you rolled a " + roll + "!");
			bot.deleteMessage(msg);
		}
	},
	"lenny": {
		usage: "[no usage]",
		description: "puts a ( ͡° ͜ʖ ͡°)",
		process: function (bot, msg) {
			bot.sendMessage(msg.channel, "( ͡° ͜ʖ ͡°)");
			bot.deleteMessage(msg);
		}
	},
	"define": {
		usage: "[word to define]",
		description: "Gives the definition of the word mentioned",
		process: function (bot, msg, suffix)
		{
			if(suffix)
			{
				define(suffix, function(err, res) {
				if (err){
					bot.reply("There was an error looking that up.")
				}
				if (res)
				{
					bot.sendMessage(msg.channel,"__The definition of "+suffix+" is:__\n - "+res);
				}
				else
				{
					bot.sendMessage(msg.channel, "Your search for "+suffix+" didn't return any results.")
				}
			});
			}
			else {
				bot.sendMessage(msg.channel, "You need to enter a word to be defined!");
			}
			bot.deleteMessage(msg);
		}
	},
	"wiki": {
		usage: "[information to be brought up]",
		description: "Sometimes returns information from wikipeida based on the suffix",
		process: function (bot, msg, suffix) {
			if(suffix)
			{
            new Wiki().search(suffix,1).then(function(data) {
                new Wiki().page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        var sumText = summary.toString().split('\n');
                            var paragraph = sumText.shift();
                            if(paragraph)
														{
                                bot.sendMessage(msg.channel,"__Wiki info of "+suffix+":__\n"+paragraph);
                            }
                    });
                });
            },function(err){
							console.log(errorC(err));
                bot.reply(msg,"There was an error somewhere.");
            });
			}
			else {
				bot.sendMessage(msg.channel, "You need to enter a word to be defined!");
			}
			bot.deleteMessage(msg);
		}
	},
	"hug": {
        usage: "[no usage]",
        description: "puts a (>^_^)> <(^.^<)",
        process: function (bot, msg, suffix) {
            if (!suffix)
            {
                bot.sendMessage(msg.channel, "(>^_^)> <(^.^<)");
            }
            else {
                msg.mentions.map(function (usr) {
                    bot.sendMessage(msg, msg.author + " (>^_^)> <(^.^<) " + "<@" + usr.id + ">");
                });
            }
            bot.deleteMessage(msg);
        }
    },
	"flamethrower": {
		usage: "[no usage]",
		description: "puts a (╯°□°)╯︵ǝɯɐlℲ",
		process: function (bot, msg) {
			bot.sendMessage(msg.channel, "(╯°□°)╯︵ǝɯɐlℲ");
			bot.deleteMessage(msg);
		}
	},
	"sing": {
		usage: "[no usage]",
		description: "sings a lovely song",
		process: function (bot, msg) {
			bot.sendMessage(msg.channel, "*🎵sings a beautiful song about Onii-chan🎵*");
			bot.deleteMessage(msg);
		}
	},
	"weedle": {
		usage: "[no usage]",
		description: "weedle weedle weedle wee",
		process: function (bot, msg) {
			bot.sendMessage(msg.channel,"Weedle Weedle Weedle Wee");
			bot.sendMessage(msg.channel, "http://media.giphy.com/media/h3Jm3lzxXMaY/giphy.gif");
			bot.deleteMessage(msg);
		}
	},
	"letsplay": {
		usage: "[game]",
		description: "Tells everyone to play a game.",
		process: function (bot, msg, suffix) {
			if (suffix) {
				bot.sendMessage(msg.channel, ":video_game: @everyone, " + msg.author + " would like to play " + suffix + "!");
				bot.deleteMessage(msg);
			} else {
				bot.sendMessage(msg.channel, ":video_game: @everyone, " + msg.author + " would like to play a game!");
				bot.deleteMessage(msg);
			}
		}
	},
	"call": {
		usage: "[none]",
		description: "Tells everyone you want to call.",
		process: function (bot, msg, suffix) {
			bot.sendMessage(msg.channel, ":phone: @everyone, " + msg.author + " would like to have a call!");
			bot.deleteMessage(msg);
		}
	},
	"randomquote": {
		usage: "[none]",
		description: "Tells everyone you want to call.",
		process: function (bot, msg)
		{
			bot.getChannelLogs("136558567082819584", 100, function(error,messages)
			{
			if(error)
			{
				console.log(error);
				console.log("there was an error getting the logs");
				return;
			}
			else
			{
				var rand = Math.floor((Math.random() * messages.length) + 1);
				bot.sendMessage(msg.channel,messages[rand]);
			}
			bot.deleteMessage(msg);
		});
	}
	},
	"youtube": {
		usage: "[topic]",
		description: "Probably gives you a link to the first result of the searched term.",
		process: function (bot, msg, suffix) {
			youTube.search(suffix, 10, function (error, result)
			{
				if (error || !result || !result.items || result.items.length < 1) {
					console.log(errorC(error));
					bot.sendMessage(msg.channel, "Your search resulted in an error. Please forgive me senpai! ;-;");
				}
				else {
					if (typeof result.items[0].id.videoId === "undefined")
					{
						for(i = 1; i < result.items.length; i++)
						{
							if(typeof result.items[i].id.videoId !== "undefined")
							{
									bot.sendMessage(msg.channel, "http://www.youtube.com/watch?v=" + result.items[i].id.videoId);
									bot.deleteMessage(msg);
									return;
							}
						}
					}
					else
					{
						bot.sendMessage(msg.channel, "http://www.youtube.com/watch?v=" + result.items[0].id.videoId);
					}
				}
				bot.deleteMessage(msg);
			});
		}
	},
	"avatar": {
		usage: "outputs the avatar of the user of the command or the person linked.",
		description: "Outputs an avatar url",
		process: function (bot, msg, suffix) {
			if (!suffix) {
				bot.reply(msg, msg.author.avatarURL);
			}
			else {
				msg.mentions.map(function (usr) {
					bot.reply(msg, usr.username + "'s avatar is " + usr.avatarURL);
				});
			}
			bot.deleteMessage(msg);
		}
	},
	"id": {
		usage: "outputs the id of the user of the command or the person linked.",
		description: "Outputs an id",
		process: function (bot, msg, suffix) {
			if (!suffix) {
				bot.reply(msg, "your id is ```" + msg.author.id + "```");
			} else {
				msg.mentions.map(function (usr) {
					bot.reply(msg, usr.username + "'s id is ```" + usr.id + "```");
				});
			}
			bot.deleteMessage(msg);
		}
	},
	"anime": {
		usage: "[no usage]",
		description: "Gives information about the anime mentioned",
		process: function (bot, msg, suffix) {
			var anime = msg.content.split(" ").slice(1).join("+");
			var apiURL = "http://myanimelist.net/api/anime/search.xml?q=" + anime;
			request(apiURL, {
				"auth": {
					"user": "hsiw",
					"pass": "RrzY3ykoK>4^^SKUK6sHCOwZ^mwY#1",
					"sendImmediately": true
				}
			}, function (error, response, body) {
				if (error) {
					console.log(errorC(error));
				}
				if (!error && response.statusCode == 200) {
					xml2js.parseString(body, function (err, result) {
						var id = result.anime.entry[0].id;
						var title = result.anime.entry[0].title;
						var english = result.anime.entry[0].english;
						var ep = result.anime.entry[0].episodes;
						var score = result.anime.entry[0].score;
						var type = result.anime.entry[0].type;
						var status = result.anime.entry[0].status;
						var synopsis = result.anime.entry[0].synopsis.toString();
						var image = result.anime.entry[0].image.toString();
						synopsis = synopsis.replace(/&mdash;/g, "—");
						synopsis = synopsis.replace(/<br \/>/g, " ");
						synopsis = synopsis.replace(/&quot;/g, "\"");
						synopsis = synopsis.substring(0, 300);
						bot.sendMessage(msg, "**" + title + " / " + english + "**\n**Type:** " + type + ", **Episodes:** " + ep + ", **Status:** " + status + ", **Score:** " + score + "\n" + synopsis + "\n http://myanimelist.net/anime/" + id);
					});
				} else {
					bot.sendMessage(msg, "No anime found for: \"" + suffix + "\"");
				}
			});
		}

	}
};

function get_gif(tags, func) {
	//limit=1 will only return 1 gif
	var params = {
		"api_key": giphy_config.api_key,
		"rating": giphy_config.rating,
		"format": "json",
		"limit": 1
	};
	var query = qs.stringify(params);

	if (tags !== null) {
		query += "&tag=" + tags.join('+')
	}

	var request = require("request");
	request(giphy_config.url + "?" + query, function (error, response, body) {
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
		}
	}.bind(this));
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
