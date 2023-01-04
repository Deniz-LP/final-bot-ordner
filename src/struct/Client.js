const { Client, Intents, Collection, Permissions } = require('discord.js')
const Utils = require('../utils/Utils')
const config = require('../config')
const Erela = require('./Erela')
const ytsr = require('ytsr')
const LevelingSystem = require('./Leveling')
const db = require('../Database/PrismaClient')
const client = require('..');

module.exports = class MusicBot extends Client {
    constructor(options = {}) {
        super({
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            intents: new Intents(3276799)
        })
        this.config = config
        this.utils = new Utils(this)
        this.events = new Collection();
        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.aliases = new Collection();


        this.ytsr = ytsr
        this.defaultPerms = new Permissions(this.config.DEFAULTPERMS).freeze()
        /**
         * @type {db}
         */
        this.db = db

        //let create the manager
        /**
         * @type {Erela}
         */
        this.music = new Erela(this)


        //this.handleEvents(eventFiles, "./src/events");
        //this.handleCommands(commandFolders, "./src/slashCommands");

        this.on('raw', (d) => this.music.manager.updateVoiceState(d));
        this.leveling = new LevelingSystem(this)
        this.status = 0
        this.lieder = 0
        this.on('interactionCreate', async (interaction) => {
            this.utils.InteractionCommandButton(interaction, this)
        })

        this.on('messageReactionAdd', async (reaction, user) => {
            this.utils.handleReactionRoleEdit(reaction, user, client, db, "add")
        })
        this.on('messageReactionRemove', async (reaction, user) => {
            this.utils.handleReactionRoleEdit(reaction, user, client, db, "remove")
        })
    }



    async start() {
        await this.utils.loadEvents()
        this.music.build()
        await this.utils.loadCommands()
        await super.login(this.config.TOKEN)

    }

}