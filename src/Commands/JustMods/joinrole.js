//this is the template for commands
const { join } = require("@prisma/client/runtime");
const { err } = require("@sapphire/framework");
const { Client, Role } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
  name: 'joinrole',
  aliases: ['joining', 'join', 'joins'],
  description: '',
  usage: '<@role> or <roleID>',
  cd: 10,
  async run(message, args, client, Prefix) {
    let db = client.db;
    let modrechte = client.utils.TestRechte(message);
    let data1 = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = data1.lang;


    let data = await db.joinRole.findUnique({
      where: {
        server: message.guild.id
      }
    })
    if (modrechte == true) {
      let joinrole = Role;
      if (message.mentions.roles.size == 1) {
        joinrole = message.mentions.roles.first();
      } else if (message.guild.roles.cache.find(role => role.id === args[0]) != undefined) {
        joinrole = message.guild.roles.cache.find(role => role.id === args[0])
      }
      if (!data) {
        db.joinRole.create({
          data: {
            server: message.guild.id,
            role_id: joinrole.id
          }
        })
        return message.channel.send(client.utils.translation(lang, ["Perfekt! Diese Rolle wird nun an jeden neuen User verteilt!",
          "Perfect! This role is now added to every new joined user!"]))
      }

      if (data.role_id == joinrole.id) return message.channel.send(client.utils.translation(lang, ["Diese Rolle ist schon eine Joining-Rolle!",
        "This roles is alrady added as a joining-role!"]));

      db.joinRole.update({
        where: {
          server: message.guild.id
        },
        data: {
          role_id: joinrole.id
        }
      })
      message.channel.send(client.utils.translation(lang, ["Perfekt! Diese Rolle wird nun an jeden neuen User verteilt!",
        "Perfect! This role is now added to every new joined user!"]))

    } else if (args[1].toUpperCase() === "OFF") {

      if (!data) {
        db.joinRole.delete({
          where: {
            server: message.guild.id
          }
        })
        return message.channel.send(client.utils.translation(lang, ["Dieser Server hat nun keine Joiningrolle mehr.",
          "This Server now has no joiningrole."]))
      } else {
        message.channel.send(client.utils.translation(lang, ["Es gibt noch keine Rolle zum entfernen!",
          "There are no joining-roles saved!"])).then(msg => msg.delete({ timeout: client.config.DELETETIME }))
      }

    }

    //here will run the command

  }
})