const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const moment = require('moment');
const slashCommand = require("../struct/slashCommand");
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandChannelOption } = require('@discordjs/builders');


//you need to export the actual slashCommand class 

module.exports = new slashCommand({
    name: "embed", //the command name for the Slash Command
    data: new SlashCommandBuilder().setName("embed").setDescription("Create an embed!")
    .addChannelOption(new SlashCommandChannelOption().setDescription("Ping the Channel you will send the embed here.").setName("channel"))
    .addStringOption(new SlashCommandStringOption().setDescription("What should the Titel be?").setName("titel"))
    .addStringOption(new SlashCommandStringOption().setDescription("Write your Description here.").setName("description"))
    .addStringOption(new SlashCommandStringOption().setDescription("Write the color of the embed here").setName("color")),
    async execute(client, interaction) {
        try{
            let ut = client.utils;
            let db = client.db;
            let modrechte = await client.utils.slashTestRechte(interaction, client, db);
            let languageDB = await db.spracheServer.findUnique({
                where: {
                    server_id: interaction.guild.id
                }
            })
            let lang = languageDB.lang;

            const { guild } = interaction.member;
            const EmbedTitle = interaction.options.getString("titel");
            if(!EmbedTitle) return interaction.reply({content: `Please provide a title!`, ephemeral: true})
            const EmbedDescription = interaction.options.getString("description"); 
            if(!EmbedDescription) return interaction.reply({content: `Please provide a description!`, ephemeral: true})
            const EmbedColor = interaction.options.getString("color"); //same as in StringChoices //RETURNS STRING 
            if(!EmbedColor) return interaction.reply({content: `Please provide a color!`, ephemeral: true})
            
            const ChannelOption = interaction.options.getChannel("channel"); //RETURNS CHANNEL OBJECt
            if(!ChannelOption) return interaction.reply({content: `Please provide a channel!`, ephemeral: true})
            const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(interaction.channelId);
            if(!channel) return interaction.reply({content: `Please provide a valid channel!`, ephemeral: true})
            if(!channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return interaction.reply({content: `I don't have permissions to send messages in ${channel}!`, ephemeral: true})
            if(!channel.permissionsFor(interaction.member).has("SEND_MESSAGES")) return interaction.reply({content: `You don't have permissions to send messages in ${channel}!`, ephemeral: true})
            if(!channel.permissionsFor(guild.me).has("EMBED_LINKS")) return interaction.reply({content: `I don't have permissions to send embeds in ${channel}!`, ephemeral: true})
            if(!channel.permissionsFor(interaction.member).has("EMBED_LINKS")) return interaction.reply({content: `You don't have permissions to send embeds in ${channel}!`, ephemeral: true})
            if(!channel.permissionsFor(guild.me).has("VIEW_CHANNEL")) return interaction.reply({content: `I don't have permissions to view ${channel}!`, ephemeral: true})
            if(!channel.permissionsFor(interaction.member).has("VIEW_CHANNEL")) return interaction.reply({content: `You don't have permissions to view ${channel}!`, ephemeral: true})
            let embed = new MessageEmbed();
            try{
                embed.setColor(EmbedColor ? EmbedColor.toUpperCase() : "BLURPLE")
            }catch(e){
                embed.setColor("BLURPLE")
            }
            
            embed.setTitle(String(EmbedTitle))
            .setDescription(String(EmbedDescription).split("+n+").join("\n"))
            .setFooter(guild.name, guild.iconURL({dynamic: true}));
            await interaction.reply({content: `Sending the Embed...`, ephemeral: true}); 
            await channel.send({embeds: [embed]});
            interaction.editReply({content: `✅ Embed sent!`, ephemeral: true}); 
            //now it is fine, but when i let load the code:
            
        }  catch (e) {
            console.log("Error bei slash/" + this.name + ": " + e)
          }
    }

})
