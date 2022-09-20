//this is the template for commands
const { MessageAttachment } = require('discord.js');
const { createCanvas, Image } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { request } = require('undici');
const progressbar = require('string-progressbar');

const Command = require("../../struct/Commands");
const Utils = require("../../utils/Utils");
const { channel } = require('diagnostics_channel');

module.exports = new Command({
    name: 'ppprofile',
    aliases: ['pppr', "ppprof"],
    description: '',
    usage: '<none/@player>',
    cd: 10,
    async run(message, args, client, Prefix) {

       
        let modrechte = client.utils.TestRechte(message);
        let ut = client.utils;

        let db = client.db;
        let languageDB = await db.spracheServer.findUnique({where: {
            server_id: message.guild.id
          }})
        let lang = languageDB.lang;
        

        if (client.config.OWNERS.includes(message.member.id)) {
            const canvas = createCanvas(700, 250);
		const context = canvas.getContext('2d');

		const background = await readFile('./wallpaper.jpg');
		const backgroundImage = new Image();
		backgroundImage.src = background;
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
        context.strokeStyle = '#0099ff';
		context.strokeRect(0, 0, canvas.width, canvas.height);

		context.font = '40px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.5);

        context.font = '35px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText("Du bist nur zu 90% cool", canvas.width / 2.5, canvas.height / 1.2);

        let str = "█████████████████████████████████████████████"; //50
        //█


        context.font = '10px sans-serif';
		//context.font = applyText(canvas, str);
		context.fillStyle = '#00ff00';
		context.fillText(str, canvas.width / 2.5, canvas.height / 1.7);
		context.fillText(str, canvas.width / 2.5, canvas.height / 1.8);
		context.fillText(str, canvas.width / 2.5, canvas.height / 1.9);
		context.fillText(str, canvas.width / 2.5, canvas.height / 2);

		context.beginPath();
		context.arc(125, 125, 100, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
//▉
		const { body } = await request(message.author.displayAvatarURL({ format: 'jpg' }));
		const avatar = new Image();
		avatar.src = Buffer.from(await body.arrayBuffer());
		context.drawImage(avatar, 25, 25, 200, 200);

		const attachment = new MessageAttachment(canvas.toBuffer('image/png'), 'profile-image.png');

		message.reply({ files: [attachment] });
        }

        
    }
    
})

