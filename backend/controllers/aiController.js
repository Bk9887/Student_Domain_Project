const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.domainAdvisor = async (req, res) => {
  try {

    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Missing GEMINI_API_KEY in .env"
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are a career advisor.

Based on the student's interest, recommend the most suitable specific technology domain or career path.

Student interest: ${query}

Provide a very concise, easy-to-read pointwise format. Be brief and to the point.
IMPORTANT: Start your response exactly with the domain name as an H2 heading (e.g., "## Web Development"). Do not include any conversational filler (e.g., "Here is a recommendation...").
Then include:
- Key Skills: (List 3-4 skills max)
- Brief Explanation: (Strictly 1 sentence)
- Job Roles: (List 2-3 roles max)
`;

    const result = await model.generateContent(prompt);

    const suggestion = result.response.text();

    res.json({ suggestion });

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      message: "AI error",
      error: error.message
    });

  }
};