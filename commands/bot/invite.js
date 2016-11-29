module.exports = {
    usage: 'Returns the bots invite link to **invite the bot** to your server.',
    aliases: ['inv'],
    cooldown: 30,
    process: msg => {
    	//Returns the link to invite the bot to your server
        return Promise.resolve({
            message: `__**The following link may be used to invite me to your server:**__
**<https://discordapp.com/oauth2/authorize?&client_id=161620224305528833&scope=bot&permissions=67365888>**`
        });
    }
}