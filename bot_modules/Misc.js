var Discord = require("discord.js");
var cool = require('cool-ascii-faces');
var smug = require("./../lists/smug.json").smug;
var prefix = require("./../options/options.json").prefixes;

var misc = {
	"sing": {
		usage: "This bot prints a song in the current channel",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendMessage(msg, "*:notes: sings a beautiful song about Onii-chan :notes:*");
		}
	},
	"weedle": {
		usage: "This bot prints a weedle in the current channel",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendMessage(msg, "Weedle Weedle Weedle Wee\nhttp://media.giphy.com/media/h3Jm3lzxXMaY/giphy.gif");
		}
	},
	"flamethrower": {
		usage: "This bot prints a flamethrower in the current channel",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendMessage(msg, "(╯°□°)╯︵ǝɯɐlℲ");
		}
	},
	"smug": {
		usage: "This bot prints a random smug image in the current channel",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendFile(msg, smug[Math.floor(Math.random() * (smug.length))]);
		}
	},
	"nyan": {
		usage: "This bot prints a nyan in the current channel",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendFile(msg, "http://i.imgur.com/czx5YDq.gif");
		}
	},
	"lenny": {
		usage: "This bot prints a lenny in the current channel",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendMessage(msg, "( ͡° ͜ʖ ͡°)");
		}
	},
	"shrug": {
		usage: "This bot prints a shrug in the current channel",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendMessage(msg, "¯\\_(ツ)_/¯");
		}
	},
	"wewlad": {
		usage: "This bot prints a wewlad in the current channel(I'm so sorry)",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendFile(msg, "https://blazeti.me/wewlad/wewladtoast.png");
		}
	},
	"lewd": {
		usage: "Use this in case of lewd",
		delete: true,
    cooldown: 5,
		process: function(bot, msg) {
			bot.sendMessage(msg, "http://i.imgur.com/kYwtaCI.gif");
		}
	},
	"sneakylenny": {
		usage: "This bot prints a sneaky lenny in the current channel",
		delete: true,
    cooldown: 5,
		process: function(bot, msg){
			bot.sendMessage(msg, "┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴")
		}
	},
	"dance": {
		usage: "This bot dances around in the current channel using either a random dance or the one mentioned\n`dance [1-4]",
		delete: true,
    cooldown: 5,
		process: function(bot, msg, suffix) {
			var links = ["http://i.imgur.com/Y5uT94n.gif", "http://i.imgur.com/hHtsgeO.gif", "http://i.imgur.com/N8tLq.gif", "https://i.imgur.com/RDsfpp1.gif"]
			if (suffix && /^\d+$/.test(suffix) && links.length >= parseInt(suffix) - 1) {
				bot.sendMessage(msg, ":notes: :dancer: *Dances Around* :dancer: :notes:\n");
				bot.sendMessage(msg, links[suffix - 1]);
			} else {
				bot.sendMessage(msg, ":notes: :dancer: *Dances Around* :dancer: :notes:");
				bot.sendMessage(msg, links[Math.floor(Math.random() * (links.length))]);
			}
		}
	}
}

exports.misc = misc;
