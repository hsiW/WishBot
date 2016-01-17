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

var servers = getServers();

var lastMessage;
var lastAuthor;
var commandsProcessed = 0;
var talked = 0;
var rand = 0;

bot.on("ready", function () {
	checkServers();
	bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("message", function (msg) {
	//Stuff to randomly change the game the bot is playing
	rand = Math.floor((Math.random() * 33) + 1); //Randomly Generates a number and then checks that number to see if it is 1 and if it is the game is randomly changed
	if (rand == 1) {
		var randgame = games[Math.floor(Math.random() * (games.length))];
		bot.setPlayingGame(randgame);
		console.log("@WishBot - Randomly changed game to \"" + randgame + "\"");
	}
	//Start of command checking
	if ((!(msg.channel.isPrivate)) && ((msg.content[0] === options.command_prefix) || (msg.content[0] === options.mod_command_prefix)) && (msg.author.id != bot.user.id)) {
		var cmdTxt = msg.content.split(" ")[0].substring(1);
		var suffix = msg.content.substring(cmdTxt.length + 2);
		if (msg.content[0] === options.command_prefix && commands[cmdTxt]) {
			var cmd = commands[cmdTxt];
			commandsProcessed = commandsProcessed + 1;
			console.log("#" + msg.channel.name + ": @WishBot - " + cmdTxt + " was used by " + msg.author.username);
			cmd.process(bot, msg, suffix);
		}
		if ((msg.content[0] === options.mod_command_prefix) && (msg.channel.permissionsOf(msg.sender)
				.hasPermission("manageServer")) && mod_commands[cmdTxt]) {
			var cmd = mod_commands[cmdTxt];
			commandsProcessed = commandsProcessed + 1;
			console.log("#" + msg.channel.name + ": @WishBot - " + cmdTxt + " was used by " + msg.author.username);
			cmd.process(bot, msg, suffix, commandsProcessed, talked);
		}
	}
	if (!(msg.channel.isPrivate) && (msg.content.indexOf(bot.user.mention()) == 0)) {
		console.log("#" + msg.channel.name + ": " + msg.author.username + " - " + msg.content);
		var suffix = msg.content.substring((msg.content.split(" ")[0].substring(1))
			.length + 2);
		var conv = suffix.split(" ");
		bot.startTyping(msg.channel);
		talked = talked + 1;
		onee.write(conv, function (response) {
			console.log("#" + msg.channel.name + ": @WishBot - 🌐 - " + response.message);
			bot.sendMessage(msg.channel, "🌐 - " + response.message);
			bot.stopTyping(msg.channel);
		})
		return;
	}
	if (msg.author.id != bot.user.id) {
		console.log("#" + msg.channel.name + ": " + msg.author.username + " - " + msg.content);
	}
	if (msg.channel.isPrivate && msg.author.id != bot.user.id) {
		console.log("#private: " + msg.author.username + " - " + msg.content);
		bot.sendMessage(msg.author, bot.user + " does not accept commands through private chat.");
	}
	if ((msg.content === lastMessage && !(msg.channel.id === ("87901288729178112"))) && (msg.author.id === lastAuthor)) {
		bot.deleteMessage(msg);
		console.log("@WishBot - Deleted message from " + msg.author.name + " because it was a duplicate message.");
	}
	if (!(msg.channel.id == ("87901288729178112"))) {
		lastAuthor = msg.author.id;
		lastMessage = msg.content;
	}
});

//Login
bot.login(options.email, options.password);

bot.on("disconnected", function () {
console.log("Disconnected");
		setTimeout(function(){
			console.log("info", "Attempting to log in...");
			bot.login(process.env.email, process.env.password, function (err, token) {
			if (err) { console.log(err); process.exit(0); }
			if (!token) { console.log("Failed to re-connect"); process.exit(0); }
			});}, 20000);
});

console.log("Logged in using " + options.email);
//Server Functions
function updateServers() {
	fs.writeFile("./bot/servers.json", JSON.stringify(servers, null, '\t'), null);
	servers = getServers();
}

function getServers() {
	var svrs = require("./bot/servers.json");
	return svrs;
}

function addServer(svr) {
	if (svr.members.length < 101) {
		var user_c = 1;
		var s_g = 1;
	} else {
		var user_c = 0;
		var s_g = 0;
	}
	var setngs = {
		"username_change": user_c,
		//"server_greeting": s_g,
	}
	servers[svr.id] = setngs;
	updateServers();
}

function checkServers() {
	bot.servers.forEach(function (ser) {
		if (servers.hasOwnProperty(ser.id)) {} else {
			addServer(ser);
		}
	});
}
