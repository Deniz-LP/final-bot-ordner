const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");

module.exports = new Command({
  name: 'setlevel',
  aliases: ['setVoll'],
  description: 'just deniz',
  usage: '<levelVoll>',
  cd: 10,
  async run(message, args, client, Prefix) {
    try {
      if (client.config.OWNERS.includes(message.member.id)) {
        let user = message.mentions.users.size === 1 ? message.mentions.users.first() : message.guild.members.fetch(args[0]);

        if (user != null) {
          let level = await client.db.levelingSyst.findUnique({
            where: {
              server: message.guild.id,
              player_id: user.id,
            },
          });

          level = await client.db.levelingSyst.update({
            where: {
              server: message.guild.id,
              player_id: user.id,
            },
            data: {
              fulllevel: args[1],
            },
          });
        }
      }
    } catch (e) {
      console.log(`Error bei ${this.name}: ${e}`);
    }
  },
});
