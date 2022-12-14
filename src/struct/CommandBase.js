//this is the template for commands
const { Client } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
/**
 * @param {Client} client  
 */
module.exports = new Command({
    name: '',
    aliases: [''],
    description: '',
    usage: '<>',
    cd: 10,
    async run(message, args, client, Prefix) {
        try {
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

        } catch (e) {
            console.log("Error bei " + this.name + ": " + e)
        }
    }
}) 