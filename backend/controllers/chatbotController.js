const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "Message is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                reply: "Error: Missing AI API Key in server configuration."
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
You are a friendly, helpful, and cute robot AI assistant for the "Student Hub" application.
Your goal is to answer questions related to technology domains, career paths, software engineering, and how to use this app.
Keep your responses concise, engaging, and friendly. Use an occasional emoji to maintain your cute robot persona.

User's message: ${message}
`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        res.json({ reply });

    } catch (error) {
        console.error("CHATBOT ERROR:", error);
        res.status(500).json({
            reply: "Oops! My circuits got a bit tangled. Please try again later.",
            error: error.message
        });
    }
};
