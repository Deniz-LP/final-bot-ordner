const MusicBot = require("./Client");

module.exports = class Event {
    /**
     * 
     * @param {MusicBot} client 
     * @param {*} name 
     * @param {*} options 
     */
    constructor(client, name, options = {}){
        this.name = name;
        this.client = client;
        this.type = options.once ? 'once' : 'on'
        this.emmiter = (typeof options.emmiter === 'string' ? this.client[options.emmiter] : options.emitter) || this.client;
    }

    async run(client, ...args) {
        throw new Error(`This is default event and does not have anything lol`)
    }
}