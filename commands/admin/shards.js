module.exports = {
    delete: false,
    process: (msg, args, bot) => {
        return Promise.resolve({
            message: `\`\`\`markdown
### Shard Info ### 
${bot.shards.map(shard => '[' + shard.id + ']: ' + shard.status + ' (' + shard.guildCount + ')').join('\n')}\`\`\` 
            `
        })
    }
}