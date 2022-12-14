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
        .setDescription("[] = Argumente (optional), () = Argumente (Eingabe erfordert), \n~: Nur für User mit Admin-Perms oder Mod-Perms (" + Prefix + "mod roles)!")
        .addField("-", "-", false)
        //.addField("**EINIGE COMMANDS SIND NOCH NICHT AKTIV, DER BOT WIRD UMGESCHRIEBEN**", "**DAS KÖNNTE EINE GEWISSE ZEIT IN ANSPRUCH NEHMEN; DAFÜR GIBT ES BALD ABER EINIGE FEATURES!**", false)
        //.addField("-", "-", false)
        .addField("~mod (add/remove) @role", "Füge ein Rolle hinzu, welche die ~-Commands bedienen können, oder entferne eine Rolle!", false)
        .addField("mod roles", "Lasse dir anzeigen, welche Rollen die Rechte auf ~-Commands haben!", false)
        .addField("musik", "Bitte schreibe **" + Prefix + "musik** für detalliertere Infos!", false)
        .addField("level", "Bitte schreibe **" + Prefix + "level help** für detalliertere Infos!", false)

        .addField("~counting", "Bitte schreibe " + Prefix + "counting help für detalliertere Infos!", false)
        .addField("~giveaway", "Bitte schreibe **" + Prefix + "giveaway help** für detalliertere Infos!", false)
        .addField("textgen/bildgen", "Bitte schreibe **" + Prefix + "ai** für detalliertere Infos!", false)
        .addField("-", "-", false)

        .addField("~clearchat/cc (Anzahl)", "Lösche eine gewisse Anzahl an Nachrichten in einem Channel.", false)
        .addField("~lang", "Setze die Sprache auf deinem Server. (Beispiel: " + Prefix + "lang de)", false)
        .addField("~joinrole @role", "Setze eine Rolle, die der Bot jedem neuen User gibt!", false)
        .addField("embed", "Erstelle ein Custom Embed! (Folge die Schritte, die dir der Bot sagt!) \n(Schreibe 'cancel' um die Generation abzubrechen!)", false)
        .addField("~reactionroles/rr", "Erstelle eine ReactionRole! (Bitte 'reply' einer Nachricht, und schreibe ein emoji nach dem Command + pinge eine Rolle)", false)
        .addField("~unreact", "Lösche alle Reaktionen auf einer Nachricht!", false)
        .addField("-", "Bei Fehlern bitte den Bot DMen oder Dengonomiya#0752 anschreiben (DM bringt mehr).", false)
        .setFooter('More Questions? DM the Bot! - Created by ' + message.author.tag);

      const exampleEmbedEngl = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Help Command:")
        .setDescription("[] = Arguments (optional), () = Arguments (needed!), \n~: Only for User with Admin or Mod-Perms (" + Prefix + "mod roles)!")
        .addField("-", "-", false)
        //.addField("**A FEW COMMANDS ARE NOT ACTIVE RIGHT NOW, THE BOT WILL BE RECODET**", "**THIS WILL LAST TILL A BIT; BUT THERE WILL BE NEW FEATURES!**", false)
        //.addField("-", "-", false)
        .addField("~mod (add/remove) @role", "Add a role, which is allowed to use ~-Commands or remove it!", false)
        .addField("mod roles", "Show, which roles have the permission to use Mod(~)-Commands!", false)
        .addField("-", "-", false)
        .addField("music", "Please write **" + Prefix + "music** for more detailed information about the Musik Bot!", false)
        .addField("level", "Please write **" + Prefix + "level help** for more detailed information!", false)

        .addField("~counting", "Please write **" + Prefix + "counting help** for more detailed information!", false)
        .addField("~counting", "Please write **" + Prefix + "giveaway help** for more detailed information!", false)
        .addField("textgen/picturegen", "Please write **" + Prefix + "ai** for more detailed information!", false)
        .addField("-", "-", false)

        .addField("~clearchat/cc (Anzahl)", "Delete a specific amount of Messages in a channel.", false)
        .addField("~lang", "Change the language in this server. (Example: " + Prefix + "lang de)", false)
        .addField("~joinrole @role", "Set the role which every new user gets when she/he joines your server!!", false)
        .addField("embed", "Create a custom Embed! (Follow the steps the bot tells you!) \n(Type 'cancel' to... yes, cancel the generation!)", false)
        .addField("~reactionroles/rr", "Create a ReactionRole! (Please reply to a message, write an emoji and ping a Role)", false)
        .addField("~unreact", "Delete all reactions on a message!", false)
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