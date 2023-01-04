const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const moment = require('moment');
const slashCommand = require("../struct/slashCommand");
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandRoleOption, SlashCommandStringOption } = require('@discordjs/builders');


//you need to export the actual slashCommand class 

module.exports = new slashCommand({
    name: "ReactionRole", //the command name for the Slash Command
    data: new SlashCommandBuilder().setName("rr").setDescription("Create a reaction Role!")
        .addRoleOption(new SlashCommandRoleOption().setDescription("Which should be added/removed?").setName("role"))
        .addStringOption(new SlashCommandStringOption().setDescription("Which emoji should be used?").setName("emoji"))
        .addStringOption(new SlashCommandStringOption().setDescription("Which Title should your Reactionrole have?").setName("titel"))
        .addStringOption(new SlashCommandStringOption().setDescription("Which Textmessage should be the message? (example: React %greenRole% for a green Name!)").setName("text")), //add more options if you want
    async execute(client, interaction) {
       
        console.log(1)
            try {
                let db = client.db;
                let modrechte = await client.utils.slashTestRechte(interaction, client, db);
                if (modrechte == true) {
                    let languageDB = await db.spracheServer.findUnique({
                        where: {
                            server_id: interaction.guild.id
                        }
                    })
                    let lang = languageDB.lang;
                    if (!interaction.guild.me.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um ReactionRoles zu erstellen! #gw1", "I don't have the necessary rights to create ReactionRoles! #gw1"]), ephemeral: true })
                    if (!interaction.guild.me.permissions.has("ADD_REACTIONS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um ReactionRoles zu erstellen! #gw2", "I don't have the necessary rights to create ReactionRoles! #gw2"]), ephemeral: true })
                    if (!interaction.guild.me.permissions.has("USE_EXTERNAL_EMOJIS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um ReactionRoles zu erstellen! #gw3", "I don't have the necessary rights to create ReactionRoles! #gw3"]), ephemeral: true })
                    if (!interaction.guild.me.permissions.has("MANAGE_EMOJIS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um ReactionRoles zu erstellen! #gw4", "I don't have the necessary rights to create ReactionRoles! #gw4"]), ephemeral: true })
                    if (!interaction.guild.me.permissions.has("MANAGE_WEBHOOKS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um ReactionRoles zu erstellen! #gw5", "I don't have the necessary rights to create ReactionRoles! #gw5"]), ephemeral: true })
                    if (!interaction.guild.me.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um ReactionRoles zu erstellen! #gw6", "I don't have the necessary rights to create ReactionRoles! #gw6"]), ephemeral: true })
                    if (!interaction.guild.me.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um ReactionRoles zu erstellen! #gw7", "I don't have the necessary rights to create ReactionRoles! #gw7"]), ephemeral: true })

                    let role = interaction.options.getRole("role");
                    let emoji = interaction.options.getString("emoji");
                    let text = interaction.options.getString("text");
                    let titel = interaction.options.getString("titel");

                    if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({ content: client.utils.translation(lang, ["Ich habe nicht die nötigen Rechte um ReactionRoles zu erstellen! #gw8", "I don't have the necessary rights to create ReactionRoles! #gw8"]), ephemeral: true })

                    if (!role) return interaction.reply({ content: client.utils.translation(lang, ["Du hast keine Rolle angegeben!", "You didn't specify a role!"]), ephemeral: true })
                    if (!emoji) return interaction.reply({ content: client.utils.translation(lang, ["Du hast kein Emoji angegeben!", "You didn't specify an emoji!"]), ephemeral: true })
                    if (!text) return interaction.reply({ content: client.utils.translation(lang, ["Du hast keinen Text angegeben!", "You didn't specify a text!"]), ephemeral: true })
                    if (!titel) return interaction.reply({ content: client.utils.translation(lang, ["Du hast keinen Titel angegeben!", "You didn't specify a title!"]), ephemeral: true })



                    if (role.position >= interaction.guild.me.roles.highest.position) return interaction.reply({ content: client.utils.translation(lang, ["Die Rolle ist zu hoch für mich!", "The role is too high for me!"]), ephemeral: true })
                    if (role.position >= interaction.member.roles.highest.position) return interaction.reply({ content: client.utils.translation(lang, ["Die Rolle ist zu hoch für dich!", "The role is too high for you!"]), ephemeral: true })
                    if (role.managed) return interaction.reply({ content: client.utils.translation(lang, ["Die Rolle ist eine Managed Rolle!", "The role is a Managed role!"]), ephemeral: true })
                    if (role.name == "@everyone") return interaction.reply({ content: client.utils.translation(lang, ["Die Rolle ist die @everyone Rolle!", "The role is the @everyone role!"]), ephemeral: true })
                    if (role.name == "everyone") return interaction.reply({ content: client.utils.translation(lang, ["Die Rolle ist die @everyone Rolle!", "The role is the @everyone role!"]), ephemeral: true })




                    var emoji1 = emoji.split(':')
                    console.log(emoji1)
                    if (emoji1.length > 1) {
                        if (emoji1.length != 3) return interaction.reply({ content: client.utils.translation(lang, ["Bitte nutze ein gültiges Emoji!", "Please use a valid emoji!"]), ephemeral: true })
                        var emojiID = emoji1[2].split('>');
                        let zt = interaction.guild.emojis.cache.find(emj => emj.id === emojiID[0]);

                        if (!zt) return interaction.reply({ content: client.utils.translation(lang, ["Bitte nutze ein gültiges Emoji!", "Please use a valid emoji!"]), ephemeral: true })


                        if (pingedmsg.reactions.cache.has(zt.id)) {
                            interaction.reply({ content: client.utils.translation(lang, ["Bitte nutze ein Emoji welches noch nicht als Reaktion benutzt wurde!", "Please use an emoji which isn't already used as a reaction!"]), ephemeral: true })
                        } else {

                            const exampleEmbed = new MessageEmbed()
                                .setColor("RANDOM")
                                .setTitle(titeltext)
                                .setDescription(desctext)
                                .setFooter('Created by ' + interaction.member.user.tag + '');

                            interaction.reply({ content: client.utils.translation(lang, ["ReactionRole wird erstellt!", "ReactionRole is being created!"]), ephemeral: true })
                            const pingedmsg = await interaction.channel.send({ embeds: [exampleEmbed] });
                            interaction.editReply({ content: client.utils.translation(lang, ["ReactionRole erfolgreich erstellt! ✅", "ReactionRole successfully created! ✅"]), ephemeral: true })



                            const reaction = await db.reactionroles.create({
                                data: {

                                    server: interaction.guild.id,
                                    channel_id: interaction.channel.id,
                                    msg_id: pingedmsg.id,
                                    emoji: zt.id,
                                    role_id: role.id
                                }
                            })
                            pingedmsg.react(zt);

                        }
                    } else {
                        const withEmojis = /\p{Emoji}/u

                        if (!withEmojis.test(emoji)) return interaction.reply({ content: client.utils.translation(lang, ["Bitte nutze eingültiges Emoji!", "Please use a valid emoji!"]), ephemeral: true })
                        if (pingedmsg.reactions.cache) {
                            if (pingedmsg.reactions.cache.has(emoji)) {
                                interaction.reply({ content: client.utils.translation(lang, ["Bitte nutze ein Emoji welches noch nicht als Reaktion benutzt wurde!", "Please use an emoji which isn't already used as a reaction!"]), ephemeral: true })
                            } else {

                                const exampleEmbed = new MessageEmbed()
                                .setColor("RANDOM")
                                .setTitle(titeltext)
                                .setDescription(desctext)
                                .setFooter('Created by ' + interaction.member.user.tag + '');

                            interaction.reply({ content: client.utils.translation(lang, ["ReactionRole wird erstellt!", "ReactionRole is being created!"]), ephemeral: true })
                            const pingedmsg = await interaction.channel.send({ embeds: [exampleEmbed] });
                            interaction.editReply({ content: client.utils.translation(lang, ["ReactionRole erfolgreich erstellt! ✅", "ReactionRole successfully created! ✅"]), ephemeral: true })



                            const reaction = await db.reactionroles.create({
                                data: {

                                    server: interaction.guild.id,
                                    channel_id: interaction.channel.id,
                                    msg_id: pingedmsg.id,
                                    emoji: zt.id,
                                    role_id: role.id
                                }
                            })

                                pingedmsg.react(emoji);
                            }
                        }
                    }

                }

                //here will run the command

            } catch (e) {
                console.log("Error bei " + this.name + ": " + e)
            }



            interaction.reply({ embeds: [embeduserinfo], ephemeral: true })
        
    }

})
