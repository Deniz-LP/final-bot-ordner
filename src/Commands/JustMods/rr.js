//this is the template for commands
const { Message } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");

/**
 * @param {Message} pingedmsg
 * 
 */
module.exports = new Command({
  name: 'rrr',
  aliases: ['reactionrole', "role", "reactionr", "rrole"],
  description: '',
  usage: '<@role>',
  cd: 10,

  /**
   * 
   * @param {Message} pingedmsg
   */
  async run(message, args, client, Prefix) {

    
    let modrechte = client.utils.TestRechte(message);
    let con = client.db.con;
    if (modrechte == true && 1==2) {
      let db = client.db;
        let languageDB = await db.spracheServer.findUnique({where: {
            server_id: message.guild.id
          }})
        let lang = languageDB.lang;
        
      if (message.reference != null) {
        let pingedmsg = message;;
        pingedmsg = await new Promise((resolve, reject) => {
          resolve(message.channel.messages.fetch(message.reference.messageId))
        })

        console.log(pingedmsg)
        console.log(pingedmsg.reactions)

        //Promise.resolve(pingedmsg);

        let Role11 = message.mentions.roles.first();
        let emoji = args[0];
        var emoji1 = emoji.split(':')
        console.log(emoji1)

        if (emoji1.length >= 1) {
          var emojiID = emoji1[2].split('>');
          zt = message.guild.emojis.cache.find(emj => emj.id === emojiID[1]);

          console.log(zt)
          if (pingedmsg.reactions.cache.has(zt.id)) {
            message.channel.send(lang, ["Bitte nutze ein Emoji welches noch nicht als Reaktion benutzt wurde!", "Please use an emoji which isn't already used as a reaction!"])
          } else {
            pingedmsg.react(zt);
            sql = 'INSERT INTO ReactionRoles (server_id, channel_id, msg_id, emoji, role_id) VALUES (' + message.guild.id + ', ' + message.channel.id + ", " + pingedmsg.id + ', ' + zt.id + ',' + Role11.id + ")";
            con.query(sql);

            //message.delete();
          }
        } else {
          if (pingedmsg.reactions.cache) {
            console.log(2)
            if (pingedmsg.reactions.cache.has(emoji)) {
              console.log(3)
              message.channel.send(lang, ["Bitte nutze ein Emoji welches noch nicht als Reaktion benutzt wurde!", "Please use an emoji which isn't already used as a reaction!"])
            } else {
              console.log(4)
              pingedmsg.react(emoji);
              let emoji1 = '"' + emoji + '"';
              sql = 'INSERT INTO ReactionRoles (server_id, channel_id, msg_id, emoji, role_id) VALUES (' + message.guild.id + ', ' + message.channel.id + ", " + pingedmsg.id + ", " + emoji1 + ',' + Role11.id + ")";
              con.query(sql);
              // message.delete();
            }
          }
        }
      } else {
        message.channel.send(lang, ["Bitte Pinge eine Nachricht um eine ReactionRole zu erstellen!", "Please mention a message to create a ReactionRole!"])
      }
    }
    //here will run the command

  }
})