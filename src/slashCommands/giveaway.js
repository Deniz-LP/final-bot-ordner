const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const moment = require('moment');
const slashCommand = require("../struct/slashCommand");
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandChannelOption } = require('@discordjs/builders');


//you need to export the actual slashCommand class 


module.exports = new slashCommand({
    name: "giveaway", //the command name for the Slash Command
    data: new SlashCommandBuilder().setName("giveaway").setDescription("Create a giveaway!")
        .addChannelOption(new SlashCommandChannelOption().setDescription("Ping the Channel you will send the embed here.").setName("channel"))
        .addStringOption(new SlashCommandStringOption().setDescription("What should the Titel be?").setName("titel"))
        .addStringOption(new SlashCommandStringOption().setDescription("Write your Description here.").setName("description"))
        .addStringOption(new SlashCommandStringOption().setDescription("Write the color of the embed here").setName("color"))
        .addStringOption(new SlashCommandStringOption().setDescription("How long should it last? (examples: '3d' = 3 days, '1w' = 1 week)").setName("time")),
    async execute(client, interaction) {
        //try {



            function isInt(value) {
                var x = parseFloat(value);
                return !isNaN(value) && (x | 0) === x;
            }


            if(!interaction.guild.me.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um Giveaways zu erstellen! #gw1", "I don't have the necessary rights to create Giveaways! #gw1"]), ephemeral: true })
            if(!interaction.guild.me.permissions.has("ADD_REACTIONS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um Giveaways zu erstellen! #gw2", "I don't have the necessary rights to create Giveaways! #gw2"]), ephemeral: true })
            if(!interaction.guild.me.permissions.has("USE_EXTERNAL_EMOJIS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um Giveaways zu erstellen! #gw3", "I don't have the necessary rights to create Giveaways! #gw3"]), ephemeral: true })
            if(!interaction.guild.me.permissions.has("MANAGE_EMOJIS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um Giveaways zu erstellen! #gw4", "I don't have the necessary rights to create Giveaways! #gw4"]), ephemeral: true })
            if(!interaction.guild.me.permissions.has("MANAGE_WEBHOOKS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um Giveaways zu erstellen! #gw5", "I don't have the necessary rights to create Giveaways! #gw5"]), ephemeral: true })
            if(!interaction.guild.me.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um Giveaways zu erstellen! #gw6", "I don't have the necessary rights to create Giveaways! #gw6"]), ephemeral: true })
            if(!interaction.guild.me.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um Giveaways zu erstellen! #gw7", "I don't have the necessary rights to create Giveaways! #gw7"]), ephemeral: true })

            let ut = client.utils;

            let db = client.db;

            let modrechte = await client.utils.slashTestRechte(interaction, client, db);

            let languageDB = await db.spracheServer.findUnique({
                where: {
                    server_id: interaction.guild.id
                }
            })
            let lang = languageDB.lang;

            if (modrechte == true) {



                

                let timesplit = interaction.options.getString("time").split("");
                let Zeit = 0;
                let EndTime = (Date.now());
                let b = 0;
                for (let a = 0; a < timesplit.length; a++) {

                    console.log(timesplit.slice(a))
                    if (isInt(timesplit[a])) {
                        Zeit = (Zeit * 10) + parseInt(timesplit[a]);

                    } else {
                        if (timesplit[a] == "s") {
                            EndTime = EndTime + (1000 * Zeit); b = 1;
                        } else if (timesplit[a].toLowerCase() == "m" || (timesplit.slice(a).join("").toLowerCase() == "min" || timesplit.slice(a).join("").toLowerCase() == "minutes" || timesplit.slice(a).join("").toLowerCase() == "minute")) {
                            EndTime = EndTime + (60 * 1000 * Zeit); b = 1;
                        } else if (timesplit[a].toLowerCase() == "h" || (timesplit.slice(a).join("").toLowerCase() == "hour" || timesplit.slice(a).join("").toLowerCase() == "hours" || timesplit.slice(a).join("").toLowerCase() == "stunde" || timesplit.slice(a).join("").toLowerCase() == "stunden")) {
                            EndTime = EndTime + (60 * 60 * 1000 * Zeit); b = 1;
                        } else if (timesplit[a].toLowerCase() == "d" || timesplit[a].toLowerCase() == "t" || (timesplit.slice(a).join("").toLowerCase() == "day" || timesplit.slice(a).join("").toLowerCase() == "days" || timesplit.slice(a).join("").toLowerCase() == "tag" || timesplit.slice(a).join("").toLowerCase() == "tage")) {
                            EndTime = EndTime + (24 * 60 * 60 * 1000 * Zeit); b = 1;
                        } else if (timesplit[a].toLowerCase() == "w" || (timesplit.slice(a).join("").toLowerCase() == "week" || timesplit.slice(a).join("").toLowerCase() == "weeks" || timesplit.slice(a).join("").toLowerCase() == "woche" || timesplit.slice(a).join("").toLowerCase() == "wochen")) {
                            EndTime = EndTime + (7 * 24 * 60 * 60 * 1000 * Zeit); b = 1;
                        } else if (timesplit[a].toLowerCase() == "j" || timesplit[a].toLowerCase() == "y" || (timesplit.slice(a).join("").toLowerCase() == "year" || timesplit.slice(a).join("").toLowerCase() == "years" || timesplit.slice(a).join("").toLowerCase() == "jahr" || timesplit.slice(a).join("").toLowerCase() == "jahre")) {
                            EndTime = EndTime + (365 * 24 * 60 * 60 * 1000 * Zeit); b = 1;
                        } else {
                            interaction.reply({
                                content: client.utils.translation(lang, ["Bei der Berechnung deiner Dauer gab es einen Error. Melde dies in meinen DMs! \n Als Zeit bitte eine Zahl, gefolgt von 's' für Sekunden, 'm' für Minuten, 'h' für Stunden, 't' für Tage, 'w' für Wochen und 'j' für Jahre.",
                                    "There was an Error while calculating the giveaway-time. Report this in my DMs! \n As time please give a number, followed by 's' for seconds, 'm' for minutes, 'h' for hours, 'd' for days, 'w' for weeks and 'y' for years."]), ephemeral: true
                            })
                            return;
                        }
                        a = 20;
                    }
                }
                if (b == 0) {
                    interaction.reply({
                        content: client.utils.translation(lang, ["Bei der Berechnung deiner Dauer gab es einen Error. Melde dies in meinen DMs! \n Als Zeit bitte eine Zahl, gefolgt von 's' für Sekunden, 'm' für Minuten, 'h' für Stunden, 't' für Tage, 'w' für Wochen und 'j' für Jahre.",
                            "There was an Error while calculating the giveaway-time. Report this in my DMs! \n As time please give a number, followed by 's' for seconds, 'm' for minutes, 'h' for hours, 'd' for days, 'w' for weeks and 'y' for years."]), ephemeral: true
                    })
                    return;
                }

                //title und desc
                let title = interaction.options.getString("titel");
                if (title == null || title == undefined) title = client.utils.translation(lang, ["Giveaway (Gewinn nicht beknnt)", "Giveaway (Prize not known)"]);

                let desc = interaction.options.getString("description");
                if (desc == null || desc == undefined) desc = client.utils.translation(lang, ["-", "-"]);



                const exampleEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(title)
                    .setDescription(desc)
                    .addField("Reagiere mit 🥳!", "um im Pot zu sein!", false)
                    .addField("Restzeit:", "=Loading=", false)
                    .setFooter('Giveaway created by ' + interaction.member.user.tag + '');

                const exampleEmbedEngl = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(title)
                    .setDescription(desc)
                    .addField("React with 🥳", "to have a chance to win", false)
                    .addField("Time left:", "=Loading=", false)
                    .setFooter('Giveaway created by ' +interaction.member.user.tag + '');

                    let channel = interaction.options.getChannel("channel");
                    if(!channel || channel.type != "GUILD_TEXT") return interaction.reply({content: `Please provide a valid channel!`, ephemeral: true})
                    if(!channel.permissionsFor(interaction.guild.me).has("SEND_MESSAGES")) return interaction.reply({content: `I don't have permissions to send messages in ${channel}!`, ephemeral: true})
                    if(!channel.permissionsFor(interaction.member).has("SEND_MESSAGES")) return interaction.reply({content: `You don't have permissions to send messages in ${channel}!`, ephemeral: true})
                    if(!channel.permissionsFor(interaction.guild.me).has("EMBED_LINKS")) return interaction.reply({content: `I don't have permissions to send embeds in ${channel}!`, ephemeral: true})
                    if(!channel.permissionsFor(interaction.member).has("EMBED_LINKS")) return interaction.reply({content: `You don't have permissions to send embeds in ${channel}!`, ephemeral: true})
                    if(!channel.permissionsFor(interaction.guild.me).has("VIEW_CHANNEL")) return interaction.reply({content: `I don't have permissions to view ${channel}!`, ephemeral: true})
                    if(!channel.permissionsFor(interaction.member).has("VIEW_CHANNEL")) return interaction.reply({content: `You don't have permissions to view ${channel}!`, ephemeral: true})

                let sent;
                if (lang === 'de') {
                    sent = await channel.send({ embeds: [exampleEmbed] });
                } else if (lang === 'en') {
                    sent = await channel.send({ embeds: [exampleEmbedEngl] });
                }
                sent.react("🥳")

                let givepossib = false;
                for (let e = 1; e <= 999999; e++) {
                    let Giveaway = await db.giveaway.findUnique({
                        where: {
                            giveaway_id: e
                        }
                    })
                    if (Giveaway == undefined) {
                        givepossib = true;
                        Giveaway = await db.giveaway.create({
                            data: {
                                giveaway_id: e,
                                channel_id: interaction.channelId,
                                desc: desc,
                                endtime: BigInt(EndTime),
                                message_id: sent.id,
                                player_id: interaction.user.id,
                                server_id: interaction.guildId,
                                title: title,
                                finished: false,
                                starttime: BigInt(Date.now()),
                                winner_id: "onGoing",


                            }
                        })
                        e = 1000000;
                    }
                }
                if (givepossib == false) {
                    interaction.reply({ content: client.utils.translation(lang, ["Zu viele Giveaways als Platz in der Datenbank. Melde dies in meinen DMs!", "To much giveaways created for the Database. Report this in my DMs!"]), ephemeral: true})
                    sent.delete();
                    return;
                }






            } else {
                interaction.reply({ content: client.utils.translation(lang, ["Du hast keine Berechtigung für diesen Command!", "You don't have the permission for this command!"]), ephemeral: true })
            }
            //here will run the command
        
    }

})
