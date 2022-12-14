//this is the template for commands
const { MessageEmbed } = require("discord.js");
const Command = require("../../struct/Commands");
module.exports = new Command({
  name: 'ai',
  aliases: ['aihelp'],
  description: '',
  usage: '<>',
  cd: 10,
  async run(message, args, client, Prefix) {
    //here will run the command
    /**
     * @type {Command[]}
     */
    //let commands = Array.from(client.commands.values())

    //let embed = new MessageEmbed()
    //embed.addField('Commands:', 
    //commands.map(cmd=> {
    //  return `**${cmd.name}**`
    //}).join(' ')
    //)
    try {
      const exampleEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("AI Commands:")
       .addField("-", "-", false)
        //.addField("**EINIGE COMMANDS SIND NOCH NICHT AKTIV, DER BOT WIRD UMGESCHRIEBEN**", "**DAS KÖNNTE EINE GEWISSE ZEIT IN ANSPRUCH NEHMEN; DAFÜR GIBT ES BALD ABER EINIGE FEATURES!**", false)
        //.addField("-", "-", false)
        
        .addField("textgen <Input>", "Erhalte eine von einer AI automatisch erzeugten Nachricht! (Probiere: ?textgen Erzähl mir was über die Photosynthese)", false)
        .addField("bildgen <Input>", "Erhalte ein von einer AI automatisch erzeugtes Bild! (Probiere: ?bildgen Hund und Katze starren in den Sonnenuntergang)", false)
        .addField("-", "Bei Fehlern bitte den Bot DMen oder Dengonomiya#0752 anschreiben (DM bringt mehr).", false)
        .setFooter('More Questions? DM the Bot! - Created by ' + message.author.tag);

      const exampleEmbedEngl = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("AI Commands:")
        .addField("-", "-", false)
        //.addField("**A FEW COMMANDS ARE NOT ACTIVE RIGHT NOW, THE BOT WILL BE RECODET**", "**THIS WILL LAST TILL A BIT; BUT THERE WILL BE NEW FEATURES!**", false)
        //.addField("-", "-", false)
        
        .addField("textgen <Input>", "Get an AI generated message! (Try it: ?textgen Tell me something about photosynthesis)", false)
        .addField("picturegen/picgen <Input>", "Get an AI generated picute! (Try it: ?bildgen dog and cat are watching the sunset)", false)
        .addField("-", "When the bot shows mistakes, please instantly report this with DMing the bot or contacting Dengonomiya#0752 (DMing optimal).", false)
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
    } catch (e) {
      console.log("Error bei " + this.name + ": " + e)
    }
  }

})