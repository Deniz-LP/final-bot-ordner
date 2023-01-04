//this is the template for commands
const { MessageEmbed } = require("discord.js");
const Command = require("../../struct/Commands");
module.exports = new Command({
  name: 'help',
  aliases: [''],
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
      .setTitle("Help Command:")
      .setDescription("Use slash commands (/) to use the bot")
      .addField("UPDATE", "Please use /jamalhelp um die Hilfeseite zu erreichen", false)
      .setFooter('More Questions? DM the Bot! - Created by ' + message.author.tag);
        
      const exampleEmbedEngl = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Help Command:")
      .setDescription("Use slash commands (/) to use the bot")
      .addField("UPDATE", "Please use /jamalhelp for the Help Menu!", false)
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