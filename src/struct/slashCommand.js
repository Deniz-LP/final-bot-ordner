const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction} = require("discord.js");
const Client = require("../struct/Client");
/**
 * 
 * @param {CommandInteraction} interaction 
 * @param {Client} client
 */
async function execute(client, interaction) {
    await interaction.reply("Pong!");
}

module.exports = class slashCommand {
    /**
     * @typedef {{
     * name: string,
     * data: SlashCommandBuilder,
     * execute: execute
     * }} commandOptions
     * @param {commandOptions} cmd 
     */
    constructor(cmd = {})
    {
        this.name = cmd.name || new TypeError('Seems that this command does not have a name!!!!!!!!!');
        this.data = cmd.data;
        this.execute = cmd.execute;
    }
}