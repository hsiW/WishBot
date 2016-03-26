var Discord = require("discord.js");
var cool = require('cool-ascii-faces');
var smug = require("./../")
var prefix = require("./../options/options.json").prefixes;

var misc = {
	"sing": {
		usage: "This bot prints a song in the current channel",
		delete: true,
		process: function(bot, msg) {
			bot.sendMessage(msg, "*🎵sings a beautiful song about Onii-chan🎵*");
		}
	},
	"weedle": {
		usage: "This bot prints a weedle in the current channel",
		delete: true,
		process: function(bot, msg) {
			bot.sendMessage(msg, "Weedle Weedle Weedle Wee\nhttp://media.giphy.com/media/h3Jm3lzxXMaY/giphy.gif");
		}
	},
	"flamethrower": {
		usage: "This bot prints a flamethrower in the current channel",
		delete: true,
		process: function(bot, msg) {
			bot.sendMessage(msg, "(╯°□°)╯︵ǝɯɐlℲ");
		}
	},
	"nyan": {
		usage: "This bot prints a nyan in the current channel",
		delete: true,
		process: function(bot, msg) {
			bot.sendFile(msg, "http://i.imgur.com/czx5YDq.gif");
		}
	},
	"lenny": {
		usage: "This bot prints a lenny in the current channel",
		delete: true,
		process: function(bot, msg) {
			bot.sendMessage(msg, "( ͡° ͜ʖ ͡°)");
		}
	},
	"shrug": {
		usage: "This bot prints a shrug in the current channel",
		delete: true,
		process: function(bot, msg) {
			bot.sendMessage(msg, "¯\\_(ツ)_/¯");
		}
	},
	"wewlad": {
		usage: "This bot prints a wewlad in the current channel(I'm so sorry)",
		delete: true,
		process: function(bot, msg) {
			bot.sendFile(msg, "https://blazeti.me/wewlad/wewladtoast.png");
		}
	},
	"lewd": {
		usage: "This bot prints a lewd in the current channel",
		delete: true,
		process: function(bot, msg) {
			bot.sendMessage(msg, "http://i.imgur.com/kYwtaCI.gif");
		}
	},
	"dance": {
		usage: "This bot dances around in the current channel using either a random dance or the one mentioned\n`"+prefix[0]+"dance [1-4]",
		delete: true,
		process: function(bot, msg, suffix) {
			var links = ["http://i.imgur.com/Y5uT94n.gif", "http://i.imgur.com/hHtsgeO.gif", "http://i.imgur.com/N8tLq.gif", "https://i.imgur.com/RDsfpp1.gif"]
			if (suffix && /^\d+$/.test(suffix) && links.length >= parseInt(suffix) - 1) {
				bot.sendMessage(msg, ":musical_note: :dancer: *Dances Around* :dancer: :musical_note:\n");
				bot.sendMessage(msg, links[suffix - 1]);
			} else {
				bot.sendMessage(msg, ":musical_note: :dancer: *Dances Around* :dancer: :musical_note:");
				bot.sendMessage(msg, links[Math.floor(Math.random() * (links.length))]);
			}
		}
	}
}

exports.misc = misc;
