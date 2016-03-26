var ORM = require('postgresql-orm')
var admins = require("./../options/admins.json").admins;

ORM.setup('postgres://nejlpidrnxazcv:CIQDTSP8TqxNkpcPGz5lqjZyYj@ec2-107-22-248-209.compute-1.amazonaws.com:5432/d1rned140s0nod')

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

var serverSettings = ORM.define(serverSettingsDefinition)


function add(msg){
	serverSettings.create({serverID: msg.channel.server.id, Admin: false, Cleverbot: true, Interactions: true, Management: true, Misc: true, Mod: true, Search: true, Utilities: true, WordPlay: true, Prefix: '-'}, function(err, createdEntity){})
	console.log("Added "+msg.channel.server.name+" to Database.");
}

function load(bot, msg){
	serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
		console.log(loadedEntity);
		bot.sendMessage(msg, loadedEntity.Admin);
	})
}

exports.remove = function(bot, msg){
	serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
		serverSettings.delete(loadedEntity,function(err){
			bot.sendMessage(msg, "Server removed from database")
		})
	})
}

/*exports.Settings = function(msg){
	serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
		return loadedEntity;
	});
}*/

exports.Settings = function(msg, callback){
    serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
        if (err) return console.log(err)
        if (typeof(callback) === 'function') callback(loadedEntity);
    });
}

function prefixChange(bot,msg, suffix, postSuffix){
		serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
			if(loadedEntity === null){
				add(msg);
				prefixChange(bot, msg, suffix, postSuffix);
			}
			else{
				serverSettings.update({id: loadedEntity.id, Prefix: postSuffix}, function(err, updatedEntity) {
					serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
						if(loadedEntity.Prefix !== suffix)
						{
							prefixChange(bot,msg,suffix, suffix);
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
			add(msg);
			toggle(bot, msg, suffix);
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
			serverSettings.update({id: loadedEntity.id, Search: !loadedEntity.Utilities}, function(err, updatedEntity) {
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
				else bot.sendMessage(msg, "You toggled the Utilities Module to `"+updatedEntity.Utilities+"`.");
			});
		});
		}
		else if (suffix.toLowerCase() === "wordplay") {
			temp = !loadedEntity.WordPlay;
			serverSettings.update({id: loadedEntity.id, WordPlay: !loadedEntity.WordPlay}, function(err, updatedEntity) {
				serverSettings.load({serverID: msg.channel.server.id}, function(err, loadedEntity){
				if(loadedEntity.WordPlay !== temp){toggleloadedEntity(bot,msg,suffix)}
				else bot.sendMessage(msg, "**"+msg.author.name+"**-senpai toggled the WordPlay Module to `"+updatedEntity.WordPlay+"`.");
			});
		});
		}
		else {
			bot.sendMessage(msg, "I'm sorry **"+msg.author.name+"**-senpai but *"+suffix+"* is not a valid type.")
		}
	})
}

/*
serverSettings.createTable(function(err) {
	console.log(err);
})

// save or update, depending on the presence of an 'id' attribute
serverSettings.save({firstName: 'John'}, function(err, savedEntity) {
})

serverSettings.create({firstName: 'John'}, function(err, createdEntity) {
	// do smthg
})

serverSettings.update({id: 123, lastName: 'Doe'}, function(err, updatedEntity) {
	// do smthg
})

serverSettings.load({id: 123}, function(err, loadedEntity) {
	// do smthg
})
*/
exports.prefixChange = prefixChange;
exports.toggle = toggle;
exports.load = load;
exports.add = add;
