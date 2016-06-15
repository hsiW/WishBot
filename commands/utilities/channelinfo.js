module.exports = {
    usage: "Outputs info about the current channel",
    delete: true,
    cooldown: 5,
    process: function(bot, msg) {
        var creationDate = new Date((msg.channel.id / 4194304) + 1420070400000);
        var toSend = "```ruby\n";
        toSend += `         Name: \"${msg.channel.name}\"`;
        toSend += `\n           ID: ${msg.channel.id}`;
        toSend += `\nCreation Date: ${creationDate.toUTCString()}`;
        toSend += `\n     Position: #${msg.channel.position}`;
        toSend += `\n         Type: ${msg.channel.type}`;
        toSend += `\n\`\`\`**Topic:** ${msg.channel.topic}`;
        bot.createMessage(msg.channel.id, toSend);
    }
}