var { MessageEmbed } = require("discord.js")

const Embedcreator = {
    success(title ,description) {
        return new MessageEmbed().setDescription(description).setColor("#1dd1a1").setTitle(`${title}`)
    },

    warn(title ,description) {
        return new MessageEmbed().setDescription(description).setColor("#feca57").setTitle(`🟡 ${title}`)
    },

    error_system(title ,description) {
        return new MessageEmbed().setDescription(description).setColor("#ee5253").setTitle(`🔴 System_Fehler: ${title}`).setFooter("Keine Sorge. An einem System Fehler bist du meistens nicht schuld.")
    },

    error_user(title ,description) {
        return new MessageEmbed().setDescription(description).setColor("#ee5253").setTitle(`🔴 User_Fehler: ${title}`)
    },

    invisible(title ,description) {
        return new MessageEmbed().setDescription(description).setColor("#36393E").setTitle(`${title}`)
    },
}

module.exports = Embedcreator
