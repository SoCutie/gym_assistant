const tracer = require('dd-trace').init()
require('dotenv').config();
const express = require('express');
const axios = require('axios');
 const cors = require('cors');
const app = express();
const path = require('path');

// Serve static files (assets, styles, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Route for /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'gym.html'));
});

app.use(cors());
app.use(express.json());

// Gym Assistant Endpoint
app.post('/api/generate-workout', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: req.body.prompt }],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ result: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("API Error:", error);
    }
});

// Cooking Assistant Endpoint
app.post('/api/generate-meal', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: req.body.prompt }],
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ result: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("API Error:", error);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
