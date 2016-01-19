//Make sure discord.js is installed
var Discord = require("discord.js");
var bot = new Discord.Client();
var games = require("./bot/games.json").games;
var options = require("./bot/options.json");
var commands = require("./bot/commands.js").commands;
var mod_commands = require("./bot/mod_commands.js").mod_commands;
var fs = require('fs');

var StyledConsole = require('styled-console');
var styledConsole = new StyledConsole;

var cleverbot = require("cleverbot-node");
var onee = new cleverbot;
cleverbot.prepare(function () {});

var servers = getServers();

var lastMessage;//used to store the last message for use in spam detection
var lastAuthor;//used to store the last author for use in spam detection
var commandsProcessed = 0;//used to count the ammount of commands processed in the current session
var talked = 0;//used to count how many times people talked to WishBot in the current session
var rand = 0;//used for randomly pikcing game later on in code


//Does this stuff when the bot is ready and running
bot.on("ready", function ()
{
	checkServers();//checks if servers changed
	bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);//randomly sets a game
	console.log(styledConsole.parse("<c:spurple>Ready to begin! Serving in " + bot.channels.length + " channels"));//tells you that the bot is ready as well as in how many channels
});

//Does this stuff when the bot detects a message, can be in a channel its part of or through a private chat
bot.on("message", function (msg) {
	//Stuff to randomly change the game the bot is playing
	rand = Math.floor((Math.random() * 33) + 1); //Randomly Generates a number and then checks that number to see if it is 1 and if it is the game is randomly changed
	if (rand == 1) {
		var randgame = games[Math.floor(Math.random() * (games.length))];
		bot.setPlayingGame(randgame);
		console.log(styledConsole.parse("<c:syellow>@WishBot</c:syellow> - Randomly changed game to <c:syellow>\"" + randgame + "\""));
	}
	//Start of command checking
	if ((!(msg.channel.isPrivate)) && ((msg.content[0] === options.command_prefix) || (msg.content[0] === options.mod_command_prefix)) && (msg.author.id != bot.user.id)) {
		var cmdTxt = msg.content.split(" ")[0].substring(1);
		var suffix = msg.content.substring(cmdTxt.length + 2);
		if (msg.content[0] === options.command_prefix && commands[cmdTxt]) {
			var cmd = commands[cmdTxt];
			commandsProcessed = commandsProcessed + 1;
			console.log(styledConsole.parse("<c:sgreen>#" + msg.channel.name + ":</c:sgreen> <c:syellow>@WishBot</c:syellow> - " + cmdTxt + " was used by <c:scyan>" + msg.author.username));
			cmd.process(bot, msg, suffix);
		}
		if ((msg.content[0] === options.mod_command_prefix) && (msg.channel.permissionsOf(msg.sender)
				.hasPermission("manageServer")) && mod_commands[cmdTxt]) {
			var cmd = mod_commands[cmdTxt];
			commandsProcessed = commandsProcessed + 1;
			console.log(styledConsole.parse("<c:sgreen>#" + msg.channel.name + ":</c:sgreen> <c:syellow>@WishBot</c:syellow> - " + cmdTxt + " was used by <c:scyan>" + msg.author.username));
			cmd.process(bot, msg, suffix, commandsProcessed, talked);
		}
	}
	if (!(msg.channel.isPrivate) && (msg.content.indexOf(bot.user.mention()) == 0) && (msg.author.id != bot.user.id)) {
		console.log(styledConsole.parse("<c:sgreen>#private:</c:sgreen> <c:scyan>" + msg.author.username + "</c:scyan> - " + msg.content));
		var suffix = msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2);
		var conv = suffix.split(" ");
		bot.startTyping(msg.channel);
		talked = talked + 1;
		onee.write(conv, function (response) {
			console.log(styledConsole.parse("<c:sgreen>#" + msg.channel.name + ":</c:sgreen> <c:syellow>@WishBot</c:syellow> - <c:scyan>🌐</c:scyan> - " + response.message));
			bot.sendMessage(msg.channel, "🌐 - " + response.message);
			bot.stopTyping(msg.channel);
		})
		return;
	}
	if (msg.channel.isPrivate && msg.author.id != bot.user.id) {
		console.log(styledConsole.parse("<c:sgreen>#private:</c:sgreen> <c:scyan>" + msg.author.username + "</c:scyan> - " + msg.content));
		bot.sendMessage(msg.author, bot.user + " does not accept commands through private chat.");
	}
	if (msg.author.id != bot.user.id && !(msg.channel.isPrivate)) {
		console.log(styledConsole.parse("<c:sgreen>#" + msg.channel.name + ":</c:sgreen> <c:scyan>" + msg.author.username + "</c:scyan> - " + msg.content));
	}
	if ((msg.content === lastMessage && !(msg.channel.id === ("87901288729178112"))) && (msg.author.id === lastAuthor)) {
		bot.deleteMessage(msg);
		console.log(styledConsole.parse("<c:syellow>@WishBot</c:syellow> - Deleted message from <c:scyan>" + msg.author.name + "</c:scyan> because it was a duplicate message."));
	}
	if (!(msg.channel.id == ("87901288729178112"))) {
		lastAuthor = msg.author.id;
		lastMessage = msg.content;
	}
});

//Login
bot.login(options.email, options.password);
console.log(styledConsole.parse("<c:syellow>Logged in using " + options.email));

bot.on("disconnected", function () {
console.log(styledConsole.parse("<c:sred>Disconnected"));
		setTimeout(function(){
			console.log(styledConsole.parse("<c:syellow>Attempting to re-connect in..."));
			bot.login(options.email, options.password, function (err, token) {
			if (err) { console.log(err); process.exit(0); }
			if (!token) { console.log(styledConsole.parse("<c:sred>Failed to re-connect")); process.exit(0); }
			});}, 20000);
});
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
