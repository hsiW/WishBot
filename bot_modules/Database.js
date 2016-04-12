var ORM = require('postgresql-orm');
var admins = require("./../options/admins.json").admins;
var chalk = require("chalk"), c = new chalk.constructor({enabled: true});
var serverC = c.black.bold, channelC = c.green.bold, userC = c.cyan.bold, warningC = c.yellow.bold, errorC = c.red.bold, botC = c.magenta.bold;
var options = require("./../options/options.json");

ORM.setup(options.database_url);

var serverSettingsDefinition = {
	name: 'servers', // will match table with name 'servers'
	attributes: {
		serverID: {
			type: 'character varying',
		},
		Admin: {
			type: 'boolean'
		},
		Cleverbot: {
			type: 'boolean'
		},
		Interactions: {
			type: 'boolean'
		},
		Management: {
			type: 'boolean'
		},
		Misc: {
			type: 'boolean'
		},
		Mod: {
			type: 'boolean'
		},
		Search: {
			type: 'boolean'
		},
		Utilities: {
			type: 'boolean'
		},
		WordPlay: {
			type: 'boolean'
		},
		Prefix: {
			type: 'char'
		},
	}
}


var serverSettings = ORM.define(serverSettingsDefinition);

function add(msg, callback){
	serverSettings.create({serverID: msg.channel.server.id, Admin: false, Cleverbot: true, Interactions: true, Management: true, Misc: true, Mod: true, Search: true, Utilities: true, WordPlay: true, Prefix: '-'}, function(err, createdEntity) {
		if(err){
			callback(err, null);
			return;
		}
		callback(null, createdEntity)
	});
}

exports.load = function(bot, msg){
	serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
		console.log(loadedEntity);
	})
}

function remove(bot, msg){
	serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
		serverSettings.delete(loadedEntity, function(err){
				if(err) bot.sendMessage(msg, "```"+err+"```");
				else bot.sendMessage(msg, "Server removed from database");
		})
	})
}
exports.remove = remove;

exports.Settings = function(msg, callback){
    serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
        if (err) return console.log(err)
        if (typeof(callback) === 'function') callback(loadedEntity);
    });
}

function prefixChange(bot,msg, suffix){
		serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
			if(loadedEntity === null){
				add(msg, function(err, entity){
					if(err){
						bot.sendMessage(msg, "There was an error doing that, please try again later");
						console.log(err);
						return;
					}
					console.log(serverC(msg.channel.server.name)+" - "+botC("@WishBot")+" - "+errorC("Added Server To Database"));
					prefixChange(bot, msg, suffix);
				})
			}
			else{
				serverSettings.update({id: loadedEntity.id, Prefix: suffix}, function(err, updatedEntity) {
					serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
						if(loadedEntity.Prefix !== suffix)
						{
							prefixChange(bot,msg, suffix);
						}
						else {
							bot.sendMessage(msg, "**"+msg.author.name+"**-senpai has changed the General Command Prefix to `"+updatedEntity.Prefix+"`.");
						}
					});
				});
			}
			});
}

exports.create = function(){
	serverSettings.createTable(function(err) {
		console.log(err);
	})
}

function toggle(bot, msg, suffix){
	serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
		var temp;
		if(loadedEntity === null){
			add(msg, function(err, entity){
				if(err){
					bot.sendMessage(msg, "There was an error doing that, please try again latter");
					console.log(err);
					return;
				}
				console.log(serverC(msg.channel.server.name)+" - "+botC("@WishBot")+" - "+errorC("Added Server To Database"));
				toggle(bot, msg, suffix);
			})
		}
		else if(suffix.toLowerCase() === "admin" && admins.indexOf(msg.author.id) > -1){
			temp = !loadedEntity.Admin;
			serverSettings.update({id: loadedEntity.id, Admin: !loadedEntity.Admin}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.Admin !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the Admin Module to `"+updatedEntity.Admin+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "cleverbot") {
			temp = !loadedEntity.Cleverbot;
			serverSettings.update({id: loadedEntity.id, Cleverbot: !loadedEntity.Cleverbot}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.Cleverbot !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the Cleverbot Module to `"+updatedEntity.Cleverbot+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "interactions") {
			temp = !loadedEntity.Interactions;
			serverSettings.update({id: loadedEntity.id, Interactions: !loadedEntity.Interactions}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.Interactions !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the Interactions Module to `"+updatedEntity.Interactions+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "management") {
			temp = !loadedEntity.Management;
			serverSettings.update({id: loadedEntity.id, Management: !loadedEntity.Management}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.Management !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the Management Module to `"+updatedEntity.Management+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "misc") {
			temp = !loadedEntity.Misc;
			serverSettings.update({id: loadedEntity.id, Misc: !loadedEntity.Misc}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.Misc !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the Misc Module to `"+updatedEntity.Misc+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "mod") {
			temp = !loadedEntity.Mod;
			serverSettings.update({id: loadedEntity.id, Mod: !loadedEntity.Mod}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.Mod !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the Mod Module to `"+updatedEntity.Mod+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "searches") {
			temp = !loadedEntity.Search;
			serverSettings.update({id: loadedEntity.id, Search: !loadedEntity.Search}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.Search !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the Search Module to `"+updatedEntity.Search+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "utilities") {
			temp = !loadedEntity.Utilities;
			serverSettings.update({id: loadedEntity.id, Utilities: !loadedEntity.Utilities}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.Utilities !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the Utilities Module to `"+updatedEntity.Utilities+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "wordplay") {
			temp = !loadedEntity.WordPlay;
			serverSettings.update({id: loadedEntity.id, WordPlay: !loadedEntity.WordPlay}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.WordPlay !== temp){toggle(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the WordPlay Module to `"+updatedEntity.WordPlay+"`.");
			});
		});
		}
		else {
			bot.sendMessage(msg, "I'm sorry **"+msg.author.name+"**-senpai but *"+suffix+"* is not a valid type.")
		}
	})
}

exports.prefixChange = prefixChange;
exports.toggle = toggle;
exports.add = add;
