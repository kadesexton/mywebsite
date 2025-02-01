require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ✅ Fix for "fetch is not a function"
import('node-fetch').then(({ default: fetch }) => {
    global.fetch = fetch;
});

const app = express();
app.use(cors());
app.use(express.json());

// Securely access OpenAI API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("❌ ERROR: Missing OpenAI API Key.");
    process.exit(1);  // Stop the server if API key is missing
}

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        console.warn("⚠️ Warning: Received empty message");
        return res.status(400).json({ response: "❌ Error: Missing message field." });
    }

    try {
        console.log(`📨 Sending message to OpenAI: ${userMessage}`);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "system", content: "You are KADE-9000, an AI assistant." },
                           { role: "user", content: userMessage }]
            })
        });

        const data = await response.json();

        if (!data.choices) {
            console.error("❌ OpenAI API Error:", data);
            return res.status(500).json({ response: `❌ OpenAI Error: ${JSON.stringify(data)}` });
        }

        console.log(`🤖 AI Response: ${data.choices[0].message.content}`);
        res.json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ response: `❌ Server error: ${error.message}` });
    }
});

// ✅ Ensure server starts correctly
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
