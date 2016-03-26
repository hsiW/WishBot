var prefix = require("./../options/options.json").prefixes;

var management = {
  "ban": {
		usage: "Bans the mentioned user from the server\n`ban [mentioned user]",
		delete: true,
		process: function(bot, msg, suffix) {
      if (!suffix || msg.mentions != 1) {
				bot.sendMessage(msg, "**"+msg.author.name+"**-senpai I am unable to ban "+suffix+".");
			}
			if (suffix && msg.mentions.length === 1) {
				bot.sendMessage(msg.mentions[0], "You have been banned from "+msg.channel.server+". ").then(bot.banMember(msg.mentions[0], msg.channel.server))
        bot.sendMessage(msg, "**"+msg.mentions[0].name+"** has been banned from the server.")
			}
		}
	},
  "kick": {
		usage: "Kicks the mentioned user from the server\n`kick [mentioned user]",
		delete: true,
		process: function(bot, msg, suffix) {
      if (!suffix || msg.mentions != 1) {
				bot.sendMessage(msg, "**"+msg.author.name+"**-senpai I am unable to kick "+suffix+".");
			}
			if (suffix && msg.mentions.length === 1) {
				bot.sendMessage(msg.mentions[0], "You have been kick from "+msg.channel.server.name+". ").then(bot.kickMember(msg.mentions[0], msg.channel.server))
        bot.sendMessage(msg, "**"+msg.mentions[0].name+"** has been kicked from the server.")
			}
		}
	},
  "topic": {
		usage: "Sets the current channel's topic to the mentioned text\n`topic [text]",
		delete: true,
		process: function(bot, msg, suffix) {
      if(!suffix){bot.sendMessage(msg, "You need to enter something to change the topic to, **"+msg.author.name+"**-senpai");}
			bot.setChannelTopic(msg.channel, suffix);
			bot.reply(msg, msg.channel + " had its topic set to " + suffix);
		}
	}
}

exports.management = management;
