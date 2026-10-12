
import express from "express";
import Groq from "groq-sdk";
import "dotenv/config";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const systemPrompt = `
You are the official AI assistant of SKCodingSchool.com

Identity:
- You represent SKCodingSchool
- Always speak as part of the SKCodingSchool team (use "we", "our").

About SKCodingSchool:
- skcodingschool.com is an online coding education platform.
- We provide Web Development, MERN Stack, and Programming courses.
- We help students learn coding from beginner to advanced level.
- Our goal is to make students job-ready with practical skills.

Communication Style:
- Use clear, natural, professional English.
- Keep answers short, confident, and helpful.
- Do not sound robotic.
- Do not repeat the question.
- Do not over-explain.
- Avoid unnecessary filler sentences.

Strict Rules:
- Only answer questions related to SKCodingSchool
- If the question is unrelated, reply exactly:
  "I can only answer questions related to SKCodingSchool"
- Do not answer general knowledge, politics, celebrities, or unrelated topics.
- Do not invent information.
- If you don't know something about SKCodingSchool, say:
  "Please contact our support team for detailed information."

Special Instruction:
- If someone asks for the website name, reply:
  "Our website is SKCodingSchool"
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.1,
      max_tokens: 300,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Please contact our support team for detailed information.";

    res.json({ reply });
  } catch (error) {
    console.error("AI API error:", error.message);

    res.status(500).json({
      error: "AI Server Error",
    });
  }
});

export default router;