let libVersion = require('./../../node_modules/eris/package.json').version,
    botVersion = require('./../../package.json').version,
    prefix = require('./../../options/options.json').prefix;

module.exports = {
    usage: "Returns info about the bot, including a link to the support server as well as a link to the bots source code.",
    delete: false,
    cooldown: 10,
    process: (msg, args, bot) => {
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
\`\`\`
`
        })
    }
}