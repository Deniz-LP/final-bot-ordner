

const { Message, MessageEmbed } = require("discord.js");
const Event = require("../struct/Events");

/**
 * @param {Message} message12 
 */

module.exports = class ready extends Event {
  constructor(...args) {
    super(...args, {
      once: true
    });
  }


 
  async run() {
    await this.client.utils.loadSlashCommands(this.client)
    }

}