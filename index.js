const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const devicesLocation = '/sys/bus/w1/devices'; 

const sensor = () => {
    // get sensor from filesystem
    fs.readdir(devicesLocation, (err, files) => {
        files.forEach(file => {
            if (file != 'w1_bus_master1') {
                const ds18b20 = file;
                return ds18b20;
            }
        })
    })
}

const readSensor = () => {
    const location = devicesLocation + sensor + '/w1_slave';
    fs.readFile(location, data => {
        const secondline = data.split("\n")[1];
        const temperatureData = secondline.split(" ")[9];
        const temperature = parseFloat(temperatureData.substring(2));
        const celcius = temperature/1000;
        return celcius.toFixed(1);
    })
}

// Set static folder
app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.get('/temperature', (req, res) => {
    try {
        res.json({ temperature: readSensor });
    }
    catch (err) {
        err => res.status(404).json({ success: false });
    }
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));