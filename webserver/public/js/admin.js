const fetchEvents = () => {
    fetch('http://192.168.0.28:7869/api/admin/events', {
    method: 'GET'
    })
    .then(response => {
     
    response.json().then(data => {{
      if (response.status > 226) return SimpleNotification.error({text: `API Response ${response.status}: \r` + `\`\`${data.error}\`\``},{duration: 20000})

        }})
        .catch((error) => {
        //react to all errors
        console.error('Error:', error);
        SimpleNotification.error({text: `Ein Fehler ist aufgetreten. Mehr Infos dazu in der console`},{duration: 10000})

      });
    })
}