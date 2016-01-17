//Make sure discord.js is installed
var Discord = require("discord.js");
var bot = new Discord.Client();

var games = require ("./bot/games.json").games;
var options = require("./bot/options.json");
var commands = require ("./bot/commands.js").commands;
var mod_commands = require ("./bot/mod_commands.js").mod_commands;
var fs = require('fs');

var cleverbot = require("cleverbot-node");
var onee = new cleverbot;
cleverbot.prepare(function(){});

var servers = getServers();

var lastMessage;
var lastAuthor;
var commandsProcessed = 0;
var talked = 0;
var rand = 0;


bot.on("ready", function ()
{
	checkServers();
	bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
  console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});


bot.on("message", function (msg)
{
	rand = Math.floor((Math.random() * 100) + 1);
	if (rand == 1) {

	    bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
			console.log("Randomly changed game");
	}
	console.log("#"+msg.channel.name+": "+msg.author.username+" - "+msg.content);
	if (!(msg.channel.isPrivate))
	{
		if((msg.author.id != bot.user.id && (msg.content[0] === options.command_prefix || msg.content.indexOf(bot.user.mention()) == 0)))
		{
			var cmdTxt = msg.content.split(" ")[0].substring(1);
	    var suffix = msg.content.substring(cmdTxt.length+2);
			if(msg.content.indexOf(bot.user.mention()) == 0)
			{
				var conv = suffix.split(" ");
				bot.startTyping(msg.channel);
        talked = talked + 1;
				onee.write(conv, function (response)
				{
					bot.sendMessage(msg.channel,"🌐 - "+ response.message);
					bot.stopTyping(msg.channel);
				})
				return;
			}
			if(commands[cmdTxt])
			{
				var cmd = commands[cmdTxt];
				commandsProcessed = commandsProcessed + 1;
				cmd.process(bot,msg,suffix);
		 }
		}
	if(((msg.author.id != bot.user.id && (msg.content[0] === options.mod_command_prefix)) && msg.channel.permissionsOf(msg.sender).hasPermission("manageServer")))
		{
			var cmdTxt = msg.content.split(" ")[0].substring(1);
	    var suffix = msg.content.substring(cmdTxt.length+2);
			if(mod_commands[cmdTxt])
			{
				var cmd = mod_commands[cmdTxt];
				commandsProcessed = commandsProcessed + 1;
				cmd.process(bot,msg,suffix,commandsProcessed,talked);
		 }
		}
		if((msg.content === lastMessage && !(msg.channel.id === ("87901288729178112"))) && (msg.author.id === lastAuthor))
		{
			bot.deleteMessage(msg);
			console.log("Deleted message from "+msg.author.name+" because it was a duplicate of the last message.");
		}
		if(!(msg.channel.id == ("87901288729178112")))
			{
				lastAuthor = msg.author.id;
				lastMessage = msg.content;
			}
			if(msg.content === "http://www.youtube.com/watch?v=undefined")
			{
				bot.deleteMessage(msg);
				bot.sendMessage(msg.channel,"Your search resulted in an error. Please forgive me senpai! ;-;")
			}
	}
});

//Login
bot.login(options.email, options.password);
console.log("Logged in using " +options.email);


//Server Functions
function updateServers() {
	fs.writeFile("./bot/servers.json", JSON.stringify(servers, null, '\t'), null);
	servers = getServers();
}

function getServers()
{
  var svrs = require("./bot/servers.json");
  return svrs;
}

function addServer(svr) {
	if (svr.members.length < 101) { var user_c = 1; var s_g = 1; }
	else { var user_c = 0; var s_g = 0; }
	var setngs = {
		"username_change": user_c,
		//"server_greeting": s_g,
	}
	servers[svr.id] = setngs;
	updateServers();
}

function checkServers()
{
	bot.servers.forEach(function (ser) {
		if (servers.hasOwnProperty(ser.id)) {
		} else {
			addServer(ser);
		}
	});
}
