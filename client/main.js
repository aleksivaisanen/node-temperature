let temperature = "-"

const fetchTemperature = () => {
    fetch('/temperature')
        .then(response => response.json())
        .then(data => temperature = data.temperature)
        .catch(err => temperature = "-")

    const temperatureElement = document.getElementById("temperature")
    console.log(temperature)
    temperatureElement.innerText = temperature + " °C"
}

setInterval(fetchTemperature, 1000);