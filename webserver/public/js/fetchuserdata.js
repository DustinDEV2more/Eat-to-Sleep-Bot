const fetchuserprofile = () => {

    fetch('http://server.dustin-dm.de:7869/api/user/@me', {
    method: 'GET'
    })
    .then(response => {
   response.json().then(data => {{

    //member will be deleted in future message
    if (data.delete_in != null) {
        document.querySelector(".deletemessage").setAttribute("style", "display: block;")
        document.querySelector(".usernamefill").textContent = data.name
    }

    //maincard
    document.querySelector(".maincard #name").textContent = data.name
    document.querySelector(".maincard #tag").textContent = data.type
    document.querySelector(".maincard img").setAttribute("src", `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=2048`)

    //rankcard
    document.querySelector(".rank #ranklist").textContent = "?"
    document.querySelector(".rank #rank").textContent = data.ranks.rank
    document.querySelector(".rank #xp").textContent = data.ranks.xp



      
        }})    .catch((error) => {
        //react to all errors
        console.error('Error:', error);
      });
    })};

    fetchuserprofile()