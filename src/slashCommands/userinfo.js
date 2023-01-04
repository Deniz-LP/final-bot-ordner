const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const moment = require('moment');
const slashCommand = require("../struct/slashCommand");
const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');
const flags = {
  DISCORD_EMPLOYEE: 'Discord Employee',
  DISCORD_PARTNER: 'Discord Partner',
  BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
  BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
  HYPESQUAD_EVENTS: 'HypeSquad Events',
  HOUSE_BRAVERY: 'House of Bravery',
  HOUSE_BRILLIANCE: 'House of Brilliance',
  HOUSE_BALANCE: 'House of Balance',
  EARLY_SUPPORTER: 'Early Supporter',
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: 'Verified Bot',
  VERIFIED_DEVELOPER: 'Verified Bot Developer',
  ACTIVE_DEVELOPER: 'Active Bot Developer'
};
function trimArray(arr, maxLen = 25) {
  if (Array.from(arr.values()).length > maxLen) {
    const len = Array.from(arr.values()).length - maxLen;
    arr = Array.from(arr.values()).sort((a, b) => b.rawPosition - a.rawPosition).slice(0, maxLen);
    arr.map(role => `<@&${role.id}>`)
    arr.push(`${len} more...`);
  }
  return arr.join(", ");
}
const statuses = {
  "online": "🟢",
  "idle": "🟠",
  "dnd": "🔴",
  "offline": "⚫️",
}

module.exports = new slashCommand({
  name: "userinfo", //the command name for the Slash Command
  data: new SlashCommandBuilder().setName("userinfo").setDescription("Gives you information about a User").addUserOption(new SlashCommandUserOption().setDescription("From Which User do you want to get Information from?").setName("user")), //the command description for Slash Command Overview
  async execute(client, interaction) {
    try {
      //console.log(interaction, StringOption)
      const db = client.db;
      //things u can directly access in an interaction!
      const { member, channelId, guildId, applicationId,
        commandName, deferred, replied, ephemeral,
        options, id, createdTimestamp
      } = interaction;
      const { guild } = member;
      //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
      //const StringOption = options.getString("what_ping"); //same as in StringChoices
      let UserOption = options.getUser("user");
      if (!UserOption) UserOption = member.user;
      //let ChannelOption = options.getChannel("OPTIONNAME");
      //let RoleOption = options.getRole("OPTIONNAME");
      try {
        await guild.members.fetch();

        const member = guild.members.cache.get(UserOption.id);
        const roles = member.roles;
        const userFlags = UserOption.flags.toArray();
        const activity = UserOption.presence?.activities[0];
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor({ name: "Information about:   " + member.user.username + "#" + member.user.discriminator, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: "https://discord.gg/FQGXbypRf8" })
        embeduserinfo.addField('**❱ Username:**', `<@${member.user.id}>\n\`${member.user.tag}\``, true)
        embeduserinfo.addField('**❱ ID:**', `\`${member.id}\``, true)
        embeduserinfo.addField('**❱ Avatar:**', `[\`Link to avatar\`](${member.user.displayAvatarURL({ format: "png" })})`, true)
        embeduserinfo.addField('**❱ Date Join DC:**', "\`" + moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`" + moment(member.user.createdTimestamp).format("hh:mm:ss") + "\`", true)
        embeduserinfo.addField('**❱ Date Join Guild:**', "\`" + moment(member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`" + moment(member.joinedTimestamp).format("hh:mm:ss") + "\`", true)
        console.log(userFlags)

        embeduserinfo.addField('**❱ Flags:**', `\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``, true)
        embeduserinfo.addField('**❱ Status:**', `\`${statuses[member.user.presence?.status]} ${member.user.presence?.status}\``, true)
        embeduserinfo.addField('**❱ Highest Role:**', `${member.roles.highest.id === guild.id ? 'None' : member.roles.highest}`, true)
        embeduserinfo.addField('**❱ Is a Bot:**', `\`${member.user.bot ? "✔️" : "❌"}\``, true)
        var userstatus = "Not having an activity";
        if (activity) {
          if (activity.type === "CUSTOM_STATUS") {
            let emoji = `${activity.emoji ? activity.emoji.id ? `<${activity.emoji.animated ? "a" : ""}:${activity.emoji.name}:${activity.emoji.id}>` : activity.emoji.name : ""}`
            userstatus = `${emoji} \`${activity.state || 'Not having an acitivty.'}\``
          }else {
            userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``
          }
        }
        embeduserinfo.addField('**❱ Activity:**', `${userstatus}`)
        const permissions = member.permissions.toArray().map(p => `\`${p}\``).join(', ');
        embeduserinfo.addField('**❱ Permissions:**', rechte ? permissions : 'You have no Permission to see this!');
        embeduserinfo.addField(`❱ [${roles.cache.size}] Roles: `, roles.cache.size < 25 ? Array.from(roles.cache.values()).sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : 'None')
        interaction.reply({ embeds: [embeduserinfo], ephemeral: true })
      } catch (e) {
        console.log(e)
        const userFlags = UserOption.flags.toArray();
        const activity = UserOption.presence?.activities[0];
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(UserOption.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor({ name: "Information about:   " + UserOption.username + "#" + UserOption.discriminator, iconURL: UserOption.displayAvatarURL({ dynamic: true }), url: "https://discord.gg/FQGXbypRf8" })
        embeduserinfo.addField('**❱ Username:**', `<@${UserOption.id}>\n\`${UserOption.tag}\``, true)
        embeduserinfo.addField('**❱ ID:**', `\`${UserOption.id}\``, true)
        embeduserinfo.addField('**❱ Avatar:**', `[\`Link to avatar\`](${UserOption.displayAvatarURL({ format: "png" })})`, true)
        embeduserinfo.addField('**❱ Flags:**', `\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``, true)
        embeduserinfo.addField('**❱ Status:**', `\`${statuses[UserOption.presence?.status]} ${UserOption.presence?.status}\``, true)
        embeduserinfo.addField('**❱ Is a Bot:**', `\`${UserOption.bot ? "✔️" : "❌"}\``, true)
        var userstatus = "Not having an activity";
        if (activity) {
          if (activity.type === "CUSTOM_STATUS") {
            let emoji = `${activity.emoji ? activity.emoji.id ? `<${activity.emoji.animated ? "a" : ""}:${activity.emoji.name}:${activity.emoji.id}>` : activity.emoji.name : ""}`
            userstatus = `${emoji} \`${activity.state || 'Not having an acitivty.'}\``
          }else {
            userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``
          }
        }
        embeduserinfo.addField('**❱ Activity:**', `${userstatus}`)
        const permissions = member.permissions.toArray().map(p => `\`${p}\``).join(', ');
        embeduserinfo.addField('**❱ Permissions:**', rechte ? permissions : 'You have no Permission to see this!');
        embeduserinfo.addField(`❱ [${roles.cache.size}] Roles: `, roles.cache.size < 25 ? Array.from(roles.cache.values()).sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : 'None')


        //send the EMBED
        interaction.reply({ embeds: [embeduserinfo], ephemeral: true })
      }
    } catch (e) {
      console.log("Error bei slash/"+this.name + ": " + e)
    }
  }

})
