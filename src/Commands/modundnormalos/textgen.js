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
    name: 'textgen',
    aliases: ['textgenerator', 'text'],
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

            let completion;
            try {
                completion = await openai.createCompletion({
                    model: "text-curie-001",
                  prompt: eingabe,
                  temperature: 0.7,
                  max_tokens: 250
                });
                console.log(completion.data.choices[0].text);
                
                response = completion;
              } catch (error) {
                if (error.response) {
                  console.log(error.response.status);
                  console.log(error.response.data);
                } else {
                  console.log(error.message);
                }
              }
            
            if(completion.data.choices[0].text.length >= 2000){
                console.log("Zu viele Zeichen ig?")
                message.reply("Error. Please DM the bot with Screenshots and timestamp.");
                return;
            }
            console.log(eingabe)
            message.reply(""+ completion.data.choices[0].text);
            

        } catch (e) {
            console.log("Error bei " + this.name + ": " + e)
        }
    }
}) 