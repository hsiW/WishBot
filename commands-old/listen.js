var Eris = require('eris'),
    sharedStream = new Eris.SharedStream();


module.exports = {
    usage: "**Streams Music** from **<https://listen.moe/>**. Use the command while in a voice channel for the bot to **join** that channel and if the bots already in another voice channel it will **switch** to your channel. When used when you're not in a voice channel the bot will **leave** the voice channel on your server.",
    dm: false,
    permissions: {
        'manageGuild': true
    },
    cooldown: 30,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            if (args === 'stats') {
                let streamingGuilds = [];
                for (guild in bot.voiceConnections.guilds) {
                    streamingGuilds.push(bot.voiceConnections.guilds[guild]);
                }
                let streamingCount = streamingGuilds.length,
                    streamingUsers = 0;
                streamingGuilds.forEach(connection => {
                    if (bot.getChannel(connection.channelID)) streamingUsers += bot.getChannel(connection.channelID).voiceMembers.size - 1
                })
                resolve({
                    message: `\`\`\`markdown
### Listen Usage Stats ###
[Users](${streamingUsers})
[Channels](${streamingCount})
\`\`\``
                })
            } else if (msg.member.voiceState.channelID) {
                let channel = bot.voiceConnections.get(msg.channel.guild.id)
                if (channel) channel.switchChannel(msg.member.voiceState.channelID)
                else {
                    bot.joinVoiceChannel(msg.member.voiceState.channelID, {
                        shared: true
                    }).then(connection => {
                        connection.on('error', console.log)
                        connection.setSpeaking(true)
                        sharedStream.voiceConnections.add(connection)
                        resolve({
                            message: `Succesfully joined the Voice Channel - **${msg.channel.guild.channels.get(connection.channelID).name}**.`,
                            delete: true
                        })
                    }).catch(err => console.log(errorC(err)))
                }
                sharedStream.play('https://listen.moe/stream')
            } else if (!msg.member.voiceState.channelID && bot.voiceConnections.get(msg.channel.guild.id)) {
                let connection = bot.voiceConnections.get(msg.channel.guild.id),
                    channelID = connection.channelID;
                sharedStream.voiceConnections.remove(connection)
                bot.leaveVoiceChannel(channelID);
                resolve({
                    message: `Succesfully left the Voice Channel - **${msg.channel.guild.channels.get(channelID).name}**.`,
                    delete: true
                })
            } else resolve({
                message: 'You must be in a **Voice Channel** for the bot to connect to one.',
                delete: true
            })
        });
    }
}