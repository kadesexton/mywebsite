require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// Securely access OpenAI API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "system", content: "You are KADE-9000, an AI assistant specializing in cybersecurity." },
                           { role: "user", content: userMessage }]
            })
        });

        const data = await response.json();
        res.json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ response: "Error calling AI." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
