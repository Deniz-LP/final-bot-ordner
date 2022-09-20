const {Permissions, Message} = require('discord.js');
const client = require('..');
const MusicBot = require('./Client');

/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {MusicBot} client
 * @param {string} prefix
 */

async function run(message, args, client, prefix) {

}
module.exports = class Command {    
    /**
     * this are types so you can see the autocomplete in vscode
     * @typedef {{
     * name: string,
     * description: string,
     * cd: number,
     * args: boolean,
     * category: string,
     * usage: string,
     * nsfw: boolean,
     * enabled: boolean,
     * botPerms: Permissions[]
     * userPerms: Permissions[]
     * aliases: Array,
     * run: run
     * }} commandOptions
     * @param {string} name 
     * @param {commandOptions} options 
     */
    //here you can add things
    constructor(options) {
        this.name = options.name || new TypeError('Seems that this command does not have a name!!!!!!!!!')
        this.aliases = options.aliases || [];
        this.description = options.description || 'No Description'
        this.category = options.category || 'Misc'
        this.usage = options.usage || 'No usage'
        this.userPerms = options.userPerms;
        this.botPerms = options.botPerms;
        this.nsfw = options.nsfw ? true : false
        this.args = options.args ? true : false
        this.cd = options.cd || 5
        this.enabled = options.enabled ? true : false
        this.run = options.run || run()
    }
}