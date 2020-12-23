exports.command = {
	name: 'test',
	description: 'Test command for slash_command-listener',
    roles: [],

    options: [
        {
        "name": "test",
        "description": "ein text mit dem der bot arbeiten kann",
        "type": 3,
        "required": true},
        {"name": "user", description: "ein user der cool ist", "type": 6, required: true}
    ],
	async execute(int, args, createAPIMessage, client) {
    const embed = require("../../Embed");

    console.log(args)

        client.api.interactions(int.id, int.token).callback.post({
            data: {type: 4, data: await createAPIMessage(int, embed.success(`Hey ${args.find(x => x.name == "user").value}`, `${args.find(x => x.name == "test").value}`))}
        })

    },
};