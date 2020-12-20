exports.command = {
	name: 'coin abfrage',
	call: 'coins',
	description: 'Gibt dir Informationen über deinen Kontostand und über deine letzten ausgaben',
    usage: `coins`,
    permissions: [],
	async execute(message, args) {
        const Discord = require('discord.js');
        const embed = require("../Embed")
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
            await page.goto("http://localhost:7869/coins/" + user, {
                waitUntil: 'networkidle0', // Wait until the network is idle
            });
            var screenshot = await page.screenshot();
            const attachment = new Discord.MessageAttachment(screenshot, `Coincard von ${user}.png`);
            message.channel.send(attachment)
          
            await browser.close();
          })();

        

    },
};