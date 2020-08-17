const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const devicesLocation = '/sys/bus/w1/devices/';

function sensor() {
    let ds18b20 = null
    // get sensor from filesystem
    fs.readdir(devicesLocation, (err, files) => {
        console.log("files", files)
        for (const file of files) {
            console.log("file", file)
            if (file !== 'w1_bus_master1') {
                ds18b20 = file;
                console.log(ds18b20)
                return ds18b20;
            }
        }
    })
    console.log('ds18b20', ds18b20)
    return ds18b20;
}

function readSensor() {
    console.log("sensor()", sensor())
    const location = devicesLocation + sensor() + '/w1_slave';
    let celcius = null
    fs.readFile(location, data => {
        console.log("readfile data", data)
        const secondline = data.split("\n")[1];
        const temperatureData = secondline.split(" ")[9];
        console.log("temperatureData", temperatureData)
        const temperature = parseFloat(temperatureData.substring(2));
        celcius = temperature / 1000;
        celcius = celcius.toFixed(1);
    })
    return celcius
}

// Set static folder
app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.get('/temperature', (req, res) => {
    try {
        const temperatureValue = readSensor()
        console.log('temperatureValue', temperatureValue)
        res.json({ 'temperature': temperatureValue });
    }
    catch (err) {
        err => res.status(404).json({ success: false });
    }
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));