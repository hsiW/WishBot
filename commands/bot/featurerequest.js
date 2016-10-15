module.exports = {
    usage: 'Sends a feature request to the maker of the bot.\n`request [feature to request]`',
    dm: false,
    cooldown: 60,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            if (!args) resolve({
                message: `You must enter something to be requested, **${msg.author.username}**-senpai`,
                delete: true
            })
            else if (args.length > 1750) resolve({
                message: `Requests cannot be over 1750 characters, sorry **${msg.author.username}**-senpai`,
                delete: true
            })
            else {
                bot.createMessage('142794318837579777', `**${msg.channel.guild.name}**(*${msg.channel.guild.id}*) - **${msg.author.username}**(*${msg.author.id}*)
\`\`\`${args}\`\`\``).then(() => resolve({
                    message: `Your request for **'${args}'** was successfully sent, **${msg.author.username}**-senpai.`
                }))
            }
        });
    }
}