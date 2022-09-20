//this is the template for commands
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
    name: 'dm',
    aliases: [''],
    description: 'just deniz',
    usage: '<user>',
    cd: 10,
    async run (message, args, client, Prefix) {
      if (client.config.OWNERS.includes(message.member.id)) {
        let db = client.db;
        let languageDB = await db.spracheServer.findUnique({where: {
            server_id: message.guild.id
          }})
        let lang = languageDB.lang;
        
                  if(args.length >= 2){
                      client.users.fetch(args[0]).then((user) => {
                        try {
                          let dmm = "";
                          for (let a = 1; a < args.length; a++) {
                            dmm = dmm + args[a] + " ";
                          }
                          user.send(dmm).catch(() => message.reply(client.utils.translation(lang, ["Der User hat DM's deaktiviert!", "This user disabled DMs!"])));
                        } catch (err){
                          console.log("err")
                        }
                    });
                  }
                }
      }  
})