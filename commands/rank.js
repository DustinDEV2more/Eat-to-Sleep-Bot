module.exports = {
	name: 'rank',
	description: 'Gibt dir eine übersicht der aktuellen Ränge von dir oder einem anderen Mitglied',
    usage: `rank [@user#1234]` ,
	execute(message, args) {
       

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")
        const Discord = require('discord.js');

        const puppeteer = require('puppeteer');

        var user = message.author.id
        if (args[0]){
            if (client.guilds.cache.get("585511241628516352").members.find(x => x.id === args[0].replace("<@", "").replace(">", "").replace("!", ""))){
            user = client.users.cache.get(args[0].replace("<@", "").replace(">", "").replace("!", "")).id
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
            await page.goto("http://localhost:6677/rankcard/" + user, {
                waitUntil: 'networkidle0', // Wait until the network is idle
            });
            var screenshot = await page.screenshot();
            const attachment = new Discord.Attachment(screenshot, `Rankcard von ${message.author.tag}.png`);
            message.channel.send(attachment)
          
            await browser.close();
          })();
        
       
	},
};