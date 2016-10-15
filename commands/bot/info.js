let libVersion = require('./../../node_modules/eris/package.json').version, 
    botVersion = require('./../../package.json').version, 
    prefix = require('./../../options/options.json').prefix; 
 
module.exports = { 
    usage: "Returns basic info about this bot.", 
    cooldown: 30, 
    process: (msg, args, bot) => { 
        return Promise.resolve({ 
            message: `
\`\`\`tex 
$ WishBot \\${bot.user.username}\\ $ 
 
Lib: { Eris - v${libVersion} } 
Version: { v${botVersion} } 
Creator: { Mei#5429 } 
Default Prefix: { ${prefix} } 
 
% Use ${prefix}help for command info. 
% Support Server: https://discord.gg/0lBiROCNVaGw5Eqk 
% Source: https://github.com/hsiw/Wishbot\`\`\`
` 
        }) 
    } 
}//will update to new format later today