const utils = require('./utils.js');

module.exports = class Command {
    constructor(name, type, settings) {
        this.name = name; //Command Name
        this.type = type; //Comand Type
        this.usage = settings.usage || 'No Usage Currently Set.'; //Command Usage for in the help message
        this.currentCooldown = {}; //currentlyOnCooldown time for use in coolDown Check
        this.execTimes = 0; //# of Execution times since startup
        this.run = settings.process; //The Function of the command
        this.delete = settings.delete || false; //Setting to delete command on use(true by default)
        this.dm = !(settings.dm === false); //Setting for command to work in DM's(Private messages)(true by default)
        this.cooldown = settings.cooldown || 5; //The cooldown for the command
        this.togglable = !(settings.togglable === false); //Wheather the command is toggable or not with the toggle command(true by default)
        this.aliases = settings.aliases || null //Array of aliases the commmand has(none by default)
        this.privateGuild = settings.privateGuild || null; //Array of guilds the command is resticted to(no restriction by default)
        this.permissions = settings.permissions || null; //Used to define permissions the command requires(none by default)
    }
    //The template help message which is used in `help [cmdName]`
    get help() {
        return `
__**Command Info for:**__ \`${this.name}\`

${this.usage}

${this.aliases !== null ? '**Aliases:** ' + this.aliases.map(a => "\`"+a+"\`").join(', ') +'\n' : ''}${this.permissions !== null ? '**Permissions:** ' + Object.keys(this.permissions).map(p => "\`"+p+"\`").join(', ') +'\n' : ''}**Cooldown:** \`${this.cooldown}s\` | **Delete on Use:** \`${this.delete}\` | **DM:** \`${this.dm}\` | **Uses:** \`${this.execTimes}\``;
    }

    //Command Processing
    exec(msg, args, bot) {
        return new Promise(resolve => { //Commands can take and manipulate the msg object, the command arguments and the bot object 
            //Checks if the command deletes on use as well as if the bot has delete permissions before running the msg deletion
            if (this.delete && msg.channel.guild && msg.channel.permissionsOf(bot.user.id).has('manageMessages')) msg.delete().catch(err => console.log(errorC(err)));
            this.execTimes++; //Adds 1 the current number of execution times(Uses)
            //Run the command
            this.run(msg, args, bot).then(response => {
                if (response.embed !== undefined && msg.channel.guild && !(msg.channel.permissionsOf(bot.user.id).has('embedLinks'))) return; //If command needs embed permissions and bot doesn't have it
                //Main Processing of Command(uses Promises)
                //Commands return a Promise which can contain a 'message, 'upload', 'embed' or 'disableEveryone' to send message being the message content, upload being whatever file you'd like to, embed being a discord embed object or allow the message to mention everyone with @everyone
                //Commands also can return a edit function which allows you to edit messages while also taking the inital sent message object
                //They can also return a delete after 5s boolean which deletes the sent message after 5s
                msg.channel.createMessage({
                    content: response.message ? response.message : '', //Message content
                    embed: response.embed ? response.embed : undefined, //Message embed
                    disableEveryone: response.disableEveryone != null ? response.disableEveryone : undefined //Allow/deny use of @everyone or @here in sendmessages
                }, response.upload).then(message => {
                    if (response.edit) message.edit(response.edit(message)) //Edit sent message 
                    if (response.delete) utils.messageDelete(message); //Check for delete sent message
                }).catch(err => utils.fileLog(err)); //Log to console and file if errored
            })
        })
    }

    //Cooldown Check(returns true if the command shouldn't be processed)
    cooldownCheck(user) {
        //If the user has a currentCooldown
        if (this.currentCooldown.hasOwnProperty(user))
            return true;
        //Set the currentCooldown to now and remove from object when cooldown period is over
        else {
            this.currentCooldown[user] = Date.now();
            setTimeout(() => {
                delete this.currentCooldown[user];
            }, this.cooldown * 1000)
            return false;
        }
    }

    //Function to get the current cooldown time for the user(is used when a command is on cooldown to show the time left til off cooldown)
    cooldownTime(user) {
        return ((this.currentCooldown[user] + (this.cooldown * 1000)) - Date.now()) / 1000;
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

    //Used to check if the user has the correct permissions for the command if it has any additonal permissions
    permissionsCheck(msg) {
        var hasPermssion = true;
        if (this.permissions != null && msg.channel.guild) {
            var permissionKeys = Object.keys(this.permissions),
                userPermissions = msg.channel.permissionsOf(msg.author.id).json;
            for (var key of permissionKeys) {
                if (this.permissions[key] !== userPermissions[key]) {
                    hasPermssion = false;
                    break;
                }
            }
        }
        return hasPermssion;
    }
}