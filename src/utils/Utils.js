const path = require('path')
const { promisify } = require('util')
const glob = require('glob')
const Event = require('../struct/Events')
const config = require('../config')
const Command = require('../struct/Commands')
const { Message } = require('discord.js')
const MusicBot = require('../struct/Client')
const globPromise = promisify(glob)
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
async TestRechte(message, client, db){
     if (message.member.permissions.has("ADMINISTRATOR") || client.config.OWNERS.includes(message.author.id) || message.guild.ownerID === message.author.id) {
      return true;} else {
      let mod = await db.moderation.findUnique({
        where: {
          server: message.guild.id
        }});if(mod = null)
        return false;
for (const Moderation of mod) {
let myRole = message.guild.roles.cache.get(Moderation.role_ids);
        if (message.member.roles.cache.has(myRole)) {return true;}
};return false;}
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
}