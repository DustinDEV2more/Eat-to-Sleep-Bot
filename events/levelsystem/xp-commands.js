const { client, config} = require('../../index')
const { RichEmbed } = require('discord.js')
const colour = require("../../colours.json")
const fs      = require("fs");
var schedule = require('node-schedule');
var db = require('quick.db')
const Canvas = require('canvas');
const Discord = require('discord.js');

client.on("message", async message => {

    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ")
    let alias = messageArray[0].replace(prefix, "");
    let args = messageArray.slice(1);
    

    if (message.content.startsWith(prefix)){
if (alias.startsWith("rank")){
    
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
    
        // Declare a base size of the font
        let fontSize = 70;
    
        do {
            // Assign the font to the context and decrement it so it can be measured again
            ctx.font = `${fontSize -= 10}px sans-serif`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (ctx.measureText(text).width > canvas.width - 300);
    
        // Return the result to use in the actual canvas
        return ctx.font;
    };
    if (!args[0]){
    let rank = db.get(`member.level.${message.author.id}.balance`);
    let xp = db.get(`member.xp.${message.author.id}.balance`);

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    
    
	const background = await Canvas.loadImage("https://picsum.photos/705/255.jpg");
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    
	//ctx.strokeStyle = '#000000';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    
	ctx.font = applyText(canvas, message.member.displayName + "#" + message.member.user.discriminator)
	ctx.fillStyle = '#ffffff';
    ctx.fillText(message.member.displayName + "#" + message.member.user.discriminator, canvas.width / 2.5, canvas.height / 1.8);
    //ctx.strokeText(message.member.displayName + "#" + message.member.user.discriminator, canvas.width / 2.5, canvas.height / 1.8)

    ctx.font = '35px sans-serif';
	ctx.fillStyle = '#ffffff';
    ctx.fillText('Rankcard from:', canvas.width / 2.5, canvas.height / 2.6);
    //ctx.strokeText('Rankcard from:', canvas.width / 2.5, canvas.height / 2.6);
    
    ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
    ctx.fillText(`Level: ${rank}`, canvas.width / 2.5, canvas.height / 1.4);
   //ctx.strokeText(`Level: ${rank}`, canvas.width / 2.5, canvas.height / 1.4);
    
    ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`xp: ${xp}`, canvas.width / 2.5, canvas.height / 1.2);
	//ctx.strokeText(`xp: ${xp}`, canvas.width / 2.5, canvas.height / 1.2);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(message.author.displayAvatarURL);
	ctx.drawImage(avatar, 25, 25, 200, 200);
    
    const attachment = new Discord.Attachment(canvas.toBuffer(), `Rankcard from ${message.author.username}.png`);
    message.channel.send(attachment).then(m => setTimeout(() => {if(m.deletable){m.delete}
if(message.deletable){message.delete()}}, 1200000))
    
}

else {
    var user = client.users.get(args[0].replace("<@", "").replace(">", "").replace("!", ""))
    let rank = db.get(`member.level.${user.id}.balance`);
    let xp = db.get(`member.xp.${user.id}.balance`);

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    
    
	const background = await Canvas.loadImage("https://picsum.photos/705/255.jpg");
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    
	//ctx.strokeStyle = '#000000';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    
	ctx.font = applyText(canvas, message.member.displayName + "#" + message.member.user.discriminator)
	ctx.fillStyle = '#ffffff';
    ctx.fillText(user.username + "#" + message.member.user.discriminator, canvas.width / 2.5, canvas.height / 1.8);
    //ctx.strokeText(message.member.displayName + "#" + message.member.user.discriminator, canvas.width / 2.5, canvas.height / 1.8)

    ctx.font = '35px sans-serif';
	ctx.fillStyle = '#ffffff';
    ctx.fillText('Rankcard from:', canvas.width / 2.5, canvas.height / 2.6);
    //ctx.strokeText('Rankcard from:', canvas.width / 2.5, canvas.height / 2.6);
    
    ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
    ctx.fillText(`Level: ${rank}`, canvas.width / 2.5, canvas.height / 1.4);
   //ctx.strokeText(`Level: ${rank}`, canvas.width / 2.5, canvas.height / 1.4);
    
    ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`xp: ${xp}`, canvas.width / 2.5, canvas.height / 1.2);
	//ctx.strokeText(`xp: ${xp}`, canvas.width / 2.5, canvas.height / 1.2);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(user.displayAvatarURL);
	ctx.drawImage(avatar, 25, 25, 200, 200);
    
    const attachment = new Discord.Attachment(canvas.toBuffer(), `Rankcard from ${message.author.username}.png`);
    message.channel.send(attachment).then(m => setTimeout(() => {if(m.deletable){m.delete}
if(message.deletable){message.delete()}}, 1200000))
}
db.add(`bot.commands.rank.howoftenuse`, 1)    
    
    

}
        if (alias.startsWith("setrank")){
            if (client.guilds.get(message.channel.guild.id).members.get(message.author.id).hasPermission("BAN_MEMBERS")){
            var operation = args[2]
            var what = args[1]
            var zahl = parseInt(args[3])
            var userid = args[0].replace("<@", "").replace(">", "").replace("!", "")
            

            if (message.channel.guild.members.find(x => x.id === userid)){
                if(operation == "+" || operation == "-"){
                    var userxp = db.get(`member.xp.${userid}.balance`)
                    var userlevel = db.get(`member.level.${userid}.balance`)

                    if (what == "xp" || what == "level" || what == "rank"){
                        if (what == "rank"){what = "level"}
                        var newone = parseInt(db.get(`member.${what}.${userid}.balance`))
                        if (operation == "+"){newone = newone + zahl}
                        if (operation == "-"){newone = newone - zahl}
                        db.set(`member.${what}.${userid}.balance`, newone)

                        message.reply("Ich habe erfolgreich denn " + what + " Wert von " + client.users.get(userid).username + " auf " + newone + " gesetzt.")

                    }
                    else {message.reply("Du kannst nur denn Wert von XP und Level bestimmen")}
                    
                }
                else {message.reply("Du kannst nur + oder - machen")}
            }
            else {message.reply("Kann User nicht finden")}
        }
        else (message.reply("Du hast keine Berechtigung dafür"))
        db.add(`bot.commands.setrank.howoftenuse`, 1)    
    }
    
}   
    
})