const fetchuserdata = () => {
    const usericon = document.querySelector(".usercard img")
    const username = document.querySelector(".usercard a")
    
    fetch('http://192.168.0.28:7869/api/userauth', {
    method: 'GET'
    })
    .then(response => {
      if (response.status == 401){window.location.replace("/discord");}
      if (response.status == 501){window.location.replace("/discord");}
      if (response.status == 500){window.alert("Etwas ist schiefgelaufen! Discord hat nicht wie erwartet auf die Anfrage von ESNR geantwortet. Bitte versuche es später erneut")}
    response.json().then(data => {{
      username.textContent = data.name
      usericon.setAttribute("src", data.avatar)

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