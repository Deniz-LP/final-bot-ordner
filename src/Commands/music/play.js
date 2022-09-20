const { MessageEmbed } = require("discord.js");
const Command = require("../../struct/Commands");
module.exports = new Command({
    name: 'play',
    aliases: ['p', 'pl', 'song'],
    description: 'play a song',
    usage: '<song>',
    cd: 10,
    args: true,
    async run (message, args, client) {
        console.log("jemand hat n track gestartet")

        let db = client.db;
    let languageDB = await db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang = languageDB.lang;

        //check if the user is in a vc
        
        if (!message.member.voice.channel) return message.reply({content: "You need to be ina vc"})
        if (message.member.voice.channel.permissionsFor(client.user).has("CONNECT") && message.member.voice.channel.permissionsFor(client.user).has("VIEW_CHANNEL")) {
        let res;
        try {
            let url;
            if (!args[0].startsWith('http')) url = await client.ytsr(args.join(' '), {limit: 1});
            res = await client.music.manager.search(url?.items[0]?.url || args.join(' '), message.author);
            if (res?.tracks[0]?.uri.includes('spotify')) return message.reply('Spotify not supported!')
            if (res.loadType === "LOAD_FAILED") throw res.exception;
            if (res.loadType === 'NO_MATCHES') return message.reply(client.utils.translation(lang, ["Link nicht gefunden.", "Link not found."]))
        }catch (err) {
            return message.reply(`Error: ${err.message}`);
        }

        const player = client.music.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
            volume: 100
        });
        //this will only run if you send a full playlist
        if (res.loadType === 'PLAYLIST_LOADED') {
            if (player.state !== 'CONNECTED') player.connect();
            let time = 0 + res.tracks[0].duration
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.size) player.play();
            res.tracks.shift();
            res.tracks.forEach(song=> {
                time += song.duration
                player.queue.add(song)
            })
            let embed = new MessageEmbed();
            let t = client.utils.parseMs(time);
            embed.setAuthor({name: client.user.username, iconURL: client.user.avatarURL()});
            if(lang == "de"){
            embed.addField(`Total Songs: ${player.queue.size}`, `Geschätzte Zeit: ${t.hours}h ${t.minutes}min`)
            embed.setColor('RANDOM')
            embed.setDescription(`Füge **${res.tracks.length}** Songs aus der Playlist *${res.playlist.name}* hinzu.`)
            }else{
            embed.addField(`Total Songs: ${player.queue.size}`, `Estimated time: ${t.hours}h ${t.minutes}min`)
            embed.setColor('RANDOM')
            embed.setDescription(`Adding **${res.tracks.length}** songs of the playlist *${res.playlist.name}*`)
            }
            

            return message.channel.send({embeds: [embed]})
        }
        
        if (player.state !== 'CONNECTED') player.connect()
        player.queue.add(res.tracks[0]);
        message.reply(client.utils.translation(lang, [`**${res.tracks[0].title}** zur Queue hinzugefügt.`, `Adding **${res.tracks[0].title}** to the queue.`]))
        if (!player.playing && !player.paused && !player.queue.size) player.play();
    }else{
        
        let db = client.db;
        let languageDB = await db.spracheServer.findUnique({
          where: {
            server_id: message.guild.id
          }
        })
        let lang = languageDB.lang;
                if (lang == "de") {
                  message.reply("Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung, den Voice-Channel betreten und anzeigen zu können.");
  
                } else if (lang == "en") {
                    message.reply("Sorry for disturb, but Jamal would like to get the permission to join and see(view) the voice channel.");
  
                }
              
  
          }
     }  
})