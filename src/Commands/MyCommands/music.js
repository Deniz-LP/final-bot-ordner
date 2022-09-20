//this is the template for commands
const { MessageEmbed } = require("discord.js");
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
    name: 'music',
    aliases: ['musik'],
    description: 'Music help',
    usage: '<none>',
    cd: 10,
    async run (message, args, client, Prefix) {
        
        let modrechte = client.utils.TestRechte(message);
        let ut = client.utils;
        
        let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;


        const exampleEmbed2 = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Musik Help Command:")


            .addField("play/p [Link/Suchbegriff]", "Spiele Tracks ab, in deinem aktuellen VC. (Link möglich!)", false)
            .addField("skip/s", "Der aktuelle Track wird übersprungen", false)
            .addField("stop/leave/l", "Der Bot löscht alle Tracks in der Warteschlange", false)
            .addField("loopqueue/loop", "Lasse deine Queue immer wiederholen", false)
            .addField("queue/q", "Lass deine folgenden Tracks anzeigen (anklickbar!)", false)
            .addField("shuffle/mix", "Überraschung :D", false)
            .setFooter('Created by ' + message.author.tag);

          const exampleEmbedEngl2 = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Musik Help Command:")


            .addField("play/p [Link/search term]", "Play a track in your VC. (Links are writeable!)", false)
            .addField("skip/s", "Skip the current track", false)
            .addField("stop/leave/l", "Bot is deleting all stored tracks", false)
            .addField("loopqueue/loop", "Your Queue qill be looped", false)
            .addField("queue/q", "The following Tracks will be shown (clickable!)", false)
            .addField("shuffle/mix", "Surprise  :D", false)
            .setFooter('Created by ' + message.author.tag);

        if(lang == "de"){
            message.reply({embeds: [exampleEmbed2]})
        }else{
            message.reply({embeds: [exampleEmbedEngl2]})
        }


        //here will run the command
        
    }  
})