var { client } = require("../index")
var schedule = require("node-schedule")

var j = schedule.scheduleJob('0 * * * * *', function(){
    client.channels.filter(channel => channel.type === "voice").forEach(channel => {
        

    })
  });