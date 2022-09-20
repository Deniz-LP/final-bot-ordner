const MusicBot = require("./struct/Client");
const config = require('./config')
const client = new MusicBot(config);

client.start()
/**
 * @type {MusicBot} client
 */
module.exports = client