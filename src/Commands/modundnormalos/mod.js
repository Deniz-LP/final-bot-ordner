//this is the template for commands
const { moderation } = require("../../Database/PrismaClient");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
  name: 'mod',
  aliases: ['moderation', 'mods', 'modd'],
  description: '',
  usage: '<off/roles> or <add/remove> <@role/roleID>',
  cd: 10,
  async run(message, args, client, Prefix) {
    try {
      let db = client.db;

      let modrechte = await client.utils.TestRechte(message, client, db);
      let ut = client.utils;

      let languageDB = await db.spracheServer.findUnique({
        where: {
          server_id: message.guild.id
        }
      })
      let lang = languageDB.lang;

      let modIDs = await db.moderation.findMany({
        where: {
          server: message.guild.id
        }

      })

      console.log(modrechte)

      if (args[0].toUpperCase() === "ADD") {
        if (modrechte == true) {
          let modrole;
          if (message.mentions.roles.size == 1) {
            modrole = message.mentions.roles.first();
          } else if (message.guild.roles.cache.find(role => role.id === args[1]) != undefined) {
            modrole = message.guild.roles.cache.find(role => role.id === args[1])
          } else if (message.guild.roles.cache.find(role => role.name === args[1]) != undefined) {
            modrole = message.guild.roles.cache.find(role => role.name === args[1])
          }
          if (modrole != null) {

            for (const Moderation of modIDs) {
              if (Moderation.role_ids === modrole.id) {
                return message.reply(client.utils.translation(lang, ["Diese Rolle ist schon registriert!",
                  "This role is already registered!"]));
              }
            }

            modIDs = await db.moderation.create({

              data: {
                server: message.guild.id,
                role_ids: modrole.id

              }
            })
            message.reply(client.utils.translation(lang, ["Diese Rolle wurde nun zu den Moderations-Rollen hinzugefügt!",
              "This role is now added to the moderation-roles!"]));

          } else {
            message.channel.send(client.utils.translation(lang, ["Rolle wurde nicht gefunden!",
              "The role was not found!"]));

          }
        }
      } else if (args[0].toUpperCase() === "REMOVE") {

        if (modrechte == true) {
          let modrole2;
          if (message.mentions.roles.size == 1) {
            modrole2 = message.mentions.roles.first();
          } else if (message.guild.roles.cache.find(role => role.id === args[1]) != undefined) {
            modrole2 = message.guild.roles.cache.find(role => role.id === args[1])
          } else if (message.guild.roles.cache.find(role => role.name === args[1]) != undefined) {
            modrole2 = message.guild.roles.cache.find(role => role.name === args[1])
          }
          if (modrole2 != null) {

            for (const Moderation of modIDs) {
              if (Moderation.role_ids === modrole2.id) {
                modIDs = await db.moderation.delete({
                  where: {
                    server: Moderation.server,
                    role_ids: Moderation.role_ids
                  }
                })
                return message.reply(client.utils.translation(lang, ["Diese Rolle wurde nun von den Moderations-Rollen entfernt!",
                  "This role is now removed of the moderation-roles!"]));

              }
            }

            return message.reply(client.utils.translation(lang, ["Diese Rolle ist schon registriert!",
              "This role is already registered!"]));

          } else {
            message.channel.send(lang, ["Rolle wurde nicht gefunden!",
              "The role was not found!"]);

          }


        }

      } else if (args.length === 1 && args[0].toUpperCase() === "ROLES") {



        if (modIDs) {
          let ab = "";

          for (const Moderation of modIDs) {
            ab = ab + "\n<@&" + Moderation.role_ids + ">";
          }


          message.reply(client.utils.translation(lang, ["Folgende Rollen haben die Berechtigungen für die Moderations-Commands: \n" + ab,
          "Following roles have the permission to use the Moderation-Commands: \n" + ab]));

        } else {

          message.reply(client.utils.translation(lang, ["Es sind keine Moderationsrollen eingestellt!", "There are no Moderation-roles saved!"]));

          


        }

      } else {
        message.reply(client.utils.translation(lang, ["Kein Gültiger Command!",
          "Command not found!"]));
      }
      //here will run the command
    } catch (e) {
      console.log("Error bei " + this.name + ": " + e)
    }
  }
})