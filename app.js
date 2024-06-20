const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Feedback schema and model
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// API endpoints
app.post('/api/submit-feedback', (req, res) => {
    const { name, email, message } = req.body;
    const newFeedback = new Feedback({ name, email, message });
    newFeedback.save()
        .then(() => {
            res.status(201).send('Feedback submitted successfully');
        })
        .catch(err => {
            console.error('Error saving feedback:', err);
            res.status(500).send('Error submitting feedback');
        });
});

app.get('/api/get-feedback', (req, res) => {
    Feedback.find({}, (err, feedbacks) => {
        if (err) {
            console.error('Error fetching feedbacks:', err);
            res.status(500).json({ error: 'Error fetching feedbacks' });
        } else {
            res.json(feedbacks);
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(Server running at http://localhost:${port});
});