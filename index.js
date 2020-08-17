const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const devicesLocation = '/sys/bus/w1/devices/';

function sensor() {
    // get sensor from filesystem
    return new Promise((resolve, reject) => {
        fs.readdir(devicesLocation, function (err, files) {
            if (err) {
                console.error('Error occured while reading directory!', err)
                reject(err)
            }
            for (const file of files) {
                if (file !== 'w1_bus_master1') {
                    resolve(file);
                }
            }
        })
    })
}

function readSensor() {
    return new Promise((resolve, reject) => {
        sensor()
            .then(result => {
                const sensorData = result;
                const location = devicesLocation + sensorData + '/w1_slave';

                fs.readFile(location, 'utf8', function (err, data) {
                    if (err) {
                        console.error("Reading file failed, error:", err)
                        reject(err)
                    }
                    const secondline = data.split("\n")[1];
                    const temperatureData = secondline.split(" ")[9];
                    const temperature = parseFloat(temperatureData.substring(2));
                    celcius = temperature / 1000;
                    celcius = celcius.toFixed(1);
                    resolve(celcius)
                })
            })
    })
}

// Set static folder
app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.get('/temperature', (req, res) => {
    readSensor()
        .then(result => res.json({ 'temperature': result }))
        .catch(err => res.status(404).json({ success: false }))
})

const port = process.env.PORT || 5000;

http.createServer(app).listen(port, () => {
    console.log('Server started on port ' + port)
})
