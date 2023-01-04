const path = require('path')
const { promisify } = require('util')
const glob = require('glob')
const Event = require('../struct/Events')
const config = require('../config')
const Command = require('../struct/Commands')
const { Message, Guild, Interaction, MessageActionRow,
  MessageEmbed,
  MessageButton,
  User,
  ReactionCollector,
} = require('discord.js')
const MusicBot = require('../struct/Client')
const globPromise = promisify(glob)
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { spracheServer } = require('../Database/PrismaClient')
const { Client } = require('undici')
const { Prisma, PrismaClient } = require('@prisma/client')
module.exports = class Utils {
  constructor(client) {
    this.client = client;
    this.sleep = false;
  }


  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  chunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i += size) {
      chunked_arr.push(array.slice(i, i + size));
    }
    return chunked_arr;
  }
  parseMs(milliseconds) {

    const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

    return {
      days: roundTowardsZero(milliseconds / 86400000),
      hours: roundTowardsZero(milliseconds / 3600000) % 24,
      minutes: roundTowardsZero(milliseconds / 60000) % 60,
      seconds: roundTowardsZero(milliseconds / 1000) % 60,
      milliseconds: roundTowardsZero(milliseconds) % 1000,
      microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
      nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
    };
  }
  /**
   * @param {MusicBot} client
   */
  async loadSlashCommands(client) {
    try {
    const commandFiles = await globPromise(`${this.directory}slashCommands/*.js`.replace(/\\/g, '/'))
    const commands = []
    for (const file of commandFiles) {
      delete require.cache[file]
      const { name } = path.parse(file)
      const command = require(file);
      if (!command?.name) continue;
      this.client.slashCommands.set(command.name.toLowerCase(), command)
      commands.push(command.data.toJSON())
    }
    const restClient = new REST({ version: '9' }).setToken(config.TOKEN);
      client.guilds.cache.forEach(async guild => {
        await restClient.put(Routes.applicationGuildCommands(config.APPLICATIONID, guild.id), { body: commands })
          .then(() => console.log('Successfully registered slash commands in Server ' + guild.name + ', a total of ' + commands.length + " commands")).catch(console.error);
      })
    } catch (e) {
      console.log(e)
    }




  }
  async loadCommands() {
    const commands = await globPromise(`${this.directory}Commands/**/*.js`.replace(/\\/g, '/'))
    for (const commandFile of commands) {
      delete require.cache[commandFile]
      const { name } = path.parse(commandFile)
      const command = require(commandFile)
      if (!command instanceof Command) throw new TypeError(`Command ${name} is not a valid command`)
      this.client.commands.set(command.name, command)
      if (command.aliases.length) {
        for (const alias of command.aliases) {
          this.client.aliases.set(alias, command.name)
        }
      }
    }
  }

  async loadEvents() {
    const events = await globPromise(`${this.directory}events/**/*.js`.replace(/\\/g, '/'))
    for (const eventFile of events) {
      delete require.cache[eventFile]
      const { name } = path.parse(eventFile)
      const File = require(eventFile)
      const event = new File(this.client, name.toLocaleLowerCase())
      if (!(event instanceof Event)) throw new TypeError(`This is a bad class`)
      this.client.events.set(event.name, event);
      event.emmiter[event.type](name, (...args) => event.run(this.client, ...args))
    }
  }

  sleeping(Welcherstatus) {
    if (Welcherstatus == true) {
      this.sleep = true;
    } else {
      this.sleep = false;
    }
  }
  isSleeping() {
    return this.sleep;
  }
  async TestRechte(message, client, db) {
    if (message.member.permissions.has("ADMINISTRATOR") || client.config.OWNERS.includes(message.author.id) || message.guild.ownerID === message.author.id) {
      return true;
    } else {
      let mod = await db.moderation.findUnique({
        where: {
          server: message.guild.id
        }
      });
      if (mod = null)
        return false;
      for (const Moderation of mod) {
        let myRole = message.guild.roles.cache.get(Moderation.role_ids);
        if (message.member.roles.cache.has(myRole)) { return true; }
      }; return false;
    }
  }

  /**
   * Creates a pagination embed
   * @param {Interaction} interaction
   * @param {MessageEmbed[]} pages
   * @param {MessageButton[]} buttonList
   * @param {number} timeout
   * @returns
   */
  paginationEmbed = async (
    interaction,
    pages,
    buttonList,
    timeout = 120000,
    lang = "en"
  ) => {
    try {
      if (!interaction) throw new Error("Interaction is not given.");
    if (!pages) throw new Error("Pages are not given.");
    if (!buttonList) throw new Error("Buttons are not given.");
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
      throw new Error(
        "Link buttons are not supported with discordjs-button-pagination"
      );
    if (buttonList.length !== 2) throw new Error("Need two buttons.");

    let page = 0;

    const row = new MessageActionRow().addComponents(buttonList);

    //has the interaction already been deferred? If not, defer the reply.
    if (interaction.deferred == false) {
      await interaction.deferReply({ /*ephemeral: true*/ });
    }

    const curPage = await interaction.editReply({
      embeds: [pages[page].setFooter({ text: this.translation(lang, [`Seite ${page + 1} / ${pages.length}`, `Page ${page + 1} / ${pages.length}`]) })],
      components: [row],
      fetchReply: true,
    });

    const filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId;

    const collector = await curPage.createMessageComponentCollector({
      filter,
      time: timeout,
    });

    collector.once("collect", async (i) => {
      switch (i.customId) {
        case buttonList[0].customId:
          page = page > 0 ? --page : pages.length - 1;
          break;
        case buttonList[1].customId:
          page = page + 1 < pages.length ? ++page : 0;
          break;
        default:
          break;
      }
      await i.deferUpdate();
      await i.editReply({
        embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
        components: [row],
      });
      collector.resetTimer();
    });

    collector.once("end", (_, reason) => {
      if (reason !== "messageDelete") {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true)
        );
        curPage.edit({
          embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
          components: [disabledRow],
        });
      }
    });

    return curPage;
  } catch (e) {
    console.log(e);
  }
};
  /**
   * 
   * @param {Interaction} interaction 
   * @param {MusicBot} client
   * @returns 
   */

  async slashTestRechte(interaction, client, db) {
    if (interaction.member.permissions.has("ADMINISTRATOR") || client.config.OWNERS.includes(interaction.member.id) || interaction.guild.ownerId === interaction.member.id) {
      return true;
    } else {


      let mod = await db.moderation.findUnique({
        where: {
          server: interaction.guild.id
        }
      });
      if (mod = null || mod == undefined)
        return false;

      for (const Moderation of mod) {
        let myRole = interaction.guild.roles.cache.get(Moderation.role_ids);
        if (interaction.member.roles.cache.has(myRole)) { return true; }
      }; return false;
    }
  }

  translation(lang, textErstDeutsch) {
    if (lang == 'de') return textErstDeutsch[0];

    return textErstDeutsch[1]
  }



  isInt(value) {
    return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
  }
  /**
    * @param {Message} message
    * @param {MusicBot} client
    */




  DeleteMessage(message, anzahl) {
    if ((message.channel.permissionsFor(this.client.user).has("MANAGE_MESSAGES"))) {

      let a = parseInt(anzahl);

      message.channel.bulkDelete(a);

    } else {

      SpracheUndSendMessagePerms("0", "Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung MANAGE_MESSAGES, <@" + message.guild.ownerID + ">.",
        "Sorry for disturb, but Jamal would like to get the permission MANAGE_MESSAGES, <@" + message.guild.ownerID + ">.");

    }
  }

  /**
   * 
   * @param {ReactionCollector} reaction 
   * @param {User} user 
   * @param {Client} client 
   * @param {PrismaClient} db 
   */

  async handleReactionRoleEdit(reaction, user, client, db, AddOrRemove) {
    if (user.bot) return;

    let emoji = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;


    let reactiondb = await db.reactionroles.findFirst({
      where: {
        server: "" + reaction.message.guild.id,
        channel_id: "" + reaction.message.channel.id,
        msg_id: "" + reaction.message.id,
        emoji: "" + emoji
      }
    })
    if (reactiondb) {
      if (AddOrRemove == "remove") {
        let role = reaction.message.guild.roles.cache.get(reactiondb.role_id);
        let user2 = reaction.message.guild.members.cache.get(user.id);
        if (user2.roles.cache.some(role => role.id === reactiondb.role_id)) {
          user2.roles.remove(role);
        }
        return;
      } else if (AddOrRemove == "add") {
        let role = reaction.message.guild.roles.cache.get(reactiondb.role_id);
        let user2 = reaction.message.guild.members.cache.get(user.id);
        if (!user2.roles.cache.some(role => role.id === reactiondb.role_id)) {
          user2.roles.add(role);
        }
      }
    }


  }
  

  async InteractionCommandButton(interaction, client) {
    if (interaction.isCommand()) {

      const command = client.slashCommands.get(interaction.commandName.toLowerCase());
      if (!command) return;

      try {
        command.execute(client, interaction);
      } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
          interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {

          interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }


    } else if (interaction.isButton()) {
      if (interaction.customId.includes('-button')) {
        if (interaction.customId.includes('danger')) {
          await interaction.reply({ content: 'You clicked on the danger button! #ED4245' });

        } else if (interaction.customId.includes('success')) {
          await interaction.reply({ content: 'You clicked on the success button! #58F287' });


        } else if (interaction.customId.includes('primary')) {
          await interaction.reply({ content: 'You clicked on the primary button! #5865F2' });


        }


      }


    }
  }
}