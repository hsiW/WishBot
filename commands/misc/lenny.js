module.exports = {
    usage: "Returns a **Lenny** to the current channel.",
    process: () => {
    	//Its really just a lenny nothing more
        return Promise.resolve({
            message: '( ͡° ͜ʖ ͡°)'
        })
    }
}