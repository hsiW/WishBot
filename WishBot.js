var Discord = require("discord.js");
var bot = new Discord.Client();
var games = require("./options/games.json").games;
var commands = require("./commands.js").commands;
var admin_commands = require("./admin_commands.js").admin_commands;
var elite_commands = require("./elite_commands.js").elite_commands;
var admins = require("./options/admins.json").admins;
var options = require("./options/options.json");
var prefix = require("./options/options.json").prefixes;
var cleverbot = require("cleverbot-node");
var onee = new cleverbot;
cleverbot.prepare(function () {});
var chalk = require("chalk");
var c = new chalk.constructor({enabled: true});
var serverC = c.black.bold; var channelC = c.green.bold; var userC = c.cyan.bold; var warningC = c.yellow.bold; var errorC = c.red.bold; var botC = c.magenta.bold;
var welcome = [];
var commandsProcessed = 0;
var talked = 0;

bot.on("ready", function (){bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);console.log(botC("@WishBot")+" - Ready to begin! Serving in " + channelC(bot.channels.length) + " channels");});
bot.on("message", function (msg) {
	if (msg.channel.isPrivate && (msg.content[0] === prefix[0] || msg.content[0] === prefix[1])) {bot.sendMessage(msg.author, bot.user + " does not accept commands through private chat."); return;}
	if (msg.channel.isPrivate && msg.author.id != bot.user.id && (/(^https?:\/\/discord\.gg\/[A-Za-z0-9]+$|^https?:\/\/discordapp\.com\/invite\/[A-Za-z0-9]+$)/.test(msg.content))){invite(msg); return;}
	if(msg.author.id === bot.user.id || msg.channel.isPrivate || !(prefix.indexOf(msg.content[0]) > -1 || (msg.content.indexOf(bot.user.mention()) == 0))){return;}
	var suffix = msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2);
	if (msg.content.indexOf(bot.user.mention()) == 0) {
		var text = (msg.cleanContent.split(' ').length > 1) ? msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).replace('@', '') : false;
		console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": " + userC(msg.author.username) + " - " + text);
		bot.startTyping(msg.channel);
		onee.write(suffix, function (response) {console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - 💭 - " + response.message);
		bot.sendMessage(msg, "💭 - " + response.message).then(bot.stopTyping(msg.channel));
		})
		talked += 1;
		return;
	}
	if(msg.content.substring(0,5) === "=help" && !msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles")){ bot.sendMessage(msg.author, "Using Admin Commands requires the **Manage Roles** Permission"); bot.deleteMessage(msg); return;}
	if (prefix.indexOf(msg.content[0]) > -1) {
		var cmdTxt = (msg.content.split(" ")[0].substring(1)).toLowerCase();
		if ((commands[cmdTxt] && msg.content[0] === prefix[0]) ||
		(admin_commands[cmdTxt] && msg.content[0] === prefix[1] && msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles")) ||
		(msg.content[0] === prefix[2] && elite_commands[cmdTxt] && admins.indexOf(msg.author.id) > -1)){
			if (msg.content[0] === prefix[0]){var cmd = commands[cmdTxt]}
			if (msg.content[0] === prefix[1]){var cmd = admin_commands[cmdTxt]}
			if (msg.content[0] === prefix[2]){var cmd = elite_commands[cmdTxt]}
			console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - "+warningC(msg.content[0]+""+cmdTxt) + " was used by " + userC(msg.author.username))
			commandsProcessed += 1;
			cmd.process(bot, msg, suffix, commandsProcessed, talked)
			if(cmd.delete){bot.deleteMessage(msg)}
			return;
		}
	}
});

bot.on("serverDeleted", function(Serverstuff) { console.log(botC("@WishBot")+" - Left server " + serverC(Serverstuff.name)); console.log(botC("@WishBot")+" - Now Serving in " + channelC(bot.channels.length) + " channels");});

//Login
if(options.private){bot.login(process.env.email, process.env.password); console.log("Logged in using " + warningC(process.env.email));}
else{bot.login(options.email, options.password);console.log("Logged in using " + warningC(options.email));}

function invite(msg){
	bot.joinServer(msg.content, function (error, server){
		if (error){bot.sendMessage(msg, "There was an error connecting to that server");}
		else{
			welcome.push("Hello!")
			welcome.push("I'm **WishBot**, better known as "+bot.user+".")
			welcome.push("I was written by **Mᴉsɥ** using *Discord.js.*")
			welcome.push("For information on what I can do use `-help`")
			welcome.push("Admin Commands can be found by using `=help`")
			welcome.push("I was invited by **"+msg.sender.name+"**.")
			welcome.push("If I was wrongfully invited please feel free to kick me.")
			welcome.push("Thanks!")
			bot.sendMessage(msg.author, "Successfully joined "+server.name)
			bot.sendMessage(server.defaultChannel, welcome)
			console.log(serverC("@"+server.name+":")+channelC(" #" + server.defaultChannel.name) + ": " + userC("@WishBot") + " - Joined Server!")
			console.log(botC("@WishBot")+" - Now Serving in " + channelC(bot.channels.length) + " channels")
		}
	});
	welcome = [];
}

//If disconnected try to reconnect
bot.on("disconnected", function () {
console.log(errorC("Disconnected"));
if(!options.private){process.exit(0);}
else{setTimeout(function(){
		console.log(warningC("Attempting to re-connect..."));
		bot.login(options.email, options.password, function (err, token) {
		if (err) { console.log(err); process.exit(0); }
		if (!token) { console.log(errorC("Failed to re-connect")); process.exit(0); }
	});}, 33333);
}});

setTimeout(function(){bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))])}, 999999);
