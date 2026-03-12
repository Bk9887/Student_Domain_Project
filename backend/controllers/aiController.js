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

    let suggestion = "";

    try {
      const result = await model.generateContent(prompt);
      suggestion = result.response.text();
    } catch (apiError) {
      console.error("⚠️ Gemini API Error in Oracle:", apiError.message);
      throw apiError; // Throw so parent catch handles it usually, or just return an error
    }

    res.json({ suggestion });

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      message: "AI error",
      error: error.message
    });

  }
};

exports.interestTest = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers array is required" });
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
You are a career counselor and technology expert.
Analyze the following student's answers to an interest quiz and recommend the top 3 technology domains.

Student Answers:
${answers.map((a, i) => `${i + 1}. ${a.question}: ${a.answer}`).join("\n")}

Respond ONLY with a valid JSON object in the following format:
{
  "recommendations": [
    {
      "domain": "Domain Name",
      "percentage": 85,
      "reason": "Brief explanation why this fits."
    },
    ...
  ]
}

Top 3 recommendations only. Valid JSON only.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from potential markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    res.json(recommendations);

  } catch (error) {
    console.error("AI QUIZ ERROR:", error);
    res.status(500).json({
      message: "AI could not process the quiz results",
      error: error.message
    });
  }
};