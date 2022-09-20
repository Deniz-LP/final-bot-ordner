const Command = require("../../struct/Commands");
module.exports = new Command({
    name: 'shuffle',
    aliases: ['mix'],
    description: 'shuffle the queue',
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
        if (!pl || !pl?.queue?.size) return message.reply(client.utils.translation(lang, ["Ich kann nicht shufflen", 'Nothing to shuffle']));
        let queue = Array.from(pl.queue)
        //randomize the array
        let array = []
        for (let i = 0; i < queue.length; i++) {
            array.push(i)
            //[1, 2, 3, 4, 5]
        }
        array = array.sort(() => Math.random() - 0.5)
        //[2,4,1,5,3]
        //remove the old queue
        pl.queue.clear()
        //add the new queue
        for (let i = 0; i < array.length; i++) {
            pl.queue.add(queue[array[i]])
            //song at 2 > song at 4> 
        }

        message.reply(client.utils.translation(lang, ["Zufällige Queue :D", 'Queue shuffled :D']))
    }  
})