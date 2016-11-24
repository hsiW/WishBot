const utils = require('./utils.js');

module.exports = class Command {
    constructor(name, type, settings) {
        this.name = name; //Command Name
        this.type = type; //Comand Type
        this.usage = settings.usage || 'No Usage'; //Command Usage for in the help message
        this.currentCooldown = {}; //currentlyOnCooldown time for use in coolDown Check
        this.execTimes = 0; //# of Execution times since startup
        this.run = settings.process; //The Function of the command
        this.delete = !!settings.delete; //Setting to delete command on use(true by default)
        this.dm = !!settings.dm; //Setting for command to work in DM's(Private messages)(true by default)
        this.cooldown = settings.cooldown || 0; //The cooldown for the command
        this.togglable = !!settings.togglable; //Wheather the command is toggable or not with the toggle command(true by default)
        this.aliases = settings.aliases || null //Array of aliases the commmand has(none by default)
        this.privateGuild = settings.privateGuild || null; //Array of guilds the command is resticted to(no restriction by default)
    }
    //The template help message which is used in `help [cmdName]`
    get help() {
        return `
__**Command Info for:**__ \`${this.name}\`

${this.usage}

${this.aliases !== null ? '**Aliases:** '+(this.aliases.map(a=> "\`"+a+"\`").join(', ') +'\n') : ''}**Cooldown:** \`${this.cooldown}s\` | **Delete on Use:** \`${this.delete}\` | **DM:** \`${this.dm}\` | **Uses:** \`${this.execTimes}\``;
    }

    //Function to get the current cooldown time for the user(is used when a command is on cooldown to show the time left til off cooldown)
    cooldownTime(user) {
        return ((this.currentCooldown[user] + (this.cooldown * 1000)) - Date.now()) / 1000;
    }

    //Command Processing
    exec(msg, args, bot) {
        return new Promise(resolve => { //Commands can take and manipulate the msg object, the command arguments and the bot object 
            //Checks if the command deletes on use as well as if the bot has delete permissions before running the msg deletion
            if (this.delete && msg.channel.guild && msg.channel.permissionsOf(bot.user.id).has('manageMessages')) msg.delete();
            this.execTimes++; //Adds 1 the current number of execution times(Uses)
            this.run(msg, args, bot).then(response => resolve(response)).catch(err => utils.fileLog(err)); //Log to console and file if errored
        })
    }

    //Cooldown Check(returns true if the command shouldn't be processed)
    cooldownCheck(user) {
        //If the user has a currentCooldown
        if (this.currentCooldown.hasOwnProperty(user)) //If the user last used the command within the cooldown period return true
            return true;
        else {
            this.currentCooldown[user] = Date.now();
            setTimeout(() => {
                delete this.currentCooldown[user]
            }, this.cooldown * 1000)
            return false;
        }
    }

    //Private Server Command Check(returns true if command shouldn't be processed)
    privateCheck(msg) {
        if (this.privateGuild === null) //If the command doesn't have a private server array return false
            return false;
        else if (!msg.channel.guild) //Prevents private server commands from working in DM's by returning true if not used in a guild
            return true;
        else if (this.privateGuild.indexOf(msg.channel.guild.id) > -1) //Guild is in the array of privateServers so return false
            return false;
        else //If all else fails return true
            return true;
    }
}