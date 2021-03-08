const fetchuserdata = () => {
    const usericon = document.querySelector(".usercard img")
    const username = document.querySelector(".usercard a")
    
    fetch('http://192.168.0.28:7869/api/user/@basic', {
    method: 'GET'
    })
    .then(response => {
     
    response.json().then(data => {{
      if (response.status == 429) return SimpleNotification.error({text: `API Response ${response.status}: \r` + `\`\`${data.error}\`\`` + "\r\rDu wurdest von der API gebannt weil du das Limit für Anfragen pro Sekunde überschritten hast. Melde dich bitte bei Dustin um diese Sperre aufzuheben",}, {sticky: true, closeButton: false, closeOnClick: false})
      if (response.status > 226) return SimpleNotification.error({text: `API Response ${response.status}: \r` + `\`\`${data.error}\`\`` + "\r\rEin erneuter Login mit Discord **könnte** helfen",
      buttons: [{
        value: 'Discord Login page ', // The text inside the button
        type: 'error', // The type of the button, same as for the notifications
        onClick: (notification) => {
            notification.remove()
            window.location.replace("/discord")
        }
    }]},
    {duration: 20000})

      username.textContent = data.name + "#" + data.discriminator
      usericon.setAttribute("src", `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.jpg`)
      username.setAttribute("href", `/webinterface/user/${data.id}`)

      //make admin tools visibil
      if (data.type > 89){
        document.querySelectorAll(".admin").forEach(q => {
          q.setAttribute("style", "display: block;")
        })
      }
        }})    .catch((error) => {
        //react to all errors
        console.error('Error:', error);
      });
    })};

    fetchuserdata()