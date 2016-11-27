WishBot Core [![Dependant Status](https://david-dm.org/hsiw/WishBot/status.svg?style=flat-square)](https://david-dm.org/hsiw/WishBot) [![License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000&style=flat-square)](./LICENSE) [![GitHub forks](https://img.shields.io/github/forks/hsiw/WishBot.svg?style=flat-square)](https://github.com/hsiw/WishBot/network) [![GitHub stars](https://img.shields.io/github/stars/hsiw/WishBot.svg?style=flat-square)](https://github.com/hsiw/WishBot/stargazers) [![eris](https://img.shields.io/badge/js-eris-blue.svg?style=flat-square)](https://abal.moe/Eris/) [![Discord](https://discordapp.com/api/guilds/136258746123943937/widget.png)](https://discord.gg/0lBiROCNVaGw5Eqk)
====
###How the command system works:
```js
//File should be the name of the command (example test.js will make the command 'test')
//The folder name will define the command type, mod and admin commands require additional permissions
module.exports = {
    usage: 'The usage info of the command', //The command usage info that shows up in 'help [commmand]'
    aliases: ['stuff'], //Any command aliases
    dm: false, //Whether the command can work in DM's(private messages) or not
    delete: false, //If the command text should be deleted on use(the text used to invoke the command)
    togglable: false, //If the command can be toggled on or off with the toggle command
    privateGuild: ['81384788765712384'], //Array of server id's which the command is restricted to
    //Additonal permissons that are required, always use true or it will fail
    //Exact naming can be found https://abal.moe/Eris/docs/reference
    permissions: {
        'manageGuild': true
    },
    cooldown: 5, //Cooldown for the command(in seconds)
    //The message object, the message arguments(command suffix) and the bot object can be passed
    process: (msg, args, bot) => { 
        return new Promise(resolve => {
        	//Whatever function you want here to process the command stuff
        	resolve({
        		message: 'This is a message', //The message content to send
                embed: {}, //Discord embed object, check Discord API docs for info
                disableEveryone: false, //Used to enable @everyone and @here mentions 
        		upload: { //A file to be uploaded(must be a buffer, check wewlad for an example)
        			file: somefile,
        			name: 'test.txt'
        		},
                //Some function that will be used to edit the sent message(check ping for an example)
        		edit: (message) => message.id, 
        		delete: false //Whether or not to delete the sent message after 5s
        	})
        })
    }
}
```
====
[![forthebadge](http://forthebadge.com/images/badges/made-with-crayons.svg)](http://forthebadge.com) [![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
====
**Disclaimer**: No support will currently be given for this code.
