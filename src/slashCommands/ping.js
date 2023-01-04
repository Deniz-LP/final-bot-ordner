const { SlashCommandBuilder } = require('@discordjs/builders');
const slashCommand = require('../struct/slashCommand');

//exporting an plain object

module.exports = new slashCommand({
    name: "ping",
    data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
    async execute(client, interaction) {
        await interaction.reply("Pong!");
        //good
        console.log(client.slashCommands.size);
    
    }
})


/*module.exports = {
    data: {
        name: 'ping',
        description: 'Pong!',
        options: [  // Slash command options
            {
                name: 'user',
                description: 'The user',
                type: 6,
                required: false
            }
        ]
    },
    async execute(interaction) { // Slash command execution
        await interaction.reply('Pong!');
    }
}*/
