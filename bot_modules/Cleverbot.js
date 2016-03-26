var Cleverbot = require("cleverbot-node"), onee = new Cleverbot; Cleverbot.prepare(function () {});
var prefix = require("./../options/options.json").prefixes;

function Clever(bot, msg){
  var text = (msg.cleanContent.split(' ').length > 1) ? msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).replace('@', '') : false;
  bot.startTyping(msg.channel);
  onee.write(text, function (response) {bot.sendMessage(msg, "💭 - " + response.message).then(bot.stopTyping(msg.channel));});
}
var chatbot = {
"chat": {
  usage: "Chat with this bot using the Cleverbot API\n`"+prefix[0]+"chat [text]` or `@Onee-chan [text]`",
  process: function (bot, msg) {Clever(bot,msg)}
}
}

exports.Clever = Clever;
exports.chatbot = chatbot;
