let temperature = "-"

const fetchTemperature = () => {
    fetch('/temperature')
        .then(response => response.json())
        .then(data => {
            temperature = data.temperature
            const temperatureElement = document.getElementById("temperature")
            console.log("Temperature", temperature)
            if (!isNaN(temperature)) {
                temperatureElement.innerText = temperature + " °C"
            }
        })
        .catch(err => {
            console.log("Error", err)
            temperature = "-"
        })
}

fetchTemperature();
setInterval(fetchTemperature, 60000);