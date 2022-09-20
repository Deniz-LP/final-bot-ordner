const { MessageEmbed } = require('discord.js');
const {Manager} = require('erela.js');
const MusicBot = require('./Client');
const Spotify = require('better-erela.js-spotify').default
const nodes = [
    {
        host: "localhost",
        password: "123",
        port: 3000,
    }
];
module.exports = class  Erela {
    /**
     * 
     * @param {MusicBot} client 
     */
      constructor(client){
        this.client = client;
    }
     build () {
        const client = this.client
        
        this.manager = new Manager({
            nodes: nodes,
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            },
            plugins: [
                new Spotify({
                    //here fill with your credentials like email + pw? no go to spotift
                    clientId: "ac03645a49cb4b19b688f1da60be7aee",
                    clientSecret: "811c3870810e466f95334abde84e252d"
                })
            ]
        }).on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))
        .on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
        .on("trackStart", async (player, track) => {


            let str = "";
      let args = track.uri.split("");
      for (let a = 1; a < args.length; a++) {
        if (a > 31) {
          str = str + args[a];
        }

      }
            const exampleEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Schwagers Musikbot:")
    
            .addField("Now playing:", "**" + track.title + "**", false);

            exampleEmbed.setImage("https://i.ytimg.com/vi/" + str + "/hqdefault.jpg");
            this.client.channels.cache.get(player.textChannel).send({embeds: [exampleEmbed]});


           // this.client.channels.cache.get(player.textChannel).send(`Now playing: **${track.title}**`);

        })
        .on("queueEnd", async (player) => {

            
        console.log("n track is zuende")

            const exampleEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Schwagers Musikbot:");
    
            exampleEmbed.addField("No songs in Queue!","Add?", false);

                //this.client.channels.cache.get(player.textChannel).send({embeds: [exampleEmbed]});
            
            
           // this.client.channels.cache.get(player.textChannel).send("There are no more songs in the queue");
        
        })
        .on("playerMove", (player, currentChannel, newChannel) => {
            //we should handle what happens if the user just disconnect the bot and there is no new channel
                if (!newChannel) {
                    return;
                }
                player.setVoiceChannel(newChannel);
                setTimeout(()=>{
                    player.pause(false);
                }, 2000)
        });
    }
}