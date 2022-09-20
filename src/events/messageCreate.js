const Event = require("../struct/Events");
const { Message, Channel, Client, MessageEmbed } = require('discord.js');
const Command = require("../struct/Commands");
const { default: resolver } = require("better-erela.js-spotify/dist/resolver");
const MusicBot = require("../struct/Client");
const lang = require("../Commands/JustMods/lang");
const { rollenlevel } = require("../Database/PrismaClient");
module.exports = class ready extends Event {
  constructor(...args) {
    super(...args, {
      once: false

    });
  }
  /**
   * @param {MusicBot} client
   * @param {Message} message 
   */
  async run(client, message) {

    let extraCD = 1;
    let cooldown = false;
    let levelingsystem = true;
    let DELETETIMEE = 30000;
    let pref = client.config.PREFIX;
    let ut = client.utils;
    let data = await client.db.spracheServer.findUnique({
      where: {
        server_id: message.guild.id
      }
    })
    let lang;
    if (data) {
      lang = data.lang;
    } else {
      lang = "en";
      await client.db.spracheServer.create({
        data: {
          server_id: message.guild.id,
          lang: "en"
        }

      })
    }
    let toggleDB = await client.db.toggleLevel.findUnique({
      where: {
        server: message.guild.id
      }
    })
    if (!toggleDB) {
      toggleDB = await client.db.toggleLevel.create({
        data: {
          server: message.guild.id,
          status: "on"
        }
      })
    }

    if (message.author.bot) return;


    if (message.channel.type === "DM") {
      if (!(client.config.OWNERS.includes(message.author.id) || message.author.bot)) {
        let ImageLink = "";
        message.attachments.forEach(attachment => {
          ImageLink = attachment.proxyURL;

        });
        console.log("DM: von " + message.author.tag + "  --- ID: -> " + message.author.id + "\nNachricht: " + message.content + "\nImage: " + ImageLink);
        client.users.fetch(client.config.OWNERS[0]).then((user) => {
          try {
            let ImageLink = "";
            message.attachments.forEach(attachment => {
              ImageLink = attachment.proxyURL;

            });
            user.send("DM: von " + message.author.tag + "  --- ID: -> " + message.author.id + "\nNachricht: " + message.content + "\nImage: " + ImageLink);

          } catch (err) {
            console.log("err")
          }
        });
      } else if (client.config.OWNERS.includes(message.author.id)) {

      }
      return;
    }

    if (message.author.bot || !message.guild) return
    //console.log(message);
    //console.log(message.guild.me);
    //console.log(message.guild.me.permissionsIn(client.user).has([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]));

    //you need to check for perms in the member not user
    if (message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
    } else {
      const randomChannel = message.guild.channels.cache.find(channel =>
        channel.type === "GUILD_TEXT" && channel.permissionsFor(client.user).has("SEND_MESSAGES")
        && channel.permissionsFor(client.user).has("VIEW_CHANNEL"));

      if (randomChannel != undefined) {
        let data = await client.db.spracheServer.findUnique({
          where: {
            server_id: message.guild.id
          }
        })
        let lang;
        if (data) {
          lang = data.lang;
        } else {
          lang = "en";
        }
        if (lang == "de") {
          randomChannel.send("Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung SEND_MESSAGES in allen Channeln.");
        } else if (language == "en") {
          randomChannel.send("Sorry for disturb, but Jamal would like to get the permission SEND_MESSAGES in all channel.");
        }
      }
      return;
    }


    let prefixDB = await client.db.prefix.findUnique({
      where: {
        server_id: message.guild.id
      }
    })

    if (prefixDB) {
      pref = prefixDB.prefix;
    }

    if (this.client.config.OWNERS.includes(message.author.id)) {

      if (message.content == "?sleep") {
        this.client.utils.sleeping(true);
        client.user.setActivity('Bot is inactive right now!', { type: 'LISTENING' })
        console.log("sleep")
      } else if (message.content == "?awake") {
        this.client.utils.sleeping(false);
        client.user.setActivity('DM Bot for Help!', { type: 'LISTENING' })
        console.log("awake")
      }

    }
    //leveling anfang
              
              
    let newcd = (BigInt(Date.now()) + BigInt(extraCD));
        if (client.utils.isSleeping() == false && levelingsystem == true) {

      let level = await client.db.levelingSyst.findUnique({
        where: {
          identify: {
            server: message.guild.id,
            player_id: message.author.id
          }
        }
      })

      let cd = await client.db.levelCooldown.findUnique({
        where: {
          identify: {
            server: message.guild.id,
            player_id: message.author.id
          }
        }
      })

      let togglelvl = await client.db.toggleLevel.findUnique({
        where: {
          server: message.guild.id
        }
      })

      var levelingAmount = 200;

      if (level) {
        if (!togglelvl) {
          togglelvl = await client.db.toggleLevel.create({
            data: {
              server: message.guild.id,
              status: "on"
            }
          })
        }
        if (togglelvl.status === "on") {
          let GainedXP = Math.floor(Math.random() * 20) + 10;
          let XPneu = (parseInt(level.xp)) + GainedXP;
          let FullLVL = parseInt(level.fulllevel);
          let timen = BigInt(cd.cooldown);
          let allxp = (parseInt(level.alleXP)) + GainedXP;
          if (BigInt(Date.now()) >= timen) {

            let CooldownLevel = cd.cooldown;
            let COOLDOWN = Date.now() + CooldownLevel;
            if (cooldown == true) {
              cd = await client.db.levelCooldown.update({
                where: {
                  identify: {
                    server: message.guild.id,
                    player_id: message.author.id
                  }
                },
                data: {
                  server: message.guild.id,
                  player_id: message.author.id,
                  cooldown: newcd + ""
                }
              })
            }
            if (XPneu >= (levelingAmount + (levelingAmount * FullLVL))) {

              message.channel.send(client.utils.translation(lang, ['Glückwunsch, <@' + message.author.id + '>! Du hast Level ' + (FullLVL + 1) + ' erreicht!',
              'Congratulations, <@' + message.author.id + '>! You reached Level ' + (FullLVL + 1) + '!']));

              for (let h = 0; h <= FullLVL + 1; h++) {
                let rolelvl = await client.db.rollenlevel.findUnique({
                  where: {
                    identify: {
                      server: message.guild.id,
                      level: "" + h
                    }
                  }
                })

                if (rolelvl) {
                  if (rolelvl.role_id != null || rolelvl.role_id != undefined) {
                    let role = message.guild.roles.cache.find((r) => r.id == "" + rolelvl.role_id);
                    if ((message.guild.me.hasPermission("MANAGE_ROLES")) && (role.position < message.guild.me.roles.highest.position)) {
                      if (!message.author.roles.cache.has(role.id)) {
                        message.author.roles.add(role);
                      }
                    } else {
                      const randomChannel = message.guild.channels.cache.find(channel =>
                        channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES") && channel.permissionsFor(client.user).has("VIEW_CHANNEL"));
                      if (randomChannel != undefined) {
                        let data = await client.db.spracheServer.findUnique({
                          where: {
                            server_id: message.guild.id
                          }
                        })
                        let lang = data.lang;
                        if (lang == "de") {
                          randomChannel.send("Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung MANAGE_ROLES, oder/und er bräuchte eine Rolle die höher ist als die Rolle die vergeben werden will, <@" + message.guild.ownerID + ">.");
                        } else if (lang == "en") {
                          randomChannel.send("Sorry for disturb, but Jamal would like to get the permission MANAGE_ROLES, or/and a role which is ranked highger than the role which should be given, <@" + message.guild.ownerID + ">.");
                        }
                      }
                    }
                  }
                }
              }
              level = await client.db.levelingSyst.update({
                where: {
                  identify: {
                    server: message.guild.id,
                    player_id: message.author.id
                  }
                },
                data: {
                  server: message.guild.id,
                  player_id: message.author.id,
                  xp: ""+XPneu,
                  fulllevel: "" + (FullLVL + 1),
                  alleXP: allxp + ""

                }
              })
            } else {
              level = await client.db.levelingSyst.update({
                where: {
                  identify: {
                    server: message.guild.id,
                    player_id: message.author.id
                  }
                },
                data: {
                  server: message.guild.id,
                  player_id: message.author.id,
                  xp: ""+XPneu,
                  fulllevel: "" + FullLVL,
                  alleXP: allxp + ""
                }
              })
            }
          }
          let LevelRolle;
          for (let a = 1; a <= FullLVL; a++) {
            let rolelvl = await client.db.rollenlevel.findUnique({
              where: {
                identify: {
                  level: ""+a,
                  server: message.guild.id
                }
              }
            })

            if(rolelvl){
             LevelRolle = message.guild.roles.cache.find((r) => r.id == "" + rolelvl.role_id);
            }

            if (!(LevelRolle == undefined || LevelRolle == null || message.author.roles.cache.has(LevelRolle))) {
              message.author.roles.add(LevelRolle);
            }
          }
        }
      } else {
        level = await client.db.levelingSyst.create({
          data: {
            server: message.guild.id,
            fulllevel: "0",
            player_id: message.author.id,
            xp: "1",
            alleXP: "1"
          }
        })
        cd = await client.db.levelCooldown.create({
          data: {
            server: message.guild.id,
            player_id: message.author.id,
            cooldown: "0"
          }
        })
      }

    }

    //lvling ende
    let args = message.content.split(/ +/);
    //Embed start#


    let embeds = await client.db.embedGen.findUnique({
      where: {
        identify: {
          server_id: message.guild.id,
          player_id: message.author.id,
          channelsend_id: message.channel.id
        }
      }
    })


    let title = "";
    if (embeds) {
      //part1
      if (1 == 1) {
        let status = embeds.status;
        console.log(status + " 123")

        if (status === "1") {

          

          if (args.length === 1) {
            let EmbedChannel;
            if (message.mentions.channels.size == 1) {
              EmbedChannel = message.mentions.channels.first();
            } else if (message.guild.channels.cache.find(channel => channel.id === args[0]) != undefined) {
              EmbedChannel = message.guild.channels.cache.find(channel => channel.id === args[0])
            } else if (message.guild.channels.cache.find(channel => channel.name === args[0]) != undefined) {
              EmbedChannel = message.guild.channels.cache.find(channel => channel.name === args[0])
            }

            if (EmbedChannel != null || EmbedChannel != undefined) {
              if (EmbedChannel.permissionsFor(message.author).has("SEND_MESSAGES")) {
                if (!EmbedChannel.permissionsFor(client.user).has("SEND_MESSAGES")) {
                  message.reply(ut.translation(lang, ["Entschuldige, aber du musst einen Channel pingen, in dem der Bot Rechte hat, reinzuschreiben! (Frage einen Mod ob es sich um ein Problem handelt.)",
                    "I am sorry, but you need to mention a channel, where the bot have the permission to send messages! (Ask a mod if this error shouldn't occur."])).then(msg => {
                      setTimeout(() => msg.delete(), DELETETIMEE)
                    })
                    .catch(console.error);
                  embeds = await client.db.embedGen.delete({
                    where: {
                      identify: {
                        server_id: message.guild.id,
                        player_id: message.author.id,
                        channelsend_id: message.channel.id
                      }
                    }
                  })
                } else {
                  embeds = await client.db.embedGen.update({
                    where: {
                      identify: {
                        server_id: message.guild.id,
                        player_id: message.author.id,
                        channelsend_id: message.channel.id
                      }
                    },
                    data: {
                      server_id: embeds.server_id,
                      player_id: embeds.player_id,
                      channelsend_id: embeds.channelsend_id,
                      status: "2",
                      channel_id: EmbedChannel.id
                    }
                  })
                  message.reply(ut.translation(lang, ["Perfekt! Was soll nun als Titel dort stehen, <@" + message.author.id + ">?", "Perfect! What should the title be, <@" + message.author.id + ">?"]))
                    .then(msg => {
                      setTimeout(() => msg.delete(), DELETETIMEE)
                    })
                    .catch(console.error);
                }
              } else {
                message.reply(ut.translation(lang, ["Entschuldige, aber du musst einen Channel pingen, in dem du Rechte hast, reinzuschreiben!",
                  "I am sorry, but you need to mention a channel, where you have the permission to send messages!"])).then(msg => {
                    setTimeout(() => msg.delete(), DELETETIMEE)
                  })
                  .catch(console.error);
                embeds = await client.db.embedGen.delete({
                  where: {
                    identify: {
                      server_id: message.guild.id,
                      player_id: message.author.id,
                      channelsend_id: message.channel.id
                    }
                  }
                })
              }
            } else {
              if ((message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES"))) {
                let a = message.channel.messages.fetch({ limit: 100 });
                (async function () {
                  let KA;
                  KA = await a;
                  let a2 = 0;
                  let msg1; let msg2;
                  for (let a = 0; a < 100; a++) {
                    if (a2 < 3) {
                      if (KA.at(a).author.id == message.author.id) {
                        a2++;
                        if (a2 === 1) {
                          msg1 = KA.at(a);
                        } else if (a2 === 2) {
                          msg2 = KA.at(a);
                        }
                      }
                    }
                  }
                  msg1.delete(); msg2.delete();
                })();
              } else {
                message.reply(ut.translation(lang, ["Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung MANAGE_MESSAGES, <@" + message.guild.ownerID + ">.",
                "Sorry for disturb, but Jamal would like to get the permission MANAGE_MESSAGES, <@" + message.guild.ownerID + ">."]));
              }
              message.reply(ut.translation(lang, ["Embed-Generation gecancelled! Bitte Pinge nächstes mal einfach nur einen Channel, <@" + message.author.id + ">!",
              "Embed-Generation cancelled! Please mention only a channel next time, <@" + message.author.id + ">!"])).then(msg => {
                setTimeout(() => msg.delete(), DELETETIMEE)
              })
                .catch(console.error);

              console.log(message.guild.id + " 112")
              console.log(message.author.id + " 113")
              console.log(message.channel.id + " 114")

              embeds = await client.db.embedGen.delete({
                where: {
                  identify: {
                    server_id: message.guild.id,
                    player_id: message.author.id,
                    channelsend_id: message.channel.id
                  }
                }
              })

            }
          } else {

            embeds = await client.db.embedGen.delete({
              where: {
                identify: {
                  server_id: message.guild.id,
                  player_id: message.author.id,
                  channelsend_id: message.channel.id
                }
              }
            })


            console.log(message.guild.id + " 112")
            console.log(message.author.id + " 113")
            console.log(message.channel.id + " 114")

            message.reply(ut.translation(lang, ["Embed-Generation gecancelled! Bitte Pinge nächstes mal einfach nur einen Channel, <@" + message.author.id + ">!",
            "Embed-Generation cancelled! Please mention only a channel next time, <@" + message.author.id + ">!"])).then(msg => {
              setTimeout(() => msg.delete(), DELETETIMEE)
            })
              .catch(console.error);


          }

        } else if (status === "2") {

          
          if (args[0] != "cancel") {

            for (let a = 0; a < args.length; a++) {
              title = title + args[a] + " ";
            }

            embeds = await client.db.embedGen.update({
              where: {
                identify: {
                  server_id: message.guild.id,
                  player_id: message.author.id,
                  channelsend_id: message.channel.id
                }
              },
              data: {
                server_id: embeds.server_id,
                player_id: embeds.player_id,
                channelsend_id: embeds.channelsend_id,
                status: "3",
                title: title
              }
            })

            message.reply(ut.translation(lang, ["Alles klar! Jetzt musst du nur noch eingeben, was der Text sein soll, <@" + message.author.id + ">!",
            "All right! Now, in this last step, you need to write the text, <@" + message.author.id + ">!"])).then(msg => {
              setTimeout(() => msg.delete(), DELETETIMEE)
            })
              .catch(console.error);
          } else {

            message.reply(ut.translation(lang, ["Embed-Generation gecancelled!", "Embed-Generation cancelled!"])).then(msg => {
              setTimeout(() => msg.delete(), DELETETIMEE)
            })
              .catch(console.error);

            embeds = await client.db.embedGen.delete({
              where: {
                identify: {
                  server_id: message.guild.id,
                  player_id: message.author.id,
                  channelsend_id: message.channel.id
                }
              }
            })


            if ((message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES"))) {
              let a = message.channel.messages.fetch({ limit: 100 });
              (async function () {
                let KA;
                KA = await a;
                let a2 = 0;
                let msg1; let msg2; let msg3;

                for (let a = 0; a < 100; a++) {
                  if (a2 < 3) {
                    if (KA.at(a).author.id == message.author.id) {
                      a2++;
                      if (a2 === 1) {
                        msg1 = KA.at(a);
                      } else if (a2 === 2) {
                        msg2 = KA.at(a);
                      } else if (a2 === 3) {
                        msg3 = KA.at(a);
                      }
                    }
                  }
                }

                msg1.delete(); msg2.delete(); msg3.delete();

              })();
            } else {

              message.reply(ut.translation(lang, ["Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung MANAGE_MESSAGES, <@" + message.guild.ownerID + ">.",
              "Sorry for disturb, but Jamal would like to get the permission MANAGE_MESSAGES, <@" + message.guild.ownerID + ">."]));

            }



          }
        } else if (status === "3") {


          if (args[0] != "cancel") {


            for (let a = 0; a < args.length; a++) {
              title = title + args[a] + " ";
            }
            embeds = await client.db.embedGen.update({
              where: {
                identify: {
                  server_id: message.guild.id,
                  player_id: message.author.id,
                  channelsend_id: message.channel.id
                }
              },
              data: {
                server_id: embeds.server_id,
                player_id: embeds.player_id,
                channelsend_id: embeds.channelsend_id,
                status: "4",
                title: embeds.title,

              }
            })

          } else {

            message.reply(ut.translation(lang, ["Embed-Generation gecancelled!", "Embed-Generation cancelled!"])).then(msg => {
              setTimeout(() => msg.delete(), DELETETIMEE)
            })
              .catch(console.error);

            embeds = await client.db.embedGen.delete({
              where: {
                identify: {
                  server_id: message.guild.id,
                  player_id: message.author.id,
                  channelsend_id: message.channel.id
                }
              }
            })
            if ((message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES"))) {

              let a = message.channel.messages.fetch({ limit: 100 });
              (async function () {
                let KA;
                KA = await a;
                let a2 = 0;
                let msg1; let msg2; let msg3; let msg4;

                for (let a = 0; a < 100; a++) {
                  if (a2 < 4) {
                    if (KA.at(a).author.id == message.author.id) {
                      a2++;
                      if (a2 === 1) {
                        msg1 = KA.at(a);

                      } else if (a2 === 2) {
                        msg2 = KA.at(a);

                      } else if (a2 === 3) {
                        msg3 = KA.at(a);

                      } else if (a2 === 4) {
                        msg4 = KA.at(a);

                      }

                    }

                  }
                }

                msg1.delete(); msg2.delete(); msg3.delete(); msg4.delete();

              })();
            } else {
              message.reply(ut.translation(lang, ["Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung MANAGE_MESSAGES, <@" + message.guild.ownerID + ">.",
              "Sorry for disturb, but Jamal would like to get the permission MANAGE_MESSAGES, <@" + message.guild.ownerID + ">."]));

            }
          }


        }
      }
      //part2
      if (1 == 1) {
        if (embeds.status === "4") {

        
          if ((message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES"))) {
            let a = message.channel.messages.fetch({ limit: 100 });
            (async function () {
              let KA;
              KA = await a;
              let a2 = 0;
              let msg1; let msg2; let msg3; let msg4;

              for (let a = 0; a < 100; a++) {
                if (a2 < 4) {
                  if (KA.at(a).author.id == message.author.id) {
                    a2++;
                    if (a2 === 1) {
                      msg1 = KA.at(a);

                    } else if (a2 === 2) {
                      msg2 = KA.at(a);

                    } else if (a2 === 3) {
                      msg3 = KA.at(a);

                    } else if (a2 === 4) {
                      msg4 = KA.at(a);

                    }

                  }

                }
              }
              msg1.delete(); msg2.delete(); msg3.delete(); msg4.delete();
            })();
          } else {

            message.reply(ut.translation(lang, ["Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung MANAGE_MESSAGES, <@" + message.guild.ownerID + ">.",
            "Sorry for disturb, but Jamal would like to get the permission MANAGE_MESSAGES, <@" + message.guild.ownerID + ">."]));

          }
          let channel = message.guild.channels.cache.get(embeds.channel_id)

          const exampleEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(""+embeds.title)
            .setDescription(""+title)

            .setFooter('Created by ' + message.author.tag);


          if (message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
            channel.send({embeds: [exampleEmbed] });
          } else {
            const randomChannel = message.guild.channels.cache.find(channel =>
              channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES") && channel.permissionsFor(client.user).has("VIEW_CHANNEL"));
            if (randomChannel != undefined) {
              let data = await client.db.spracheServer.findUnique({
                where: {
                  server_id: message.guild.id
                }
              })
              let lang = data.lang;
              if (lang == "de") {
                randomChannel.send("Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung SEND_MESSAGES in allen Channeln (benötigt wird in <#" + channel.id + ">) , <@" + message.guild.ownerID + ">.");

              } else if (lang == "en") {
                randomChannel.send("Sorry for disturb, but Jamal would like to get the permission SEND_MESSAGES in all channel (needed in <#" + channel.id + "> rn), <@" + message.guild.ownerID + ">.");

              }
            } else {

              randomChannel.send("Sorry for disturb, but Jamal would like to get the permission SEND_MESSAGES in all channel (needed in <#" + channel.id + "> rn), <@" + message.guild.ownerID + ">.");

            }
          }
          embeds = await client.db.embedGen.delete({
            where: {
              identify: {
                server_id: message.guild.id,
                player_id: message.author.id,
                channelsend_id: message.channel.id
              }
            }
          })
        }
      }
    }

    //this will be the command handler
    //client.leveling.addXp(message)
    //this is to make pople mention the bot as prefix is useful.
    const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);


    //does the || mean, if the first one is "null", then the config-Prefix is chosen? yes also you maybe will like sqlite3 is better for this kind of things but the problem is:
    if (message.content.match(mentionRegex)) message.reply({ content: `My prefix is ${pref}` })

    const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : pref

    if (message.content.toLowerCase().startsWith(prefix)) {

      let [command, ...args] = message.content.substring(prefix.length).split(/ +/);
      /**
       * @type {Command}
       */

      let cmd = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()))
      //here you can check for things in the command class like the cd and implement a cd syste

      if (cmd) {


        if (cmd.nsfw && !message.channel.nsfw) {
          //you cant run this command in a non nsfw channel..
        }
        const userPermCheck = cmd.userPerms ? client.defaultPerms.add(cmd.userPerms) : client.defaultPerms;

        if (client.config.SLEEP) { return; }


        if (cmd.args && !args.length) {
          return message.reply({
            content: client.utils.translation(lang, [
              `this is not the way that this command should be used, the usage of this command is: ${pref}${cmd.name} ${cmd.usage}`,
              `Das ist nicht die richtige Eingabe, bitte benutzen sie den Command folgendermaßen: ${pref}${cmd.name} ${cmd.usage}`
            ])
          }).then(msg => {
            //message.delete()
            setTimeout(() => msg.delete(), client.config.DELETETIME)
          })
            .catch()




          //.then(msg => msg.delete({ timeout:  }))
        }
        try {
          cmd.run(message, args, client, pref)

        } catch (e) {
          console.log(e)
        }
      }

    }

  }
}