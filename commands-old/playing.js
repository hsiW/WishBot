const io = require('socket.io-client');
var toTitleCase = require('./../../utils/utils.js').toTitleCase,
    playingInfo = {},
    socket = io.connect('https://listen.moe/api/socket')

module.exports = {
    usage: "Returns Now Playing info for **<https://listen.moe/>** which is used in the **listen** command. **Requires** embedded links in order for this command to display.",
    aliases: ['np', 'nowplaying'],
    process: msg => {
        return new Promise(resolve => {
            console.log(playingInfo)
            if (playingInfo === {}) resolve({
                message: 'The bot has yet to get any playing info, try again in a few moments.',
                delete: true
            })
            else resolve({
                embed: {
                    author: {
                        name: playingInfo.song_name,
                        url: 'http://listen.moe/',
                        icon_url: 'http://i.imgur.com/gjSLzlJ.png'
                    },
                    color: 0xEC1A55,
                    fields: [{
                        name: 'Artist',
                        value: playingInfo.artist_name ? playingInfo.artist_name : 'None.',
                        inline: true
                    }, {
                        name: 'Anime',
                        value: playingInfo.anime_name ? playingInfo.anime_name : 'None.',
                        inline: true
                    }, {
                        name: 'Requested By',
                        value: playingInfo.requested_by ? playingInfo.requested_by : 'None.',
                        inline: true
                    }, {
                        name: 'Previous Song',
                        value: playingInfo.last ? `Song: ${playingInfo.last.song_name}\nArtist: ${playingInfo.last.artist_name}` : 'None',
                        inline: true
                    }, {
                        name: 'Prior Song',
                        value: playingInfo.second_last ? `Song: ${playingInfo.second_last.song_name}\nArtist: ${playingInfo.second_last.artist_name}` : 'None',
                        inline: true
                    }],
                    footer: {
                        text: `Current Listeners: ${toTitleCase(playingInfo.listeners)}`
                    }
                }
            })
        });
    }
}

socket.on('update', obj => {
    try {
        console.log(obj)
        playingInfo = JSON.parse(obj)
    } catch (e) {
        console.log(errorC('Socket update error: ' + e))
    }
})