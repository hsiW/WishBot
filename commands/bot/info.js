var libVersion = require('./../../node_modules/eris/package.json').version, //The current version of the eris lib gotten from the package.json
    botVersion = require('./../../package.json').version, //The bots version gotten from the package.json
    prefix = require('./../../options/options.json').prefix; //Default bot prefix

module.exports = {
    usage: "Returns **info** about the bot, including a link to the **support server**, a link to the bots **source code** & a link to the bots **documentation**.",
    process: (msg, args, bot) => {
        //returns basic info about the bot
        return Promise.resolve({
            message: `\`\`\`markdown
[WishBot Info](${bot.user.username}) 

# About this Bot
[Main Developer](Mei#5429) 
[Default Prefix](${prefix})
[Bot Version](v${botVersion})
[Discord Library](Eris - v${libVersion})  
 
# Use ${prefix}help a list of the current bot commands.
[Source](https://github.com/hsiw/Wishbot)
[Support Server](https://discord.gg/0lBiROCNVaGw5Eqk)
[Docs](https://github.com/hsiW/WishBot/wiki)
\`\`\`
`
        })
    }
}