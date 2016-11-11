module.exports = {
    usage: 'Send a **feature request** to the Bot Developer. Requests can have a max length of **1750 characters**. Meme & NSFW requests will be **ignored**.\n\n`request [feature to request]`',
    dm: false,
    cooldown: 60,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            //If nothing is requested yell at the user for not doing so
            if (!args) resolve({
                    message: `You must enter something to be requested, **${msg.author.username}**-senpai`,
                    delete: true
                })
                //If the request is potentially to large tell the user so
            else if (args.length > 1750) resolve({
                message: `Requests cannot be over 1750 characters, sorry **${msg.author.username}**-senpai`,
                delete: true
            })
            else {
                //Create a message in the featureRequest channel in the Yuki-chan server with the users request
                bot.createMessage('142794318837579777', `**${msg.channel.guild.name}**(*${msg.channel.guild.id}*) - **${msg.author.username}**(*${msg.author.id}*)
\`\`\`${args}\`\`\``).then(() => resolve({
                    //Tell the user that their request was successfully sent to the request channel on promise resolve
                    message: `Your request for **'${args}'** was successfully sent, **${msg.author.username}**-senpai.`
                }))
            }
        });
    }
}