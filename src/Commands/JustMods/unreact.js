//this is the template for commands
const { Message } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");

module.exports = new Command({
   
    name: 'uunreact',
    aliases: ['unre'],
    description: '',
    usage: '<>',
    cd: 10,
    async run(message, args, client, Prefix) {

        
        let modrechte = client.utils.TestRechte(message);
        let ut = client.utils;

        let db = client.db;
        let languageDB = await db.spracheServer.findUnique({where: {
            server_id: message.guild.id
          }})
        let lang = languageDB.lang;
        

        if (client.config.OWNERS.includes(message.member.id)) {
        }

        if (modrechte == true) {
            if (message.reference != null && args.length == 1) {

               let pingedmsg = await new Promise((resolve, reject) => {
                
                        resolve(message.channel.messages.fetch(message.reference.messageId));
                    
            })

            
              let emoji = args[0];
              console.log(emoji)
              var emoji1 = emoji.split(':')
              if (emoji1.length >= 2) {
                var emojiID = emoji1[2].split('>')
                console.log(emoji1)
                console.log(emojiID)
                let zt = await new Promise((resolve, reject) => {
                
                    resolve(message.guild.emojis.cache.find(emj => emj.id === emojiID[0]));
                
        })

                if (pingedmsg.reactions.cache.has(zt)) {
                  pingedmsg.reactions.removeAll();

                  message.delete();
                } else {
                 message.reply(ut.translation(lang, ["Bitte nutze ein Emoji welches schon als Reaktion benutzt wurde, um alle Reactions zu löschen!"
                 , "Please use an emoji which is already used as a reaction to delete all reactions!"]))

                }
              } else {
                if (pingedmsg.reactions.cache.has(emoji)) {

                  pingedmsg.reactions.removeAll();

                  message.delete();

                } else {
                    message.reply(ut.translation(lang, ["Bitte nutze ein Emoji welches schon als Reaktion benutzt wurde, um alle Reactions zu löschen!"
                    , "Please use an emoji which is already used as a reaction to delete all reactions!"]))

                }
              }

            } else {
               message.reply(ut.translation(lang, ["Bitte Pinge eine Nachricht um Jamals Reaktion zu entfernen und füge ein Emoji an deinen Command an!", 
               "Please mention a message to remove the reaction from Jamal and add an emoji to your command!"]))
            }

          }
        //here will run the command

    }
})