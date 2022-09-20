//this is the template for commands
const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
module.exports = new Command({
    name: 'setlevel',
    aliases: ['setVoll'],
    description: 'just deniz',
    usage: '<levelVoll>',
    cd: 10,
    async run(message, args, client, Prefix) {

        if (client.config.OWNERS.includes(message.member.id)) {

            let user;
            if (message.mentions.users.size == 1) {
                user = message.mentions.roles.first();
            } else if (message.guild.members.fetch(user => user.id === args[0]) != undefined) {
                user = message.guild.roles.cache.find(role => role.id === args[0])
            }

            if (user != null) {
                let level = await client.db.levelingSyst.findUnique({
                    where: {
                        server: message.guild.id
                    }

                })

                level = client.db.levelingSyst.update({
                    where: {
                        server: message.guild.id
                    },
                    data: {
                        server: message.guild.id,
                        player_id: user.id,
                        fulllevel: args[0],
                        xp: level.xp
                    }
                })
            }
        }
    }
})