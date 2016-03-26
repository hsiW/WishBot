var prefix = require("./../options/options.json").prefixes;

var interactions = {
  "smite": {
		usage: "Smites the mentioned user or the message sender if no user mentioned\n`"+prefix[0]+"smite [mentioned user] or [none]`",
		delete: true,
		process: function(bot, msg, suffix) {
			if (!suffix) {
				bot.sendMessage(msg, "**" + msg.sender.name + "** has smited themself using power granted to Bluee by the Cabbage Phoenix.");
			}
			if (suffix && msg.mentions.length === 1) {
				bot.sendMessage(msg, msg.mentions[0] + " has been smited using the power granted to Bluee by the Cabbage Phoenix.");
			}
		}
	},
	"hug": {
		usage: "Hugs the mentioned user or puts a hug if none mentioned\n`"+prefix[0]+"hug [mentioned user] or [none]`",
		delete: true,
		process: function(bot, msg, suffix) {
			if (!suffix) {
				bot.sendMessage(msg, "(>^_^)> <(^.^<)");
			}
			if (suffix && msg.mentions.length === 1) {
				bot.sendMessage(msg, msg.mentions[0] + ", (>^_^)> <(^.^<) ,**" + msg.author.name + "**");
			}
		}
	},
  "poke": {
		usage: "Pokes the mentioned user or pokes this bot if none mentioned\n`"+prefix[0]+"poke [mentioned user] or [none]`",
		delete: true,
		process: function(bot, msg, suffix) {
			var randomPoke = Math.random() < 0.5 ? "http://i.imgur.com/J4Vr0Hg.gif" : "http://i.imgur.com/6KpNE1V.gif";
			if (!suffix) {
				bot.sendMessage(msg, bot.user + " was poked by **" + msg.author.name + "**");
				bot.sendMessage(msg, randomPoke);
			}
			if (suffix && msg.mentions.length === 1) {
				bot.sendMessage(msg, msg.mentions[0] + " was poked by **" + msg.author.name + "**");
				bot.sendMessage(msg, randomPoke);
			}
		}
	},
	"pet": {
		usage: "Pets the mentioned user or pets this bot if none mentioned\n`"+prefix[0]+"pet [mentioned user] or [none]`",
		delete: true,
		process: function(bot, msg, suffix) {
			var links = ["http://i.imgur.com/Y3GB3K1.gif", "http://i.imgur.com/f7ByidM.gif", "http://i.imgur.com/LUpk6b6.gif"]
			if (!suffix) {
				bot.sendMessage(msg, bot.user + " was petted by **" + msg.author.name + "**");
				bot.sendMessage(msg, links[Math.floor(Math.random() * (links.length))]);
			}
			if (suffix && msg.mentions.length === 1) {
				bot.sendMessage(msg, msg.mentions[0] + " was petted by **" + msg.author.name + "**");
				bot.sendMessage(msg, links[Math.floor(Math.random() * (links.length))]);
			}
		}
	}
}

exports.interactions = interactions;
