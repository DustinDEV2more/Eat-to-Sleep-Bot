document.getElementById('button').onclick = function (evt) { 	
    let signature = document.getElementById('name');
    let accepted = document.querySelector(".checkbox1:checked")
    let email = document.querySelector("#checkbox2:checked")

    if (signature.value == "") return document.querySelector("#namelabel").setAttribute("style", "color: red;")
    if (accepted == null) return document.querySelector("#read_and_accept-label").setAttribute("style", "color: red;")

    document.querySelector("#button").setAttribute("style", "display: none;")
    document.querySelector("#loading").setAttribute("style", "display: block;")

    fetch('http://192.168.0.28:7869/webinterface/usemyvoice/', {
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
            response.json().then(data => {{
            if (response.status == 200){
                document.querySelector(".submit-button").setAttribute("style", "display: none;")

                return SimpleNotification.success({text: "Du hast die Einverständniss Erklärung erfolgreich unterschrieben!\rDu kannst diesen Tab nun schließen",}, {sticky: true, closeButton: false, closeOnClick: false})


            }
            else {
                document.querySelector("#button").setAttribute("style", "display: block;")
                document.querySelector("#loading").setAttribute("style", "display: none;")
                if (response.status == 401) return SimpleNotification.error({text: "Du hast ein oder mehrere Pflichtfelder vergessen. Sie sind mit einem * makiert\r\r" + `\`\`${data.error}\`\``},{duration: 10000})
                if (response.status == 402) return SimpleNotification.error({text: "Leider können wir dir keine Email senden, da du dies bei der Discord Authentication verhindert hast. Bitte entferne die auswahlmöglichkeit und probiere es erneut.\r\r" + `\`\`${data.error}\`\``},{duration: 20000})
                if (response.status == 500) return SimpleNotification.error({text: `API Response ${response.status}: \r` + `\`\`${data.error}\`\``},{duration: 15000})
            
            }
        }})
        }).catch((error) => {
            console.log(error)
            document.querySelector("#button").setAttribute("style", "display: block;")
            document.querySelector("#loading").setAttribute("style", "display: none;")
            return SimpleNotification.error({text: "Etwas ist schiefgelaufen"},
            {duration: 15000})
        })

    
 }
 