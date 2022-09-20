//this is the template for commands
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
  name: 'Clearchat',
  aliases: ['cc'],
  description: '',
  usage: '<>',
  cd: 10,
  async run(message, args, client, Prefix) {
    let db = client.db
    let modrechte = client.utils.TestRechte(message);
    let ut = client.utils;
    

    if (modrechte == true) {
      let data = await db.spracheServer.findUnique({where: {
      server_id: message.guild.id
    }})
    let lang = data.lang;
    
      if (args.length === 1 && ut.isInt(args[0])) {
        let a = parseInt(args[0]) + 1;
        if (a >= 1 && a <= 99) {
          client.utils.DeleteMessage(message, a);
        } else {

          message.channel.send(ut.translation(lang, ["Bitte wähle eine Zahl zwischen 1 und 99!", "Please select a number between 1 and 99!"]))
        }
      } else {
        message.channel.send(ut.translation(lang, ["Nutze Clearchat [Anzahl]!", "Use Clearchat [amount]!"]))
      }

    }
    //here will run the command

  }
})