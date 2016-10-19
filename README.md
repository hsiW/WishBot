WishBot [![dependencies Status](https://david-dm.org/hsiw/WishBot/status.svg?style=flat-square)](https://david-dm.org/hsiw/WishBot) [![License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000&style=flat-square)](./LICENSE) [![GitHub forks](https://img.shields.io/github/forks/hsiw/WishBot.svg?style=flat-square)](https://github.com/hsiw/WishBot/network) [![GitHub stars](https://img.shields.io/github/stars/hsiw/WishBot.svg?style=flat-square)](https://github.com/hsiw/WishBot/stargazers) [![Discord](https://discordapp.com/api/guilds/136258746123943937/widget.png)](https://discord.gg/0lBiROCNVaGw5Eqk)
====
###How the command system works:
```js
//File should be the name of the command (example test.js will make the command 'test')
module.exports = {
    usage: 'The usage info of the command', //The command usage info that shows up in 'help [commmand]'
    aliases: ['stuff'], //Any command aliases
    dm: false, //Whether the command can work in DM's(private messages) or not
    delete: false, //If the command text should be deleted on use(the text used to invoke the command)
    togglable: false, //If the command can be toggled on or off with the toggle command
    privateGuild: ['81384788765712384'], //Array of server id's which the command is restricted to
    cooldown: 5, //Cooldown for the command(in seconds)
    process: (msg, args, bot) => {
        return new Promise(resolve => {
        	//Whatever function you want here to process the command stuff
        	resolve({
        		message: 'This is a message', //The message content to send
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
[![forthebadge](http://forthebadge.com/images/badges/made-with-crayons.svg)](http://forthebadge.com)
====
**Disclaimer**: No support will currently be given for this code.
