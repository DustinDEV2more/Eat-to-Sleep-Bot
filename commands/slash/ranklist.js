exports.command = {
	name: 'ranklist',
	description: 'Zeigt dir eine Liste der Top10 Member des Servers',
    roles: [],

    options: [],
	async execute(int, args, createAPIMessage, client) {
    const Discord = require("discord.js")
    const embed = require("../../modules/Embed");

    const puppeteer = require('puppeteer');


            client.api.interactions(int.id, int.token).callback.post({
            data: {type: 5}
        })
    
        const viewport = {
            width: 850,
            height: 570,
        };

    (async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        page.setViewport(viewport)
        await page.goto("http://localhost:7869/ranklist", {
            waitUntil: 'networkidle0', // Wait until the network is idle
        });
        var screenshot = await page.screenshot();
        const attachment = new Discord.MessageAttachment(screenshot, `Ranklist.png`);
        
        client.guilds.cache.get(int.guild_id).channels.cache.get(int.channel_id).send(attachment)
      
        await browser.close();
      })();




        // client.api.interactions(int.id, int.token).callback.post({
        //     data: {type: 4, data: await createAPIMessage(int, embed.success(`Hey ${args.find(x => x.name == "user").value}`, `${args.find(x => x.name == "test").value}`))}
        // })

    },
};