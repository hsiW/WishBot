//Make sure discord.js is installed
var Discord = require("discord.js");
var bot = new Discord.Client();
var games = require("./bot/games.json").games;
var options = require("./bot/options.json");
var commands = require("./bot/commands.js").commands;
var mod_commands = require("./bot/mod_commands.js").mod_commands;
var fs = require('fs');

var cleverbot = require("cleverbot-node");
var onee = new cleverbot;
cleverbot.prepare(function () {});

var chalk = require("chalk");
var c = new chalk.constructor({enabled: true});
var serverC = c.black.bold;
var channelC = c.green.bold;
var userC = c.cyan.bold;
var warningC = c.yellow.bold;
var errorC = c.red.bold;
var botC = c.magenta.bold;

var lastMessage = new Object();//used to store the last message for use in spam detection
var commandsProcessed = 0;//used to count the ammount of commands processed in the current session
var talked = 0;//used to count how many times people talked to WishBot in the current session

//Does this stuff when the bot is ready and running
bot.on("ready", function ()
{
	bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);//randomly sets a game
	console.log(botC("@WishBot")+" - Ready to begin! Serving in " + channelC(bot.channels.length) + " channels");//tells you that the bot is ready as well as in how many channels
});

//Does this stuff when the bot detects a message, can be in a channel its part of or through a private chat
bot.on("message", function (msg) {
	if (msg.content === lastMessage.text && msg.author.id === lastMessage.lastAuthor  && msg.channel.id === lastMessage.channel)
	{bot.deleteMessage(msg).then(console.log(serverC(botC("@WishBot")+" - Deleted message from " + userC(msg.author.name) + " because it was a duplicate message.")))}
	if(msg.author.id == bot.user.id){return;}
	var suffix = msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2);
	if (!(msg.channel.isPrivate) && (msg.content.indexOf(bot.user.mention()) == 0)) {
		console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": " + userC(msg.author.username) + " - " + msg.content);
		bot.startTyping(msg.channel);
		talked = talked + 1;
		onee.write(suffix, function (response) {
			console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - 🌐 - " + response.message);
			bot.sendMessage(msg.channel, "🌐 - " + response.message).then(bot.stopTyping(msg.channel));
		})
		return;
	}
	if (msg.channel.isPrivate && msg.author.id != bot.user.id) {bot.sendMessage(msg.author, bot.user + " does not accept commands through private chat.")}
	if (!(msg.channel.isPrivate) && ((msg.content[0] === options.command_prefix) || (msg.content[0] === options.mod_command_prefix)) && (msg.author.id != bot.user.id)) {
		var cmdTxt = msg.content.split(" ")[0].substring(1);
		if ((commands[cmdTxt] && msg.content[0] === options.command_prefix) || (mod_commands[cmdTxt] && msg.content[0] === options.mod_command_prefix && msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles")))
		{
			commandsProcessed = commandsProcessed + 1;
			if (commands[cmdTxt] && msg.content[0] === options.command_prefix){var cmd = commands[cmdTxt]}
			if (mod_commands[cmdTxt] && msg.content[0] === options.mod_command_prefix){var cmd = mod_commands[cmdTxt]}
			console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - "+warningC(cmdTxt) + " was used by " + userC(msg.author.username));
			bot.sendMessage("@"+msg.channel.server.name+": #" + msg.channel.name + ": @WishBot - `" + cmdTxt + "` was used by " + msg.author.username).then(cmd.process(bot, msg, suffix, commandsProcessed, talked));
			if(cmd.delete){bot.deleteMessage(msg)}
		}
	}
	if (msg.channel.id != ("87901288729178112")) {lastMessage = {text:msg.content, lastAuthor:msg.author.id, channel:msg.channel.id}}
	if (Math.floor((Math.random() * 33) + 1) == 1) {bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))])}
	else if (msg.author.id != bot.user.id && !(msg.channel.isPrivate)) {console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": " + userC(msg.author.username) + " - " + msg.content)}
});

//Login
bot.login(options.email, options.password);
console.log("Logged in using " + warningC(options.email));

bot.on("disconnected", function () {
console.log(errorC("Disconnected"));
		setTimeout(function(){
			console.log(warningC("Attempting to re-connect..."));
			bot.login(options.email, options.password, function (err, token) {
			if (err) { console.log(err); process.exit(0); }
			if (!token) { console.log(errorC("Failed to re-connect")); process.exit(0); }
		});}, 33333);
});
