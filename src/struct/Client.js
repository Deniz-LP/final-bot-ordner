const {Client, Intents, Collection, Permissions} = require('discord.js')
const Utils = require('../utils/Utils')
const config = require('../config')
const Erela = require('./Erela')
const ytsr = require('ytsr')
const LevelingSystem = require('./Leveling')
const db = require('../Database/PrismaClient')
module.exports = class MusicBot extends Client {
    constructor(options = {}) {
        super({
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES
                     ,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_TYPING]
        })
        this.config = config
        this.utils = new Utils(this)
        this.events = new Collection();
        this.commands = new Collection();
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
        this.on('raw', (d)=> this.music.manager.updateVoiceState(d));
        this.leveling = new LevelingSystem(this)
        this.status = 0
        }

    async start() {
        await this.utils.loadCommands()
        await this.utils.loadEvents()
        this.music.build()
        await super.login(this.config.TOKEN)
        
    }

}