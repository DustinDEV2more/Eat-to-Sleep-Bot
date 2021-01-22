exports.command = {
	name: 'coins',
	description: 'Zeigt dir die Coincard von dir oder einer beliebigen Person',
    roles: [],

    options: [
        {
        "name": "user",
        "description": "Person dessen Coincard du abfragen möchtest",
        "type": 6,
        "required": false
        },
    ],
	async execute(int, args, createAPIMessage, client) {
    const Discord = require("discord.js")
    const embed = require("../../modules/Embed");

    const puppeteer = require('puppeteer');


            client.api.interactions(int.id, int.token).callback.post({
            data: {type: 5}
        })
        
    var user = int.member.user.id
    if (args == undefined){}
    else {
        if (client.guilds.cache.get("585511241628516352").members.cache.get(args.find(X => X.name == "user").value)){
        user = args.find(X => X.name == "user").value
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
        
        client.guilds.cache.get(int.guild_id).channels.cache.get(int.channel_id).send(attachment)
      
        await browser.close();
      })();




        // client.api.interactions(int.id, int.token).callback.post({
        //     data: {type: 4, data: await createAPIMessage(int, embed.success(`Hey ${args.find(x => x.name == "user").value}`, `${args.find(x => x.name == "test").value}`))}
        // })

    },
};