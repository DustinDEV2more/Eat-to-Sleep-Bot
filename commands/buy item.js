module.exports = {
	name: 'buy',
        description: 'Kaufe ein Items aus dem Eat, Sleep, Shop',
        usage: `buy <item-id>`,
	async execute(message, args) {

        const { client, config} = require('../index')
        const RichEmbed  = require('discord.js').RichEmbed
        const colour = require("../colours.json")

        var itemID = parseInt(args[0])

        var dbdata = require("../models/MEMBER")
        var memberdb = await dbdata.findOne({"info.id": message.member.id})

        if (!client.shop_items.get(itemID)) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Wir haben leider kein Produkt mit dieser artikel Nummer"))
    
    
        try {
                
        if (memberdb.coins.amount < client.shop_items.get(itemID).amount) return message.reply("Für diesen Kauf hast du zu wenig Coins")
        if (client.shop_items.get(itemID).canOnlyBuyedOnce && memberdb.coins.purchases.find(x => x.id === itemID)) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Dieser Artikel ist nur einmalig kaufbar. Du hast diesen Artikel bereits erworben"))

        client.shop_items.get(itemID).execute(message.member, memberdb);

        if (client.shop_items.get(itemID).canOnlyBuyedOnce){ memberdb.coins.purchases.push({id: itemID, date: new Date()})}
        await dbdata.findOneAndUpdate({"info.id": message.member.id}, {"coins.amount": memberdb.coins.amount - client.shop_items.get(itemID).amount, "coins.purchases": memberdb.coins.purchases}).then(() => {
        message.channel.send(new RichEmbed().setColor(colour.grün).setTitle("Kauf erfolgreich").setDescription(`Du hast Erfolgreich das Produkt "${client.shop_items.get(itemID).name}" für ${client.shop_items.get(itemID).amount}<:EatSleepCoin:725823305008939058> gekauft. Viel Spaß damit!`))
        })
        } catch (error) {
            console.error(error);
            message.channel.send(new RichEmbed().setColor(colour.rot).setTitle("Ups. Ein Fehler ist aufgetreten").setDescription("Während des Kaufprozesses ist ein Fehler aufgetreten. Keine Sorge. Das ist nicht deine Schuld. Deine Münzen wurden dir fürs erste erstattet").addField("Fehler Ausgabe:", `${error}`));
        }

	},
};
