var ORM = require('postgresql-orm');
var options = require("./../options/options.json");
var chalk = require("chalk"), c = new chalk.constructor({enabled: true});
var serverC = c.black.bold, channelC = c.green.bold, userC = c.cyan.bold, warningC = c.yellow.bold, errorC = c.red.bold, botC = c.magenta.bold;
ORM.setup(options.ignored_url);

var userSettingsDefinition = {
	name: 'users',
	attributes:{
		userID:{
			type: 'character varying'
		}
	}
}

var userSettings = ORM.define(userSettingsDefinition);

function add(suffix, callback){
  userSettings.load({userID: suffix}, function(err, loadedUser){
    if(loadedUser !== null) return;
    else{
    userSettings.create({userID: suffix}, function(err, createdEntity) {
		if(err){
			callback(err, null);
			return;
		}
		callback(null, createdEntity)
	});
}
});
}

function ignore(bot, msg, suffix){
  add(suffix, function(err, entity){
    if(err){
      bot.sendMessage(msg, "There was an error doing that, please try again later");
      console.log(err);
      return;
    }
    console.log(userC(suffix)+" - "+botC("@WishBot")+" - "+errorC("Added User to Ignore"));
  })
}

exports.ignore = ignore;

function unignore(bot, msg, suffix){
  userSettings.load({userID: suffix}, function(err, loadedEntity){
    if (loadedEntity === null) {
      bot.sendMessage(msg, "`"+suffix+"` is not currently being ignored.")
    }
    else {
      userSettings.delete(loadedEntity, function(err){
        if(!err) bot.sendMessage(msg, "Successfully removed `"+suffix+"` from ignore.")
        else bot.sendMessage(msg, "ERROR: ```"+err+"```")
      })
    }
  })
}

exports.unignore = unignore;

exports.create = function(){
	userSettings.createTable(function(err) {
		console.log(err);
	})
}
exports.Settings = function(msg, callback){
    userSettings.load({userID: msg.author.id}, function(err, loadedEntity){
        if (err) return console.log(err)
        if (typeof(callback) === 'function') callback(loadedEntity);
    });
}
