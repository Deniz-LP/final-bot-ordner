//this is the template for commands
const { Message } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");

/**
 * @param {Message} pingedmsg
 * 
 */
module.exports = new Command({
  name: 'rr',
  aliases: ['reactionrole', "role", "reactionr", "rrole"],
  description: '',
  usage: '<@role>',
  cd: 10,

  /**
   * 
   * @param {Message} pingedmsg
   */
  async run(message, args, client, Prefix) {
    try {


      let db = client.db;
      let modrechte = await client.utils.TestRechte(message, client, db);


      if (modrechte == true) {
        let languageDB = await db.spracheServer.findUnique({
          where: {
            server_id: message.guild.id
          }
        })
        let lang = languageDB.lang;

        if(!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send(client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um Reaction Roles zu erstellen!", "I don't have the necessary permissions to create Reaction Roles!"]))

        if (message.reference != null && args.length >= 2) {
          let pingedmsg = message;;
          pingedmsg = await new Promise((resolve, reject) => {
            resolve(message.channel.messages.fetch(message.reference.messageId))
          })

          let Role11 = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.cache.find(r => r.id === args[1]);
          if(!Role11) return message.channel.send(client.utils.translation(lang, ["Bitte pinge eine Rolle oder nutze eine gültige Rollen-ID!", "Please ping a role or use a valid Role-ID!"]))
          if(Role11.position >= message.guild.me.roles.highest.position) return message.channel.send(client.utils.translation(lang, ["Die Rolle ist zu hoch für mich!", "The role is too high for me!"]))
          if(Role11.position >= message.member.roles.highest.position) return message.channel.send(client.utils.translation(lang, ["Die Rolle ist zu hoch für dich!", "The role is too high for you!"]))
          
          if (Role11.managed) return message.channel.send(client.utils.translation(lang, ["Die Rolle ist ein Bot-Rolle!", "The role is a bot role!"]))
          if (Role11.name == "@everyone") return message.channel.send(client.utils.translation(lang, ["Die Rolle ist die @everyone Rolle!", "The role is the @everyone role!"]))
          if (Role11.name == "everyone") return message.channel.send(client.utils.translation(lang, ["Die Rolle ist die @everyone Rolle!", "The role is the @everyone role!"]))


          let emoji = args[0];



          var emoji1 = emoji.split(':')
          if (emoji1.length > 1) {
            if(emoji1.length != 3) return message.channel.send(client.utils.translation(lang, ["Bitte nutze eingültiges Emoji!", "Please use a valid emoji!"]))
            var emojiID = emoji1[2].split('>');
            let zt = message.guild.emojis.cache.find(emj => emj.id === emojiID[0]);

            if(!zt) return message.channel.send(client.utils.translation(lang, ["Bitte nutze ein gültiges Emoji!", "Please use a valid emoji!"]))


            if (pingedmsg.reactions.cache.has(zt.id)) {
              message.channel.send(client.utils.translation(lang, ["Bitte nutze ein Emoji welches noch nicht als Reaktion benutzt wurde!", "Please use an emoji which isn't already used as a reaction!"]))
            } else {
              const reaction = await db.reactionroles.create({
                data: {

                  server: message.guild.id,
                  channel_id: message.channel.id,
                  msg_id: pingedmsg.id,
                  emoji: zt.id,
                  role_id: Role11.id
                }
              })
              pingedmsg.react(zt);

            }
          } else {
            const withEmojis = /\p{Emoji}/u

            if(!withEmojis.test(emoji)) return message.channel.send(client.utils.translation(lang, ["Bitte nutze eingültiges Emoji!", "Please use a valid emoji!"]))
            if (pingedmsg.reactions.cache) {
              if (pingedmsg.reactions.cache.has(emoji)) {
                message.channel.send(client.utils.translation(lang, ["Bitte nutze ein Emoji welches noch nicht als Reaktion benutzt wurde!", "Please use an emoji which isn't already used as a reaction!"]))
              } else {

                const reaction = await db.reactionroles.create({
                  data: {
                    server: message.guild.id,
                    channel_id: message.channel.id,
                    msg_id: pingedmsg.id,
                    emoji: emoji,
                    role_id: Role11.id
                  }
                })

                pingedmsg.react(emoji);
              }
            }
          }
          message.delete();
        } else {
          message.channel.send(client.utils.translation(lang, ['Bitte Pinge eine Nachricht um eine ReactionRole zu erstellen! \nLies bitte /help und Tabbe zu ReactionRoles!', 'Please mention a message to create a ReactionRole! \nPlease read /help and tab to ReactionRoles!']))
        }
      }
      //here will run the command

    } catch (e) {
      console.log("Error bei " + this.name + ": " + e)
    }
  }
})