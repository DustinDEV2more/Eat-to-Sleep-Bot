document.getElementById('button').onclick = function (evt) { 	
    let signature = document.getElementById('name');
    let accepted = document.querySelector(".checkbox1:checked")
    let email = document.querySelector("#checkbox2:checked")

    if (signature.value == "") return document.querySelector("#namelabel").setAttribute("style", "color: red;")
    if (accepted == null) return document.querySelector("#read_and_accept-label").setAttribute("style", "color: red;")

    document.querySelector("#button").setAttribute("style", "display: none;")
    document.querySelector("#loading").setAttribute("style", "display: block;")

    fetch('http://server.dustin-dm.de:7869/webinterface/usemyvoice/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            signature: signature.value,
            accepted: accepted != null,
            email: email != null
        })
        }).then(response => {
            if (response.status == 200){
                document.querySelector("#button").setAttribute("style", "display: block;")
                document.querySelector("#loading").setAttribute("style", "display: none;")

                document.querySelector(".submit-button").setAttribute("style", "background-color: #1dd1a1;")
                document.querySelector("#button").innerHTML = "✅ Du kannst diesen Tab nun schließen"
                document.querySelector("#button").setAttribute("id", "button-dis")


            }
            else {
                document.querySelector("#button").setAttribute("style", "display: block;")
                document.querySelector("#loading").setAttribute("style", "display: none;")
                document.querySelector(".submit-button").setAttribute("style", "background-color: #ee5253;")
                document.querySelector("#button").innerHTML = "❌ something went wrong"
            }
        }).catch(() => {
            document.querySelector("#button").setAttribute("style", "display: block;")
            document.querySelector("#loading").setAttribute("style", "display: none;")
            document.querySelector(".submit-button").setAttribute("style", "background-color: #ee5253;")
            document.querySelector("#button").innerHTML = "❌ something went wrong"
        })

    
 }
 