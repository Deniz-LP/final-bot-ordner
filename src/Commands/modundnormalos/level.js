//this is the template for commands
const { MessageEmbed } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
const { createCanvas, Image } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { request } = require('undici');
const { MessageAttachment } = require('discord.js');
module.exports = new Command({
  name: 'level',
  aliases: ['lvl'],
  description: '',
  usage: '<>',
  cd: 10,
  async run(message, args, client, Prefix) {
    let mode = 1;

    const background = await readFile('./wallpaper.jpg');
    const avatar = new Image();
    if (args.length === 0) {
      const { body } = await request(message.author.displayAvatarURL({ format: 'jpg' }));

      avatar.src = Buffer.from(await body.arrayBuffer());
    } else if (args.length === 1) {
      if (message.mentions.members.size == 1) {



        let taggesUsa = message.mentions.members.first();
        if (taggesUsa == null) {
          taggesUsa = client.users.cache.find(user => user.username == args[0]);

        }
        if (taggesUsa == null) {
          taggesUsa = client.users.cache.find(user => user.id == args[0]);

        }
        if (taggesUsa != null) {
          const { body } = await request(taggesUsa.displayAvatarURL({ format: 'jpg' }));
          avatar.src = Buffer.from(await body.arrayBuffer());
        }
      }
    }


    var levelingAmount = 200;
    let ut = client.utils;
    let modrechte = client.utils.TestRechte(message);
    let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;

    let levelDB = await client.db.levelingSyst.findUnique({
      where: {
        identify: {
          server: message.guild.id,
          player_id: message.author.id
        }
        
        
      }

    })
    let RolenDB;
if(args.length >= 1){
    RolenDB = await client.db.rollenlevel.findUnique({
      where: {
        identify: {
          server: message.guild.id,
          level: args[0]
        }
        
      }

    })
  }
    if (modrechte == true) {
      if (args.length === 2) {
        let joinrole;
        if (message.mentions.roles.size == 1) {
          joinrole = message.mentions.roles.first();
        } else if (message.guild.roles.cache.find(role => role.id === args[0]) != undefined) {
          joinrole = message.guild.roles.cache.find(role => role.id === args[0])
        } else if (message.guild.roles.cache.find(role => role.name === args[0]) != undefined) {
          joinrole = message.guild.roles.cache.find(role => role.name === args[0])
        }
        if (joinrole != null) {
          if (RolenDB) {
            RolenDB = await db.rollenlevel.update({
              where: {
                server: message.guild.id,
                level: args[0]
              },
              data: {
                server: message.guild.id,
                level: args[0],
                role_id: joinrole.id
              }
            })
          } else {
            RolenDB = await db.rollenlevel.create({
              data: {
                server: message.guild.id,
                level: args[0],
                role_id: joinrole.id
              }
            })
          }
        } else {
          message.channel.send(lang, ["Bitte schreibe " + Prefix + "level help für weitere Hilfe!", "Please write " + Prefix + "level help for more information!"]);
        }

      } else if (args.length === 1) {
        if (args[0].toUpperCase() === "ON") {
          let toggleDB = await db.toggleLevel.findUnique({
            where: {
              server: message.guild.id
            }
          })
          if (toggleDB.status === "on") {
            message.channel.send(ut.translation(lang, ["Das Levelsystem ist zu dem Zeitpunkt aktiviert!", "The leveling-system is currently active!"]));

          } else {
            toggleDB = db.toggleLevel.update({
              where: {
                server: message.guild.id
              },
              data: {
                server: message.guild.id,
                status: "on"
}
})
            message.channel.send(ut.translation(lang, ["Das Levelsystem wurde nun aktiviert!", "The leveling-system is now activated!"]));
          }
} else if (args[0].toUpperCase() === "OFF") {
          let toggleDB = await db.toggleLevel.findUnique({
            where: {
              server: message.guild.id
            }
          })
          if (toggleDB.status === "off") {
            message.channel.send(ut.translation(lang, ["Das Levelsystem ist zu dem Zeitpunkt deaktiviert!", "The leveling-system is currently deactived!"]));
} else {
            toggleDB = db.toggleLevel.update({
              where: {
                server: message.guild.id
              },
              data: {
                server: message.guild.id,
                status: "off"
}
})
            message.channel.send(ut.translation(lang, ["Das Levelsystem wurde nun deaktiviert!", "The leveling-system is now deactivated!"]));
          }
}
}
}
    if (args.length == 1) {
      if (args[0].toUpperCase() === "HELP") {

        const exampleEmbed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle("Help Command Leveling:")
          .setDescription("[] = Argumente (optional), () = Argumente (Eingabe erfordert), \n~: Nur für User mit Admin-Perms oder Mod-Perms (" + Prefix + "mod roles)!")

          .addField("~level (LevelNr) @role", "Stelle ein, ab welchem Level man welche Rolle bekommt (Beispiel: " + Prefix + "level 5 {@Level5})", false)
          .addField("~level on/off", "Stelle das Leveling-System ein/aus! (Standard: Aktiv)", false)
          .addField("level [@User]", "Sieh, auf welchem Level du bist (oder jemand anderes.)", false)

          .setFooter('Created by ' + message.author.tag);

        const exampleEmbedEngl = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle("Help Command:")
          .setDescription("[] = Arguments (optional), () = Arguments (needed!), \n~: Only for User with Admin or Mod-Perms (" + Prefix + "mod roles)!")

          .addField("~level (LevelNr) @role", "Configure, which role will be gained by which Level (Example: " + Prefix + "level 5 {@Level5})", false)
          .addField("~level on/off", "Toggle the Leveling-System! (standard: active)", false)
          .addField("level [@User]", "Observe, which level you/the pinged user is!", false)

          .setFooter('Created by ' + message.author.tag);


        if (lang === 'de') {
          message.reply({ embeds: [exampleEmbed] })
        } else if (lang === 'en') {
          message.reply({ embeds: [exampleEmbedEngl] })
        }



      } else {



        let taggesUsa = message.mentions.members.first();
        if (taggesUsa == null) {
          taggesUsa = client.users.cache.find(user => user.username == args[0]);

        }
        if (taggesUsa == null) {
          taggesUsa = client.users.cache.find(user => user.id == args[0]);

        }
        if (taggesUsa == null) {
          message.channel.send(ut.translation(lang, ["User nicht gefunden. (Wenn du deine XP wissen, schreibe NUR " + Prefix + "level!)", "User not found. (If you want to know your XP, you just need to type " + Prefix + "level!)"]));

        } else {

          let levelDBUser = await client.db.levelingSyst.findUnique({
            where: {
              identify: {
                server: message.guild.id,
                player_id: taggesUsa.id
              }
              
            } 
      
          })

          if(!levelDBUser){
            levelDBUser = await db.levelingSyst.create({
              data:{
                server: message.guild.id,
                player_id: taggesUsa.id,
                fulllevel: "0",
                xp: "0"
              }
    
            })
          }

          let Level = levelDBUser.fulllevel;
          let Experience = levelDBUser.xp;

          
            if (mode === 0) {
              message.channel.send(ut.translation(lang, ["Der Spieler <@" + taggesUsa.id + "> ist Level " + Level + " mit " + Experience + "/" + (levelingAmount + (levelingAmount * Level)) + " XP.",
              "The User <@" + taggesUsa.id + "> is level " + Level + " with " + Experience + "/" + (levelingAmount + (levelingAmount * Level)) + " XP."]));
            } else if (mode === 1) {
              let maxlvl = levelingAmount + (levelingAmount * Level);
              const canvas = createCanvas(700, 250);
              const context = canvas.getContext('2d');



              const backgroundImage = new Image();
              backgroundImage.src = background;
              context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
              context.strokeStyle = '#0099ff';
              context.strokeRect(0, 0, canvas.width, canvas.height);

              context.font = '40px sans-serif';
              context.fillStyle = '#ffffff';
              context.fillText(taggesUsa.user.username, canvas.width / 2.5, canvas.height / 3.5);

              context.font = '35px sans-serif';
              context.fillStyle = '#ffffff';
              context.fillText(Experience + "/" + maxlvl + " XP", canvas.width / 2.5, canvas.height / 1.2);

              let percent = (Experience / maxlvl) * 100;
              let anzahlStreifen = percent / 2;
              let str = "";
              for (wied = 0; wied <= anzahlStreifen; wied++) {
                str = str + "█"; //50
              }


              context.font = '10px sans-serif';
              //context.font = applyText(canvas, str);
              context.fillStyle = '#00ff00';
              context.fillText(str, canvas.width / 2.5, canvas.height / 1.7);
              context.fillText(str, canvas.width / 2.5, canvas.height / 1.8);
              context.fillText(str, canvas.width / 2.5, canvas.height / 1.9);
              context.fillText(str, canvas.width / 2.5, canvas.height / 2);

              context.beginPath();
              context.arc(125, 125, 100, 0, Math.PI * 2, true);
              context.closePath();
              context.clip();
              //▉

              context.drawImage(avatar, 25, 25, 200, 200);

              const attachment = new MessageAttachment(canvas.toBuffer('image/png'), 'profile-image.png');

              message.reply({ files: [attachment] });
            }


        }
      }

    } else if (args.length === 0) {
      if(!levelDB){
        levelDB = await db.levelingSyst.create({
          data:{
            server: message.guild.id,
            player_id: message.author.id,
            fulllevel: "0",
            xp: "1",
            alleXP: "1"
          }

        })
      }
      
      let Level = levelDB.fulllevel;
      let Experience = levelDB.xp;

      
        if (mode === 0) {
          message.channel.send(ut.translation(lang, ["Du bist Level " + Level + " mit " + Experience + "/" + (levelingAmount + (levelingAmount * Level)) + " XP.",
          "You are level " + Level + " with " + Experience + "/" + (levelingAmount + (levelingAmount * Level)) + " XP."]));

        } else if (mode === 1) {
          let maxlvl = levelingAmount + (levelingAmount * Level);
          const canvas = createCanvas(700, 250);
          const context = canvas.getContext('2d');



          const backgroundImage = new Image();
          backgroundImage.src = background;
          context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
          context.strokeStyle = '#0099ff';
          context.strokeRect(0, 0, canvas.width, canvas.height);

          context.font = '40px sans-serif';
          context.fillStyle = '#ffffff';
          context.fillText(message.member.user.username, canvas.width / 2.5, canvas.height / 3.5);

          context.font = '35px sans-serif';
          context.fillStyle = '#ffffff';
          context.fillText(Experience + "/" + maxlvl + " XP.", canvas.width / 2.5, canvas.height / 1.2);

          let percent = (Experience / maxlvl) * 100;
          let anzahlStreifen = percent / 2;
          let str = "";
          for (wied = 0; wied <= anzahlStreifen; wied++) {
            str = str + "█"; //50
          }


          context.font = '10px sans-serif';
          //context.font = applyText(canvas, str);
          context.fillStyle = '#00ff00';
          context.fillText(str, canvas.width / 2.5, canvas.height / 1.7);
          context.fillText(str, canvas.width / 2.5, canvas.height / 1.8);
          context.fillText(str, canvas.width / 2.5, canvas.height / 1.9);
          context.fillText(str, canvas.width / 2.5, canvas.height / 2);

          context.beginPath();
          context.arc(125, 125, 100, 0, Math.PI * 2, true);
          context.closePath();
          context.clip();
          //▉

          context.drawImage(avatar, 25, 25, 200, 200);

          const attachment = new MessageAttachment(canvas.toBuffer('image/png'), 'profile-image.png');

          message.reply({ files: [attachment] });
        }
    }
    //here will run the command

  }
})