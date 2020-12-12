module.exports = {
	name: 'rank',
	call: 'call',
	description: 'Gibt dir eine übersicht der aktuellen Ränge von dir oder einem anderen Mitglied',
    usage: `rank [@user#1234]`,
    permissions: [],
	execute(message, args) {
		const embed = require("../Embed")
       
       message.channel.send(embed.error_user("Test Warnung", "Diese ist eine Test Warn Message um das Embed Module zu testen."))
	},
};