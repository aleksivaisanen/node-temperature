const express = require('express');
const path = require('path');

const app = express();

// Set static folder
app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.get('/temperature', (req, res) => {
    try {
        res.json({ temperature: 100 })
    }
    catch (err) {
        err => res.status(404).json({ success: false })
    }
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));