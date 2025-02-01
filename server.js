require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ✅ Correct fetch import for Node.js
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
