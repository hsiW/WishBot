var Cleverbot = require("cleverbot-node"), onee = new Cleverbot; Cleverbot.prepare(function () {});
var prefix = require("./../options/options.json").prefixes;
var decode = require("entities");

function Clever(bot, msg){
  var text = (msg.cleanContent.split(' ').length > 1) ? msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).replace('@', '') : false;
  bot.startTyping(msg.channel);
  Cleverbot.prepare(() => {
  onee.write(text, response => {
    if(!response.message){
      bot.sendMessage(msg, "Cleverbot is currently reseting. Please try again in a moment");
      delete require.cache[require.resolve("cleverbot-node")];
      Cleverbot = require("cleverbot-node");
      onee = new Cleverbot();
      console.log("Cleverbot was reset because nothing was returned");
    }
    else
    {
      response.message = response.message.replace(/<br \/>/g, " ");
      response.message = response.message.replace(/\[(.{1,10})\]/g, "");
      response.message = response.message.replace(/\r?\n|\r/g, " ");
      response.message = response.message.replace(/\[(i|\/i)\]/g, "*");
      response.message = response.message.replace(/\[(b|\/b)\]/g, "**");
      bot.sendMessage(msg, "💭 - " + decode.decodeHTML(response.message));
    }
  });
});
bot.stopTyping(msg.channel)
}
var chatbot = {
"chat": {
  usage: "Chat with this bot using the Cleverbot API\n`chat [text]` or `@Onee-chan [text]`",
  cooldown: 2,
  process: function (bot, msg) {Clever(bot,msg)}
}
}

exports.Clever = Clever;
exports.chatbot = chatbot;
