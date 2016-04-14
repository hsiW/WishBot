var mod = {
	"moveall": {
		usage: "[channel to move to]",
		delete: true,
    cooldown: 120,
		process: function(bot, msg, suffix) {
			if (!suffix) {
				return false;
			}
			var Voice = msg.channel.server.channels.get("name", suffix);
			var people = msg.channel.server.members;
			people.forEach(user => {
				if (user.voiceChannel != null) {
					setTimeout(function() {
						bot.moveMember(user, Voice, function(err) {
							if (err) console.log(err.stack);
						});
					}, 250);
				}
			});
		}
	},
	"stats": {
		usage: "Prints out stats for this bot",
		delete: true,
    cooldown: 20,
		process: function(bot, msg, suffix, cmdIndex, cmdUsage) {
			var statArray = []
			statArray.push("__**"+bot.user.name + " Stats:**__");
			if(suffix === "servers"){
				var bigServers = bot.servers.filter(s => s.members.length >= 250).length;
				var servers = bot.servers.length - bigServers;
				statArray.push("```ruby\nLarge Server(s): " + bigServers);
				statArray.push("Small Server(s): "+ servers+"```")
			}
			else if (suffix === "channels") {
				var voiceChannels = bot.channels.filter(s => s.type === "voice").length;
				var textChannels = bot.channels.filter(s => s.type === "text").length;
				statArray.push("```ruby\nVoice Channel(s): " + voiceChannels);
				statArray.push("Text Channel(s): " + textChannels);
				statArray.push("Private Channel(s): "+bot.privateChannels.length+"```");
			}
			else if (suffix === "users") {
				var onlineUsers = bot.users.filter(s => s.status === "online").length;
				var afkUsers = bot.users.filter(s => s.status === "idle").length;
				var offlineUsers = bot.users.filter(s => s.status === "offline").length;
				statArray.push("```ruby\nOnline User(s): "+onlineUsers);
				statArray.push("Idle User(s): "+afkUsers);
				statArray.push("Offline User(s): "+offlineUsers+"```");
			}
			else {
				statArray.push("```ruby\nTotal Server(s): "+bot.servers.length)
				statArray.push("Total Channel(s): "+(bot.channels.length + bot.privateChannels.length));
				statArray.push("Total User(s): "+bot.users.length+"");
				statArray.push("Memory Usage: " + (process.memoryUsage().rss / 1024 / 1000).toFixed(2) + "MB")
				var commandUsage = 0;
				for(i = 0; i < cmdUsage.length; i++){commandUsage = commandUsage + cmdUsage[i];}
				statArray.push("Command Total: "+commandUsage+"("+(commandUsage/(Math.round(bot.uptime / 60000))).toFixed(2)+"/m)```");
			}
			bot.sendMessage(msg, statArray);
		}
	},
	"setcolour": {
		usage: "Sets the mentioned users colour to the mentioned hex code\n`setcolour [user mention] [6 digit hexidecimal colour code]`",
		delete: true,
    cooldown: 10,
		process: function(bot, msg, suffix) {
			if (msg.mentions && (parseInt("0x" + (suffix.split(" ")[1]), 16)) && suffix.split(" ")[1].length == 6) {
				var temp = (suffix.split(" ")[1]);
				var colour = temp;
				if (temp.length = [6] && msg.mentions.length === 1) {
					temp = parseInt("0x" + temp, 16);
					bot.createRole(msg.channel.server, {
						position: [1],
						permissions: [0],
						name: "Colour " + colour,
						color: temp
					}).then(function(permission) {
						bot.addMemberToRole(msg.mentions[0].id, permission).then(function() {
							bot.sendMessage(msg, "Applied the colour " + colour + " to " + msg.mentions[0] + ", Senpai!");
						})
					})
				}
			} else {
				bot.sendMessage(msg.author, "You can use http://www.colorpicker.com/ to get a hex colour code");
			}
		}
	}
}

exports.mod = mod;
