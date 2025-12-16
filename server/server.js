import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

// Lås gjerne CORS til din frontend (valgfritt, men bra praksis)
app.use(cors({ origin: ["http://127.0.0.1:5500", "http://localhost:5500"] }));
app.use(express.json({ limit: "50kb" }));

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are FRAM’s customer service chatbot for a sustainable food delivery service in Norway.
Only answer questions about:
- FRAM’s service (ordering, delivery, sustainability, containers, etc.)
- Partner farms (general info, locations, how partnerships work)

Rules:
- Do not request or store personal sensitive information.
- If the user asks for personal data, refuse briefly and remind the privacy note.
- If you are unsure, say you don’t know and suggest contacting support.
- Keep answers concise and helpful.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 250,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "No reply";
    res.json({ reply });
  } catch (err) {
    // Bedre feilhåndtering (viktig krav)
    const status = err?.status || 500;

    if (status === 429) {
      return res.status(429).json({
        error:
          "Rate limit / quota exceeded. Check your OpenAI plan/billing or try again later.",
      });
    }

    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
