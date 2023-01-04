//this is the template for commands
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require('moment');
const slashCommand = require("../struct/slashCommand");
const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');


//you need to export the actual slashCommand class 

module.exports = new slashCommand({
    name: "JamalHelp", //the command name for the Slash Command
    data: new SlashCommandBuilder().setName("jamalhelp").setDescription("Need help from Jamal?"), //add more options if you want
    async execute(client, interaction) {
        try {
          



            let data = await client.db.spracheServer.findUnique({
                where: {
                    server_id: interaction.guild.id
                }
            })
            let lang = data.lang;

            let pages; let buttonlist;

            if (lang === 'de') {

                const embed1 = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Help Command:")
                .setDescription("[] = Argumente (optional), \n() = Argumente (Eingabe erfordert), \n~ = Nur für User mit Admin-Perms oder Mod-Perms (?mod roles)!")
                .addField("-", "-", false)
                //.addField("**EINIGE COMMANDS SIND NOCH NICHT AKTIV, DER BOT WIRD UMGESCHRIEBEN**", "**DAS KÖNNTE EINE GEWISSE ZEIT IN ANSPRUCH NEHMEN; DAFÜR GIBT ES BALD ABER EINIGE FEATURES!**", false)
                //.addField("-", "-", false)
                .addField("~mod (add/remove) @role", "Füge ein Rolle hinzu, welche die ~-Commands bedienen können, oder entferne eine Rolle!", false)
                .addField("mod roles", "Lasse dir anzeigen, welche Rollen die Rechte auf ~-Commands haben!", false)
                .addField("musik", "Bitte schreibe **?musik** für detalliertere Infos!", false)
                .addField("level", "Bitte schreibe **?level help** für detalliertere Infos!", false)
                .addField('-','More Questions? DM the Bot! - Created by ' + interaction.member.user.tag);
        

                    const  embed2 = new MessageEmbed() 
                    .setColor("RANDOM")
                    .setTitle("Help Command:")
                    
                    //.addField("~counting", "Bitte schreibe ?counting help für detalliertere Infos!", false)
            .addField("~giveaway", "Bitte schreibe **?giveaway help** für detalliertere Infos!", false)
            .addField("textgen/bildgen", "Bitte schreibe **?ai** für detalliertere Infos!", false)
    
            .addField("~clearchat/cc (Anzahl)", "Lösche eine gewisse Anzahl an Nachrichten in einem Channel.", false)
            .addField("~lang", "Setze die Sprache auf deinem Server. (Beispiel: ?lang de)", false)
            .addField("~joinrole @role", "Setze eine Rolle, die der Bot jedem neuen User gibt!", false)
            .addField('-','More Questions? DM the Bot! - Created by ' + interaction.member.user.tag);
            
            const  embed3 = new MessageEmbed() 
            .setColor("RANDOM")
            .setTitle("Help Command:")
            .addField("embed", "Erstelle ein Custom Embed! (Folge die Schritte, die dir der Bot sagt!) \n(Schreibe 'cancel' um die Generation abzubrechen!)", false)
            .addField("~reactionroles/rr", "Erstelle eine ReactionRole! (Bitte 'reply' einer Nachricht, und schreibe ein emoji nach dem Command + pinge eine Rolle)", false)
            .addField("~unreact", "Lösche alle Reaktionen auf einer Nachricht!", false)
            .addField("userinfo", "Erhalte Info über dich oder üner einen gepingten User!", false)
            .addField('-','More Questions? DM the Bot! - Created by ' + interaction.member.user.tag);
            
            


                    const button1 = new MessageButton()
                    .setCustomId('previousbtn')
                    .setLabel('Zurück')
                    .setStyle('DANGER');

                    const button2 = new MessageButton()
                    .setCustomId('nextbtn')
                    .setLabel('Weiter')
                    .setStyle('SUCCESS');
                    pages = [embed1, embed2, embed3];

                    buttonlist = [button1, button2,];

            } else if (lang === 'en') {


                const embed1 = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Help Command:")
                .setDescription("[] = Arguments (optional), () = Arguments (needed!), \n~: Only for User with Admin or Mod-Perms (?mod roles)!")
                .addField("-", "-", false)
                //.addField("**A FEW COMMANDS ARE NOT ACTIVE RIGHT NOW, THE BOT WILL BE RECODET**", "**THIS WILL LAST TILL A BIT; BUT THERE WILL BE NEW FEATURES!**", false)
                //.addField("-", "-", false)
                .addField("~mod (add/remove) @role", "Add a role, which is allowed to use ~-Commands or remove it!", false)
                .addField("mod roles", "Show, which roles have the permission to use Mod(~)-Commands!", false)
                .addField("-", "-", false)
                .addField("music", "Please write **?music** for more detailed information about the Musik Bot!", false)
                .addField("level", "Please write **?level help** for more detailed information!", false)
                .addField('-','More Questions? DM the Bot! - Created by ' + interaction.member.user.tag);
        

                    const  embed2 = new MessageEmbed() 
                    .setColor("RANDOM")
                    .setTitle("Help Command:")
                     //.addField("~counting", "Please write **" + Prefix + "counting help** for more detailed information!", false)
              .addField("textgen/picturegen", "Please write **?ai** for more detailed information!", false)
              .addField("-", "-", false)
      
              .addField("~clearchat/cc (Anzahl)", "Delete a specific amount of Messages in a channel.", false)
              .addField("~lang", "Change the language in this server. (Example: ?lang de)", false)
              .addField("~joinrole @role", "Set the role which every new user gets when she/he joines your server!!", false)
              .addField('-','More Questions? DM the Bot! - Created by ' + interaction.member.user.tag);
              
            const  embed3 = new MessageEmbed() 
            .setColor("RANDOM")
            .setTitle("Help Command:")
            .addField("embed", "Create a custom Embed! (Follow the steps the bot tells you!) \n(Type 'cancel' to... yes, cancel the generation!)", false)
            .addField("~reactionroles/rr", "Create a ReactionRole! (Please reply to a message, write an emoji and ping a Role)", false)
            .addField("~unreact", "Delete all reactions on a message!", false)
            .addField("userinfo", "Get Information about you or ping a user!", false)
            .addField('-','More Questions? DM the Bot! - Created by ' + interaction.member.user.tag);
            
            


                    const button1 = new MessageButton()
                    .setCustomId('previousbtn')
                    .setLabel('Previous')
                    .setStyle('DANGER');

                    const button2 = new MessageButton()
                    .setCustomId('nextbtn')
                    .setLabel('Next')
                    .setStyle('SUCCESS');
                    pages = [embed1, embed2, embed3];

                    buttonlist = [button1, button2,];

    
                    
            }
            client.utils.paginationEmbed(interaction, pages, buttonlist, 20 * 1000, lang);


        } catch (e) {
            console.log("Error bei slash/" + this.name + ": " + e)
        }
    }

})