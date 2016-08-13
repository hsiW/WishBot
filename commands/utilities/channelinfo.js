module.exports = {
    usage: "Outputs info about the current channel",
    cooldown: 5,
    process: (bot, msg) => {
        let toSend = "```ruby\n";
        toSend += `         Name: \"${msg.channel.name}\"`;
        toSend += `\n           ID: ${msg.channel.id}`;
        toSend += `\nCreation Date: ${new Date(msg.channel.createdAt).toUTCString()}`;
        toSend += `\n     Position: #${msg.channel.position}`;
        toSend += `\n         Type: ${msg.channel.type}\`\`\``;
        if (msg.channel.topic != "") toSend += `\n**Topic:** ${msg.channel.topic}`;
        bot.createMessage(msg.channel.id, toSend).catch();
    }
}