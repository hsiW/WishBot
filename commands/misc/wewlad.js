const axios = require('axios');

module.exports = {
    usage: "Returns an **Embeded Wew Lad** to the current channel.",
    delete: false,
    cooldown: 5,
    process: () => {
        return new Promise(resolve => {
            axios.get('http://i.imgur.com/iKTCAoN.png', {
                responseType: 'arraybuffer'
            }).then(response => {
                resolve({
                    upload: {
                        file: response.data,
                        name: 'wewlad.png'
                    }
                })
            });
        })
    }
}