const axios = require('axios');

module.exports = {
    usage: "Returns a **Wikipedia link** for the searched terms.\n\n`wiki [search]`",
    delete: false,
    cooldown: 5,
    process: (msg, args) => {
        return new Promise(resolve => {
            args = args ? args : 'Yuki Nagato';
            axios.get(`https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=${args.replace(' ','_')}`).then(response => {
                resolve({
                    message: `**${msg.author.username}**, I searched for **\"${args}\"** and found this, Senpai:
**<https://en.wikipedia.org/?curid=${response.data.parse.pageid}>**`
                });
            })
        });
    }
}