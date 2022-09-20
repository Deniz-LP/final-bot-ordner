const { MessageEmbed } = require("discord.js");
const Command = require("../../struct/Commands");
module.exports = new Command({
    name: 'skip',
    aliases: ['s', 'next', 'n'],
    description: 'skip the song',
    usage: '',
    cd: 10,
    async run (message, args, client) {
        let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;
        let pl = client.music.manager.get(message.guild.id);
        if (!pl) return message.reply({content: 'Play some music'})
        if (!pl.queue.size) return message.reply(client.utils.translation(lang, ["Queue ist leer",'There is nothing in the queue']))
        if (pl.queue.size < args[0]) return message.reply(client.utils.translation(lang, ["Queue ist leer",'There is nothing in the queue']))

        pl.stop(args[0] || 0)
    }  
})