//this is the template for commands
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
    name: 'mod',
    aliases: ['moderation', 'mods', 'modd'],
    description: '',
    usage: '<off/roles> or <add/remove> <@role/roleID>',
    cd: 10,
    async run (message, args, client, Prefix) {
        let modrechte = client.utils.TestRechte(message);
        let ut = client.utils;

        let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;

    let modDB = await db.moderation.findUnique({
      where:{
        server: message.guild.id
      }

    })


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
            if (modDB) {

              let AllIDs = modDB.role_ids.split(",");

              if(AllIDs.includes(modrole.id)){
                return message.reply(client.utils.translation(lang, ["Diese Rolle ist schon registriert!", 
                "This role is already registered!"]));
              }else{
                modDB = await db.moderation.update({
                  where: {
                    server: message.guild.id
                  },
                  data: {
                    server: message.guild.id,
                    role_ids: AllIDs+","+modrole.id
  
                  }
                })
                message.reply(client.utils.translation(lang, ["Diese Rolle wurde nun zu den Moderations-Rollen hinzugefügt!",
                    "This role is now added to the moderation-roles!"]));
                  
              }
            } else {
              modDB = await db.moderation.create({
                data: {
                  server: message.guild.id,
                  role_ids: modrole.id
                }
              })
              message.reply(client.utils.translation(lang, ["Diese Rolle wurde nun zu den Moderations-Rollen hinzugefügt!",
              "This role is now added to the moderation-roles!"]));
            
        
            }
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
                if (modDB) {

                  let AllIDs = modDB.role_ids.split(",");
                  console.log(AllIDs);
                  let newd = "";

                  if(AllIDs.includes(modrole2.id)){

                    for(i = 0; i < AllIDs.length; i++){
                      if(!(AllIDs[i] === modrole2.id)){
                        if(newd == ""){
                          console.log(newd);
                          newd = AllIDs[i];
                          console.log(newd);
                        }else{
                          console.log(newd);
                        newd = newd + "," + AllIDs[i];
                        console.log(newd);
                        }
                        }
                    }
                    if(newd == ""){
                      modDB = await db.moderation.delete({
                        where: {
                          server: message.guild.id
                        }
                      })
                    }else{
                    modDB = await db.moderation.update({
                      where: {
                        server: message.guild.id
                      },
                      data: {
                        server: message.guild.id,
                        role_ids: newd
      
                      }
                    })
                  }
                

                    return message.reply(client.utils.translation(lang, ["Diese Rolle wurde nun von den Moderations-Rollen entfernt!",
                    "This role is now removed of the moderation-roles!"]));
                   }else{
                    return message.reply(client.utils.translation(lang, ["Diese Rolle ist nicht eingespeichert!",
                    "This role ist not saved as a Moderation-Role!"]));
                }
              }
                } else {
                  message.channel.send(lang, ["Rolle wurde nicht gefunden!", 
                  "The role was not found!"]);
                
                }


              } else {
                message.channel.send(lang, ["Bitte schreibe " + Prefix + "level help für weitere Hilfe!", "Please write " + Prefix + "level help for more information!"]);
              }

                   
    
    
          } else if (args.length === 1 && args[0].toUpperCase() === "ROLES") {

          
            
              if (modDB) {
                let AllIDs = modDB.role_ids.split(",");
                let ab = "";
                  for(i = 0; i < AllIDs.length; i++){
                      ab = ab + "\n<@&" + AllIDs[i]+">";
                   }
    
                message.reply(client.utils.translation(lang, ["Folgende Rollen haben die Berechtigungen für die Moderations-Commands: \n" + ab,
                "Following roles have the permission to use the Moderation-Commands: " + ab]));
    
              } else {
    
                message.reply(client.utils.translation(lang, ["Es sind keine Moderationsrollen eingestellt!", "There are no Moderation-roles saved!"]));
                
    
    
    
              }
    
          } else {
            message.reply(client.utils.translation(lang, ["Kein Gültiger Command!",
            "Command not found!"]));
          }
        //here will run the command
        
    }  
})