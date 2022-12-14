

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


  parseMs(milliseconds) {

    const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

    return {
      days: roundTowardsZero(milliseconds / 86400000),
      hours: roundTowardsZero(milliseconds / 3600000) % 24,
      minutes: roundTowardsZero(milliseconds / 60000) % 60,
      seconds: roundTowardsZero(milliseconds / 1000) % 60,
      milliseconds: roundTowardsZero(milliseconds) % 1000,
      microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
      nanoseconds: roundTowardsZero(milliseconds * 1000000) % 1000
    };
  }

  arrayShuffle(array) {
    for (let i = 0, length = array.length, swap = 0, temp = ''; i < length; i++) {
      swap = Math.floor(Math.random() * (i + 1));
      temp = array[swap];
      array[swap] = array[i];
      array[i] = temp;
    }
    return array;
  }

  async run() {
    console.log(`logged in as ${this.client.user.tag}`)
    console.log(`Loaded a total of ${this.client.commands.size} Commands`)
    console.log(`Loaded a total of ${this.client.events.size} Events`)
    this.client.music.manager.init(this.client.user.id)
    this.giveawayUpdater();


  }


  async giveawayUpdater() {

    let db = this.client.db;

    setInterval(async () => {
      let gw = await db.giveaway.findMany({});

      for (const giveaway of gw) {

        let channel = await this.client.channels.fetch(giveaway.channel_id);
        if (!channel)
          continue;
        /**
         * @type {Message}
         */
        let msg = await channel.messages.fetch(giveaway.message_id);

        let data = await this.client.db.spracheServer.findUnique({
          where: {
            server_id: channel.guild.id
          }
        })

        let lang = data.lang;

        if (!msg)
          continue


        let uebrigZeit = (Number(giveaway.endtime) - Date.now());
        let ms = this.parseMs(uebrigZeit);
        let uebrig = "";

        if (ms.days != 0) {
          uebrig = `${ms.days}d ${ms.hours}h ${ms.minutes}m ${ms.seconds}s`
        } else if (ms.hours != 0) {
          uebrig = `${ms.hours}h ${ms.minutes}m ${ms.seconds}s`
        } else if (ms.minutes != 0) {
          uebrig = `${ms.minutes}m ${ms.seconds}s`
        } else {
          if (lang === "de") {
            uebrig = `${ms.seconds} Sekunden`
          } else if (lang === 'en') {
            uebrig = `${ms.seconds} Seconds`
          }
        }



        let r = msg.reactions.cache;
        if (r.size == 0)
          continue

        const user = await this.client.users.fetch(giveaway.player_id);
        if (uebrigZeit >= 0) {

          const exampleEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(giveaway.title)
            .setDescription(giveaway.desc)
            .addField("Reagiere mit 🥳!", "um im Pot zu sein!", false)
            .addField("Restzeit:", "=" + uebrig + "=", false)
            .setFooter('Giveaway created by ' + user.tag + '');

          const exampleEmbedEngl = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(giveaway.title)
            .setDescription(giveaway.desc)
            .addField("React with 🥳", "to have a chance to win", false)
            .addField("Time left:", "=" + uebrig + "=", false)
            .setFooter('Giveaway created by ' + user.tag + '');



          if (lang === 'de') {
            msg.edit({ embeds: [exampleEmbed] });
          } else if (lang === 'en') {
            msg.edit({ embeds: [exampleEmbedEngl] });
          };

        } else {

          if (giveaway.finished)
            continue

          let reaction = r.get("🥳");
          if (!reaction)
            continue


          let users = await reaction.users.fetch()

          let allusers = [];
          for (const user of users) {
            if (user[1].bot)
              continue
            allusers.push(user[1]);
          }

          let winner;
          if (allusers.length == 0) {
            winner = "0"
          } else {

            winner = this.arrayShuffle(allusers)[0];
          }



          let test = await db.giveaway.update({
            where: {
              giveaway_id: giveaway.giveaway_id
            },
            data: {
              finished: true,
              winner_id: winner.id
            }
          })
          const exampleEmbed = new MessageEmbed()
          const exampleEmbedEngl = new MessageEmbed()
          if (winner == "0") {
            exampleEmbed
              .setColor("RANDOM")
              .setTitle(giveaway.title)
              .setDescription(giveaway.desc)
              .addField("Giveaway vorbei! Es hat keiner mitgemacht.", "-", false)
              .setFooter('Giveaway created by ' + user.tag + '');

            exampleEmbedEngl
              .setColor("RANDOM")
              .setTitle(giveaway.title)
              .setDescription(giveaway.desc)
              .addField("Giveaway fineshed! Nobody entered the giveaway.", "-", false)
              .setFooter('Giveaway created by ' + user.tag + '');

            test = await db.giveaway.update({
              where: {
                giveaway_id: giveaway.giveaway_id
              },
              data: {
                finished: true,
                winner_id: "Kein Entry"
              }
            })

          } else {
            exampleEmbed
              .setColor("RANDOM")
              .setTitle(giveaway.title)
              .setDescription(giveaway.desc)
              .addField("Giveaway vorbei! Der Gewinner ist:", "<@" + winner.id + ">", false)
              .setFooter('Giveaway created by ' + user.tag + '');

            exampleEmbedEngl
              .setColor("RANDOM")
              .setTitle(giveaway.title)
              .setDescription(giveaway.desc)
              .addField("Giveaway fineshed! Winner is:", "<@" + winner.id + ">", false)
              .setFooter('Giveaway created by ' + user.tag + '');

          }



          if (lang === 'de') {
            msg.edit({ embeds: [exampleEmbed] });
          } else if (lang === 'en') {
            msg.edit({ embeds: [exampleEmbedEngl] });
          };
        }




      }

    }, 3000);

    return;
  }
}