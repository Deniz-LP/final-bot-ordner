const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Command = require("../../struct/Commands");
module.exports = new Command({
    name: 'queue',
    aliases: ['q', 'que', 'queu'],
    description: 'see queue',
    usage: '<empty>',
    cd: 10,
    async run (message, args, client) {
        //here will run the command
        let pl = client.music.manager.get(message.guild.id);
        if (!pl || !pl?.queue?.size){
            // message.reply('Put some songs')
            let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;

            const exampleEmbedDe = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Schwagers Musikbot:")
    
            .addField("Die Warteschlange ist leer!", "Füge erst was hinzu!");

            const exampleEmbedEn = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Schwagers Musikbot:")
    
            .addField("There are no more Songs in the queue!", "Add something!");
            if(lang == "en"){
                 message.reply({embeds: [exampleEmbedEn]});
            }else if(lang == "de"){
                 message.reply({embeds: [exampleEmbedDe]});
            }
            return;
            
        }
        let q = Array.from(pl.queue)
        q.forEach((n, i)=> n.index = i+1);
        let queue = client.utils.chunk(q, 10)

        let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('back')
            .setStyle('PRIMARY')
            .setEmoji('⬅️')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('next')
            .setStyle('PRIMARY')
            .setEmoji('➡️')
        )

        let embed = new MessageEmbed()
        embed.setTitle('Coming next:')
        embed.setColor('RANDOM')
        embed.setDescription(queue[0].map(song => `**[${song.index}]** [${song.title}](${song.uri}) | ${song.requester.username}`).join('\n'))
        embed.setFooter({text: `Page: ${1}/${queue.length}`})

        let msg = await message.reply({embeds: [embed], components:[row]})

        const collector = msg.createMessageComponentCollector({
            filter: (i) => i.user.id === message.member.id,
            time: 60000
        })
        let num = 0;
        collector.on('collect', (btn)=> {
            btn.deferUpdate();
            if (btn.customId === 'back') num--
            if (btn.customId === 'next') num++
            num = ((num % queue.length) + queue.length) % queue.length
            embed.setDescription(queue[num].map(song => `**[${song.index}]** [${song.title}](${song.uri}) | ${song.requester.username}`).join('\n'))
            embed.setFooter({text: `Page: ${num+1}/${queue.length}`})
            msg.edit({embeds: [embed]})
        })

        collector.on('end', ()=> msg.edit({components: []}))
        

    }  
})