var prefix = require("./../options/options.json").prefixes;
var alias = require("./../options/alias.json");
var db = require("./Database.js");
var admins = require("./../options/admins.json").admins;

var defaults = {
  "alias": {
    usage: "Prints out a list of Command Aliases.",
		delete: true,
		process: function (bot, msg){
			var msgArray = ["The following are the current command aliases:\n```ruby"];
			Object.keys(alias).sort().forEach(function (ali){msgArray.push(alias[ali]+": "+ali);});
			msgArray.push("```\n```ruby\n[command]: [command alias]```\nIf you would like to suggest a new alias please use the `-request` command.")
			bot.sendMessage(msg.author, msgArray);
		}
	},
  "changelog": {
    usage: "Prints out the last 5 changes for this bot.",
		delete: true,
		process: function (bot, msg) {
			bot.getChannelLogs("143904176613752832", 5, function (error, messages) {
				if (error) {console.log("there was an error getting the logs"); return;}
				else {
					var msgArray = ["__**Changelog**__\n"];
					for (i = 4; i >= 0; i--) {
						msgArray.push(messages[i]);
						if(i != 0){msgArray.push("━━━━━━━━━━━━━━━━━━━");}
					}
					bot.sendMessage(msg.author, msgArray)
				}
			});
		}
	},
  "about": {
    usage: "Gives you basic information about this bot.",
		delete: true,
		process: function (bot, msg) {
			var msgArray = [];
			msgArray.push("Hello!")
			msgArray.push("I'm **WishBot**, better known as "+bot.user+".")
			msgArray.push("I was written by **Mᴉsɥ** using *Discord.js.*")
			msgArray.push("My \"server\" can be found by using `-server`.")
			msgArray.push("For information on what I can do use `-help`")
			msgArray.push("Admin Commands can be found by using `=help`")
			msgArray.push("If I was wrongfully invited please feel free to kick me.")
			msgArray.push("Thanks!")
			bot.sendMessage(msg, msgArray)
		}
	},
  "modules": {
    usage: "Lists Currently Enabled/Disabled Modules as well as what each does.",
		delete: true,
		process: function (bot, msg) {
      var enabled = ["__**Enabled Module(s):**__\n"];
      var disabled = ["\n__**Disabled Module(s):**__\n"];
      enabled.push("**Default** - *Enabled by Default*")
      db.Settings(msg, function(loadedEntity) {
        if(!loadedEntity)
        {
          enabled.push("**Cleverbot** - *Talk to "+bot.user.name+"*");
          enabled.push("**WordPlay** - *Use and Manipulate Words*");
          enabled.push("**Interactions** - *Interact with Other Members*");
          enabled.push("**Searches** - *Search Sites for Info or Data*");
          enabled.push("**Utilities** - *Basic Utility Commands*");
          enabled.push("**Misc** - *Miscellaneous Commands*");
          enabled.push("**Mod Utilities** - *Utilities for Mods*");
          enabled.push("**Mod Management** - *Basic Moderating Tools*");
          disabled.push("**Admin Utilities** - *Bot Admin Only Commands*");
        }
        else {
          loadedEntity.Cleverbot ? enabled.push("**Cleverbot** - *Talk to "+bot.user.name+"*") : disabled.push("**Cleverbot** - *Talk to "+bot.user.name+"*");
          loadedEntity.WordPlay ? enabled.push("**WordPlay** - *Use and Manipulate Words*") : disabled.push("**WordPlay** - *Use and Manipulate Words*");
          loadedEntity.Interactions ? enabled.push("**Interactions** - *Interact with Other Members*") : disabled.push("**Interactions** - *Interact with Other Members*");
          loadedEntity.Search ? enabled.push("**Searches** - *Search Sites for Info or Data*") : disabled.push("**Searches** - *Search Sites for Info or Data*");
          loadedEntity.Utilities ? enabled.push("**Utilities** - *Basic Utility Commands*") : disabled.push("**Utilities** - *Basic Utility Commands*");
          loadedEntity.Misc ? enabled.push("**Misc** - *Miscellaneous Commands*") : disabled.push("**Misc** - *Miscellaneous Commands*");
          loadedEntity.Mod ? enabled.push("**Mod Utilities** - *Utilities for Mods*") : disabled.push("**Mod Utilities** - *Utilities for Mods*");
          loadedEntity.Management ? enabled.push("**Mod Management** - *Basic Moderating Tools*") : disabled.push("**Mod Management** - *Basic Moderating Tools*");
          loadedEntity.Admin ? enabled.push("**Admin Utilities** - *Bot Admin Only Commands*") :  disabled.push("**Admin Utilities** - *Bot Admin Only Commands*");
        }
      if(disabled.length === 1){disabled.push("[NONE]")}
      bot.sendMessage(msg,enabled.join('\n')+'\n'+disabled.join('\n'));
    });
    }
	},
  "toggle": {
		usage: "Toggles the currently enabled modules. Not entering a module type with send a message of the options to the message author. Requires the user to have the `manageRoles` premission.\n`toggle [module to toggle]`",
		delete: true,
		process: function(bot, msg, suffix) {
      if(!suffix){
        var msgArray = ["__**Current Modules:**__"];
        msgArray.push("")
        msgArray.push("Cleverbot");
        msgArray.push("Interactions");
        msgArray.push("Misc");
        msgArray.push("Searches");
        msgArray.push("Utilities");
        msgArray.push("WordPlay");
        msgArray.push("Mod");
        msgArray.push("Management");
        bot.sendMessage(msg.author, msgArray);
      }
      else if(msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1)
      {
        db.toggle(bot, msg, suffix);
      }
      else {
        bot.sendMessage(msg, "This command requires the `manageRoles` premission to be used, Sorry.")
      }
		}
	},
  "server": {
    usage: "Prints out a link to this bots help/testing server.",
		delete: true,
		process: function (bot, msg) {bot.sendMessage(msg, "**"+msg.author.username+"**, __**heres a invite to my server:**__ https://discord.gg/0lBiROCNVaDaE8rR");}
	},
  "prefixes": {
    usage: "Prints out the current command prefixes.",
		delete: true,
		process: function (bot, msg) {
      var savedPrefix = prefix[0];
      db.Settings(msg, function(loadedEntity) {
        if(loadedEntity){savedPrefix = loadedEntity.Prefix;}
        var msgArray = ["__**The Current Command Prefixes are:**__"]
        msgArray.push("\n**General Commands:** `"+savedPrefix+"`")
        msgArray.push("**Admin Commands:** `"+prefix[1]+"`")
        msgArray.push("\n To Change the General Command Prefix Use `changeprefix`")
        bot.sendMessage(msg, msgArray);
      });
    }
	},
  "changeprefix":{
    usage: "Changes the current command prefix. Can only be a symbol. Requires the user to have the `manageRoles` premission.\n`changeprefix` [prefix to change to]",
    delete: true,
    process: function(bot, msg, suffix)
    {
      if(suffix.length != 1){
        bot.sendMessage(msg, "Prefix can only be 1 character:\n```ruby\n"+suffix+"```")
        return;
      }
      else if (/[a-z]/i.test(suffix) || suffix === '@')
      {
        bot.sendMessage(msg, "Prefix can not be a letter or @:\n```ruby\n"+suffix+"```");
        return;
      }
      else if (msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1) {
        db.prefixChange(bot, msg, suffix);
        return;
      }
      else {
        bot.sendMessage(msg, "This command requires the `manageRoles` premission to be used, Sorry.");
        return;
      }
    }
  },
  "request":{
    usage: "Sends a feature request to the maker of this bot\n`request [feature to request]`",
		delete: true,
		process: function (bot, msg, suffix) {if(!suffix){return;}bot.sendMessage("142794318837579777", "__Requested by "+msg.author.username+" on the server **"+msg.channel.server.name+"**:__\n"+suffix);}
	},
  "ping": {
    usage: "Pings this bot, useful for checking if the bots working corrently.",
		process: function (bot, msg){
      var processTime = new Date();
      bot.sendMessage(msg, "PONG! | *"+(processTime - msg.timestamp)+" ms*");
    }
	}
}

exports.defaults = defaults;
