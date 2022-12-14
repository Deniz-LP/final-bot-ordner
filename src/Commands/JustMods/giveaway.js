//this is the template for commands
const { Client, MessageEmbed } = require("discord.js");
const { DATE } = require("mysql/lib/protocol/constants/types");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
/**
 * @param {Client} client  
 */
module.exports = new Command({
  name: 'giveaway',
  aliases: ['give', 'win'],
  description: '',
  usage: '<time> <Title> ? <Description>',
  cd: 10,

  async run(message, args, client, Prefix) {
    try{

    

    function isInt(value) {
      var x = parseFloat(value);
      return !isNaN(value) && (x | 0) === x;
    }

    

    let ut = client.utils;

    let db = client.db;
    
    let modrechte = await client.utils.TestRechte(message, client, db);
    console.log(modrechte)

    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;

    if (args[0] == "help") {
      const exampleEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Giveaway Command:")
        .setDescription("Es ist wirklich nicht schwer:")
        .addField("-", "-", false)
        .addField("giveaway help", "du landest hier (was ein wunder)", false)
        //.addField("**EINIGE COMMANDS SIND NOCH NICHT AKTIV, DER BOT WIRD UMGESCHRIEBEN**", "**DAS KÖNNTE EINE GEWISSE ZEIT IN ANSPRUCH NEHMEN; DAFÜR GIBT ES BALD ABER EINIGE FEATURES!**", false)
        .addField("-", "-", false)
        .addField("giveaway <Zeit> <Titel> ?? <Nachricht>", "Als Zeit bitte eine Zahl, gefolgt von 's' für Sekunden, 'm' für Minuten, 'h' für Stunden, 't' für Tage, 'w' für Wochen, 'mo' für Monate und 'j' für Jahre." +
          " Wichtig ist, nachdem du deinen Titel eingegeben hast, ein '??' zu schreiben, um Titel mit Beschreibung zu trennen. ", false)
        .addField("-", "-", false)
        .addField("Beispiel", "giveaway 4d NITRO PLUS ?? In 4 Tagen wird ausgelost.", false)
        .setFooter('More Questions? DM the Bot! - Created by ' + message.author.tag);

      const exampleEmbedEngl = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Help Command:")
        .setDescription("It's not that hard bro:")
        .addField("-", "-", false)
        .addField("giveaway help", "you are here.", false)
        //.addField("**EINIGE COMMANDS SIND NOCH NICHT AKTIV, DER BOT WIRD UMGESCHRIEBEN**", "**DAS KÖNNTE EINE GEWISSE ZEIT IN ANSPRUCH NEHMEN; DAFÜR GIBT ES BALD ABER EINIGE FEATURES!**", false)
        .addField("-", "-", false)
        .addField("giveaway <time> <titel> ?? <description>", "For the time, please insert a number followed with 's' for seconds, 'm' for minutes, 'h' for hours, 'd' for Days, 'w' for weeks, 'mo' for months and 'y' for years." +
          " An important thing is after you have entered your title, you write a '??' to separate title with description. ", false)
        .addField("-", "-", false)
        .addField("Example", "giveaway 4d NITRO PLUS ?? In 4 days, the winner will be announced.", false)
        .setFooter('More Questions? DM the Bot! - Created by ' + message.author.tag);


      let data = await client.db.spracheServer.findUnique({
        where: {
          server_id: message.guild.id
        }
      })
      let lang = data.lang;

      if (lang === 'de') {
        message.reply({ embeds: [exampleEmbed] })
      } else if (lang === 'en') {
        message.reply({ embeds: [exampleEmbedEngl] })
      }
      return;
    }


    if (client.config.OWNERS.includes(message.member.id)) {
    }

    if (modrechte == true) {



      message.delete();

      if(args.length <= 3){
        message.reply(client.utils.translation(lang, ["Zu wenig Argumente (Vielleicht hilft '?giveaway help'?)", "Too less arguments (maybe '?giveaway help' helps you?)"]))
            return;
          
      }

      let timesplit = args[0].split("");
      let Zeit = 0;

      //time generator
      
      let EndTime = (Date.now());
      
      let b = 0;
      for (let a = 0; a < timesplit.length; a++) {
        if (isInt(timesplit[a])) {
          Zeit = (Zeit * 10) + parseInt(timesplit[a]);

        } else {
          if (timesplit[a] == "s") {
            EndTime = EndTime + (1000*Zeit); b = 1;
          } else if (timesplit[a].toLowerCase() == "m") {
            EndTime = EndTime + (60 * 1000 * Zeit); b = 1;
          } else if (timesplit[a].toLowerCase() == "h") {
            EndTime = EndTime + (60 * 60 * 1000 * Zeit); b = 1;
          } else if (timesplit[a].toLowerCase() == "d" || timesplit[a].toLowerCase() == "t") {
            EndTime = EndTime + (24 * 60 * 60 * 1000* Zeit); b = 1;
          } else if (timesplit[a].toLowerCase() == "w") {
            EndTime = EndTime + (7 * 24 * 60 * 60 * 1000* Zeit); b = 1;
          } else if (timesplit[a].toLowerCase() == "m" || timesplit[a + 1].toLowerCase() == "o") {
            EndTime = EndTime + (30 * 24 * 60 * 60 * 1000* Zeit); b = 1;
          } else if (timesplit[a].toLowerCase() == "j" || timesplit[a].toLowerCase() == "y") {
            EndTime = EndTime + (365 * 24 * 60 * 60 * 1000 * Zeit); b = 1;
          } else {
            message.reply(client.utils.translation(lang, ["Bei der Berechnung deiner Dauer gab es einen Error. Melde dies in meinen DMs!", "There was an Error while calculating the giveaway-time. Report this in my DMs!"]))
            return;
          }
          a = 20;
        }
      }
      if (b == 0) {
        message.reply(client.utils.translation(lang, ["Bei der Berechnung deiner Dauer gab es einen Error. Melde dies in meinen DMs!", "There was an Error while calculating the giveaway-time. Report this in my DMs!"]))
        return;
      }

      //title und desc
      let testing = false;
      let titeltext = "";
      let desctext = "";
      let titel = true;
      for (let c = 1; c < 9999; c++) {
        if (args[c] == "??") {
          titel = false;
        } else if (titel == true) {
          titeltext = titeltext + " " +  args[c];
        } else {
          if (args[c] == undefined){
            c = 10000
          }else{
          desctext = desctext + " " + args[c];
          testing = true;
        }
        }
      }
      if (titel == true) {
        message.reply(client.utils.translation(lang, ["Bitte tu ein '??' zwischen Titel und Beschreibung!", "Please add a '??' between your title and Description!"]))
        return;
      }else if(testing == false){
        message.reply(client.utils.translation(lang, ["Unbekannter Error... wie hast du das denn geschafft? Melde dies in meinen DMs!", "Unknown Error... how did you do that? Report this in my DMs!"]))
        return;
      
      }


      const exampleEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(titeltext)
      .setDescription(desctext)
      .addField("Reagiere mit 🥳!", "um im Pot zu sein!", false)
      .addField("Restzeit:", "=Loading=", false)
      .setFooter('Giveaway created by ' + message.author.tag + '');

    const exampleEmbedEngl = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(titeltext)
      .setDescription(desctext)
      .addField("React with 🥳", "to have a chance to win", false)
      .addField("Time left:", "=Loading=", false)
      .setFooter('Giveaway created by ' + message.author.tag + '');

          let sent;
        if (lang === 'de') {
          sent = await message.channel.send({ embeds: [exampleEmbed] });
        } else if (lang === 'en') {
          sent = await message.channel.send({ embeds: [exampleEmbedEngl] });
        }
      
        sent.react("🥳")


      let givepossib = false;
      for (let e = 1; e <= 999999; e++) {
        let Giveaway = await db.giveaway.findUnique({
          where: {
            giveaway_id: e
          }
        })
        if (Giveaway == undefined) {
          givepossib = true;
          Giveaway = await db.giveaway.create({
            data: {
              giveaway_id: e,
              channel_id: message.channelId,
              desc: desctext,
              endtime: BigInt(EndTime),
              message_id: sent.id,
              player_id: message.author.id,
              server_id: message.guildId,
              title: titeltext,
              finished: false,
              winner_id: "null"
              
            }
          })
          e = 1000000;
        }
      }
      if (givepossib == false) {
        message.reply(client.utils.translation(lang, ["Zu viele Giveaways als Platz in der Datenbank. Melde dies in meinen DMs!", "To much giveaways created for the Database. Report this in my DMs!"]))
        return;
      }
      

    } else {
      message.reply("no rights.").then(msg => {
        setTimeout(() => msg.delete(), 10000)
      })
      .catch(console.log("error giveaway."))
    }
    //here will run the command

  }catch (e){
    console.log("Error bei "+ this.name +  ": "+ e)
  }
  }
}) 