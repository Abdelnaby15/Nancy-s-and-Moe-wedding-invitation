const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email, guests, message } = req.body;

    // Create an object with the form data
    const formData = {
        name,
        email,
        guests,
        message
    };

    // Load existing data from the JSON file
    let eventData = [];
    try {
        eventData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    } catch (err) {
        console.error('Error reading data file:', err);
    }

    // Add new form data to the array
    eventData.push(formData);

    // Write the updated data back to the file
    fs.writeFile('data.json', JSON.stringify(eventData, null, 2), (err) => {
        if (err) {
            console.error('Error writing data file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/');
            //res.status(200).send('Form submitted successfully!');
        }
    });
}

);

// Endpoint to retrieve attendee data
app.get('/attendees', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const attendees = JSON.parse(data);
            res.json(attendees);
        }
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
