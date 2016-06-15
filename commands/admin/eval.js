module.exports = {
    process: function(bot, msg, suffix) {
        var result;
        try {
            result = eval("try{" + suffix + "}catch(err){console.log(\" ERROR \"+err);bot.createMessage(msg.channel.id, \"```\"+err+\"```\");}");
        } catch (e) {
            console.log("ERROR" + e);
            bot.createMessage(msg.channel.id, "```" + e + "```");
        }
        if (result && typeof result !== "object") bot.createMessage(msg.channel.id, result);
        else if (result && typeof result === "object") bot.createMessage(msg.channel.id, "```xl\n" + result + "```")
    }
}