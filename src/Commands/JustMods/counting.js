//this is the template for commands
const { MessageEmbed } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
  name: 'counting',
  aliases: ['count', "countin"],
  description: '',
  usage: '<>',
  cd: 10,
  async run(message, args, client, Prefix) {
    let db = client.db;
    let modrechte = client.utils.TestRechte(message);
    let ut = client.utils;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;

    let countingdb = await db.counting.findUnique({
      where: {
        server: message.guild.id
      }
    })
    console.log(countingdb);

    if (!countingdb) {
      countingdb = await db.counting.create({
        data: {
          server: message.guild.id,
          nummer: 0,
          player_id: "null",
          channel_id: "null"
        }
      })
    }
    
    console.log(countingdb);
    if (modrechte == true) {

      if (args.length >= 1) {
        if (args[0].toUpperCase() === "SET") {

          ut.DeleteMessage(message, 1);
          message.reply(ut.translation(lang, ["Super! Dies ist nun der Counting Channel!",
            "Perfect, this is now the counting channel!"])).then(msg => {
              //message.delete()
              setTimeout(() => msg.delete(), client.config.DELETETIME)
            })

            await db.counting.update({
            where: {
              server: message.guild.id,
            },
            data: {
              server: message.guild.id,
              nummer: countingdb.nummer,
              player_id: countingdb.player_id,
              channel_id: message.channel.id
            }
          })
        } else if (args[0].toUpperCase() === "OFF") {

          message.reply(ut.translation(lang, ["Der Counting-Channel ist aus!", "The counting channel is off!"])).then(msg => {
            //message.delete()
            setTimeout(() => msg.delete(), client.config.DELETETIME)
          })

          await db.counting.update({
            where: {
              server: message.guild.id,
            },
            data: {
              server: message.guild.id,
              nummer: countingdb.nummer,
              player_id: countingdb.player_id,
              channel_id: "0"
            }
          })
        } else if (args[0].toUpperCase() === "HELP") {




          const exampleEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Help Command für counting:")
            .setDescription("[] = Argumente (optional), () = Argumente (Eingabe erfordert), \n~: Nur für User mit Admin-Perms oder Mod-Perms (" + Prefix + "mod roles)!")
            .addField("~counting set", "Setze den Counting-Channel in deinem Server!", false)
            .addField("~counting off", "Deaktiviere den Counting-Bot in deinem Server!", false)
            .addField("~counting (Zahl)", "Setze den Counting-Fortschritt auf einen Wert! (Am besten in einem anderen Channel...) \n Bei einem Wert über 1 Mio, DM den Bot!", false)
            .setFooter('Created by ' + message.author.tag);

          const exampleEmbedEngl = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Help Command for counting:")
            .setDescription("[] = Arguments (optional), () = Arguments (needed!), \n~: Only for User with Admin or Mod-Perms (" + Prefix + "mod roles)!")
            .addField("~counting set", "Set the counting channel in your Server!", false)
            .addField("~counting off", "Deactivate the counting in your Server!", false)
            .addField("~counting (Zahl)", "Set the conting-progress to a specific number! (Best would be in another channel...) \n If the number is over 1 Mio, please DM Bot!", false)
            .setFooter('Created by ' + message.author.tag);


          if (lang == "de") {
            message.reply({ embeds: [exampleEmbed] })
          } else {
            message.reply({ embeds: [exampleEmbedEngl] })
          }

        } else {
          if (ut.isInt(args[0])) {
            let newNumber = parseInt(args[0]);
            if (newNumber <= 1000000 || client.config.OWNERS.includes(message.author.id)) {

              await db.counting.update({
                where: {
                  server: message.guild.id,
                },
                data: {
                  server: message.guild.id,
                  nummer: newNumber,
                  player_id: countingdb.player_id,
                  channel_id: countingdb.channel_id
                }
              })
              ut.DeleteMessage(message, 1);
              message.reply(ut.translation(lang, ["Der Counting-Fortschritt ist nun auf " + newNumber,
              "The Counting-Progress is set to " + newNumber])).then(msg => {
                //message.delete()
                setTimeout(() => msg.delete(), client.config.DELETETIME)
              });
            } else {
              message.reply(ut.translation(lang, ["Diese Zahl ist zu groß! Bitte DMen sie den Bot!",
                "This number is too big , please DM the bot"]));
            }
          }else{
            message.reply(ut.translation(lang, ["Diese Zahl ist zu groß! Bitte wenden sie sich an @Deniz#5879!",
            "This number is too big , please contact @Deniz#5879!"]));
          }


        }



      }
    }
    //here will run the command

  }
})