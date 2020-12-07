module.exports = {
	name: 'rank',
	call: 'call',
	description: 'Gibt dir eine übersicht der aktuellen Ränge von dir oder einem anderen Mitglied',
    usage: `rank [@user#1234]`,
    permissions: [],
	execute(message, args) {
       
       message.channel.send("Hello World")
	},
};