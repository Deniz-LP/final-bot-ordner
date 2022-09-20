const Command = require("../../struct/Commands");
module.exports = new Command({
    name: 'loopqueue',
    aliases: ['loop'],
    description: 'loops the queue',
    usage: '<empty>',
    cd: 10,
    async run (message, args, client) {
        //here will run the command
        let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;

        let pl = client.music.manager.get(message.guild.id);
        if (!pl) return message.reply(client.utils.translation(lang, ["Keine Songs in der Queue!", "No songs in the queue!"]))
        let bool = pl?.queueRepeat;
        bool = !bool
        pl.setQueueRepeat(bool)
        if (bool) message.channel.send(client.utils.translation(lang, ["Die Queue wird nun wiederholt 🔁", "The queue will now repeat 🔁"]));
        if (!bool) message.channel.send(client.utils.translation(lang, ["Die Queue wird nun nicht mehr wiederholt ❌🔁", "The queue will now not be repeat ❌🔁"]));
    }  
})