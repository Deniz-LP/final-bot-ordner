const Command = require("../../struct/Commands");
module.exports = new Command({
    name: 'stop',
    aliases: ['l', 'leave', 'quit'],
    description: 'stops the bot',
    usage: '<>',
    cd: 10,
    async run (message, args, client) {
        let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;
        //here will run the command
        let pl = client.music.manager.get(message.guild.id);
        if (!pl) return message.reply(client.utils.translation(lang, ["Du kannst nichts entfernen.", "There's nothing to stop,"]));
        pl.queue.clear();
        pl.stop()
    }  
})