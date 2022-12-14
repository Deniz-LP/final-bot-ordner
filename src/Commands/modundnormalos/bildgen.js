//this is the template for commands
const { Client } = require("discord.js");
const Command = require("../../struct/Commands");
const { Configuration, OpenAIApi } = require("openai");
const Utils = require("../../utils/Utils");
/**
 * @param {Client} client  
 */
const configuration =  new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);


module.exports = new Command({
    name: 'bildgen',
    aliases: ['bildgenerator', 'bild', 'picture', "picturegen", "picturegenerator", "picgen", "picturegenerator"],
    description: '',
    usage: '<>',
    cd: 10,
    async run(message, args, client, Prefix) {
        try {
            let ut = client.utils;
            let db = client.db;
            let languageDB = await db.spracheServer.findUnique({
                where: {
                    server_id: message.guild.id
                }
            })
            let lang = languageDB.lang;

            //"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"
           

            let eingabe = "";

            for(let a = 0; a < args.length; a++){
                eingabe = eingabe + args[a] + " "
            }

            let response;
            try {
              response = await openai.createImage({
                prompt: eingabe,
                n: 1,
                size: "1024x1024",
              });
              console.log(response.data.data[0].url);
            } catch (error) {
              if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
              } else {
                console.log(error.message);
              }
            }
            
            
            console.log(eingabe)
            message.reply(""+ response.data.data[0].url);
            

        } catch (e) {
            console.log("Error bei " + this.name + ": " + e)
        }
    }
}) 