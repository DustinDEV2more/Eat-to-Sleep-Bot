exports.command = {
	name: 'rankliste',
	call: 'ranklist',
	description: 'Zeigt dir die top10 der Member nach Rängen sotiert',
    usage: `ranklist`,
    permissions: [],
	async execute(message, args) {
        const Discord = require('discord.js');
        const embed = require("../modules/Embed")
        const puppeteer = require('puppeteer');
        
        const viewport = {
            width: 850,
            height: 580,
        };

        (async () => {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            page.setViewport(viewport)
            await page.goto("http://localhost:7869/ranklist", {
                waitUntil: 'networkidle0', // Wait until the network is idle
            });
            var screenshot = await page.screenshot();
            const attachment = new Discord.MessageAttachment(screenshot, `ranklist.png`);
            message.channel.send(attachment)
          
            await browser.close();
          })();

        

    },
};