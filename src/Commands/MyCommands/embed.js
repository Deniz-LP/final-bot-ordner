//this is the template for commands
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
    name: 'embed',
    aliases: ['embeds'],
    description: 'create embeds',
    usage: '<follow instructions afterwards>',
    cd: 10,
    async run(message, args, client, Prefix) {

        let modrechte = client.utils.TestRechte(message);
        let ut = client.utils;

        let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;

        if (args.length == 0) {

          let embeds = await db.embedGen.findUnique({
            where: {
              identify: {
                server_id: message.guild.id,
                player_id: message.author.id,
                channelsend_id: message.channel.id
              }
            }
          })
          if(!embeds){
                if (message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
                  
                
                message.reply(ut.translation(lang, ["Bitte Pinge den Channel, in dem dieser Embed reingesendet werden soll, <@" + message.author.id + ">!"
                ,"Please mention a channel, where this Embed should be sent to, <@" + message.author.id + ">!"])).then(msg => {
                    setTimeout(() => msg.delete(), 30000)
                  })
                  .catch(console.error);


                  embeds = await db.embedGen.create({
                    data:{
                      server_id: message.guild.id,
                      status: "1",
                      player_id: message.author.id,
                      channelsend_id: message.channel.id
                    }


                  })

                }
              }
              }

          
        //here will run the command

    }
})