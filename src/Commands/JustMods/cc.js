const Command = require("../../struct/Commands");

module.exports = new Command({
  name: 'Clearchat',
  aliases: ['cc'],
  description: 'Clear a specified number of messages in the current channel',
  usage: '<number>',
  cd: 10,
  async run(message, args, client) {
    try {
      let db = client.db;
      let modrechte = await client.utils.TestRechte(message, client, db);
      let utils = client.utils;

      if (!modrechte) {
        return;
      }

      let data = await db.spracheServer.findUnique({
        where: {
          server_id: message.guild.id
        }
      });
      let lang = data.lang;

      if (args.length !== 1 || !utils.isInt(args[0])) {
        return message.channel.send(utils.translation(lang, ["Nutze Clearchat [Anzahl]!", "Use Clearchat [amount]!"]));
      }

      let amount = parseInt(args[0]) + 1;
      if (amount >= 1 && amount <= 99) {
        utils.DeleteMessage(message, amount);
      } else {
        message.channel.send(utils.translation(lang, ["Bitte wähle eine Zahl zwischen 1 und 99!", "Please select a number between 1 and 99!"]));
      }
    } catch (e) {
      console.log(`Error in command ${this.name}: ${e}`);

    }
  }
});
