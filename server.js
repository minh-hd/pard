const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({path: './.env.local'});

const app = express();

const port = process.env.PORT || 8000;

const apiKey = process.env.LANGUAGE_MODEL_API_KEY;
const apiUrl = process.env.LANGUAGE_MODEL_API_URL + apiKey;

app.use(express.json());
app.use(cors());

app.get('/prompt/:text', async (req, res) => {
    const text = req.params.text;

    const payload = {
        prompt: {
            messages: [
                {
                    content: text
                }
            ]
        },
        temperature: 0.1,
        candidate_count: 1
    };

    const response = await fetch(apiUrl, {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        method: "POST"
    });

    const data = await response.json();
    res.send(data);
});

app.listen(port, () => console.log(`App is running on port: ${port}`));