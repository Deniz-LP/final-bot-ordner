const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const moment = require('moment');
const slashCommand = require("../struct/slashCommand");
const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');


//you need to export the actual slashCommand class 

module.exports = new slashCommand({
    name: "NAME DES COMMANDS", //the command name for the Slash Command
    data: new SlashCommandBuilder().setName("NAME DES COMMANDS").setDescription("DESCRIPTION DES COMMANDS").addUserOption(new SlashCommandUserOption().setDescription("PING USERß?").setName("pingeduser")), //add more options if you want
    async execute(client, interaction) {
        try{
            let ut = client.utils;
            let db = client.db;
            let modrechte = await client.utils.TestRechte(message, client, db);
            let languageDB = await db.spracheServer.findUnique({
                where: {
                    server_id: message.guild.id
                }
            })
            let lang = languageDB.lang;



            if (client.config.OWNERS.includes(message.member.id)) {
            }

            if (modrechte == true) {

            }

            

            interaction.reply({embeds: [embeduserinfo], ephemeral: true})
        }  catch (e) {
            console.log("Error bei slash/" + this.name + ": " + e)
          }
    }

})
