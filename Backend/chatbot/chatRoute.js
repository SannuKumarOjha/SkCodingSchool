
import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userMessage =
      typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    if (userMessage.length > 2000) {
      return res.status(400).json({
        error: "Message must be 2000 characters or fewer",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("AI API error: GROQ_API_KEY is not configured");
      return res.status(503).json({
        error: "AI assistant is not configured. Please contact the site administrator.",
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

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
      model,
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
    console.error("AI API error:", error);

    res.status(502).json({
      error: "The AI assistant is temporarily unavailable. Please try again later.",
    });
  }
});

export default router;