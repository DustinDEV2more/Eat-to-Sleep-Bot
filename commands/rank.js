exports.command = {
	name: 'rank abfrage',
	call: 'rank',
	description: 'Gibt dir Informationen über deinen aktuellen rank',
    usage: `rank [@user]`,
    permissions: [],
	async execute(message, args) {
        const Discord = require('discord.js');
        const embed = require("../modules/Embed")
        const puppeteer = require('puppeteer');
        
        var user = message.author.id
        if (args[0]){
            if (message.channel.guild.members.cache.find(x => x.id === args[0].replace("<@", "").replace(">", "").replace("!", ""))){
            user = message.channel.guild.members.cache.get(args[0].replace("<@", "").replace(">", "").replace("!", "")).id
        }}
        
        const viewport = {
            width: 700,
            height: 250,
            deviceScaleFactor: 2,
        };

        (async () => {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            page.setViewport(viewport)
            await page.goto("http://localhost:7869/rank/" + user, {
                waitUntil: 'networkidle0', // Wait until the network is idle
            });
            var screenshot = await page.screenshot();
            const attachment = new Discord.MessageAttachment(screenshot, `Rankcard von ${user}.png`);
            message.channel.send(attachment)
          
            await browser.close();
          })();

        

    },
};