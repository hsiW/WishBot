WishBot [![License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000&style=flat-square)](./LICENSE) [![David](https://img.shields.io/david/hsiw/WishBot.svg?maxAge=2592000&style=flat-square)](https://david-dm.org/hsiw/WishBot) [![Code Climate](https://codeclimate.com/github/hsiw/WishBot/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/hsiw/WishBot) [![Discord](https://discordapp.com/api/guilds/136258746123943937/widget.png)](https://discord.gg/0lBiROCNVaGw5Eqk)
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
    cooldown: 5, //Command cooldown(in seconds)
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
