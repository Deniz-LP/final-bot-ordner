//this is the template for commands
const { Util } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
  name: 'lang',
  aliases: ['language'],
  description: '',
  usage: '<language>',
  cd: 10,
  args: true,
  async run(message, args, client, prefix) {
    try {
      let db = client.db;

      let languageDB = await db.spracheServer.findUnique({
        where: {
          server_id: message.guild.id
        }
      })
      let lang = languageDB.lang;


      let modrechte = await client.utils.TestRechte(message, client, db);
      if (modrechte == true) {
        if (args[0].toUpperCase() === "DE" || args[0].toUpperCase() === "DEUTSCH" | args[0].toUpperCase() === "GERMAN") {

          languageDB = await db.spracheServer.update({
            where: {
              server_id: message.guild.id
            },
            data: {
              server_id: message.guild.id,
              lang: "de"
            }

          })
          if (message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
            message.channel.send('Super! Die Serversprache wurde auf Deutsch gestellt!');
          } else {
            const randomChannel = message.guild.channels.cache.find(channel =>
              channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES") && channel.permissionsFor(client.user).has("VIEW_CHANNEL"));
            //console.log(randomChannel);
            randomChannel.send('Super! Die Serversprache wurde auf Deutsch gestellt!');
          }
        } else if (args[0].toUpperCase() === "EN" || args[0].toUpperCase() === "ENGLISH") {
          languageDB = await db.spracheServer.update({
            where: {
              server_id: message.guild.id
            },
            data: {
              server_id: message.guild.id,
              lang: "en"
            }

          })

          if (message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
            message.channel.send('The Serverlanguage is now set to English!');
          } else {
            const randomChannel = message.guild.channels.cache.find(channel =>
              channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES") && channel.permissionsFor(client.user).has("VIEW_CHANNEL"));
            randomChannel.send('The Serverlanguage is now set to English!');
            randomChannel.send("Sorry for disturb, but Jamal would like to get the permission SEND_MESSAGES in all channel, <@" + message.guild.ownerID + ">.");
          }
        } else {
          message.channel.send("This Language is not supported! \nSupported Languages until now are: \nGerman - DE \nEnglish - EN");
        }
      }
    } catch (e) {
      console.log("Error bei " + this.name + ": " + e)
    }
  }
}) 
