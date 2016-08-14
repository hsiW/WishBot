module.exports = {
    usage: 'Returns a link to donate to the development of this bot.',
    delete: true,
    cooldown: 30,
    process: (bot, msg) => {
        bot.createMessage(msg.channel.id, 'Because I work on the development of this bot in my free time, please consider donating to the developement,\nhttps://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JCSVXZTUD7F5C').catch();
    }
}