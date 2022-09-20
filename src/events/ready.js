const Event = require("../struct/Events");

module.exports = class ready extends Event {
    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    async run() {
        console.log(`logged in as ${this.client.user.tag}`)
        console.log(`Loaded a total of ${this.client.commands.size} Commands`)
        console.log(`Loaded a total of ${this.client.events.size} Events`)
        this.client.music.manager.init(this.client.user.id)
    }
}