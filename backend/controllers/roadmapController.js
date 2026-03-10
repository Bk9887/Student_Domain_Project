const Roadmap = require("../models/Roadmap");
const youtubesearchapi = require("youtube-search-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getRoadmapByDomain = async (req, res) => {
  try {
    const { domain } = req.params;
    const roadmap = await Roadmap.findOne({ domain });
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoadmapVideos = async (req, res) => {
  try {
    const { domain } = req.params;
    if (!domain || domain === "Not Selected") {
      return res.status(400).json({ message: "Invalid domain" });
    }

    // 1. Try to fetch from DB first
    let roadmapDb = await Roadmap.findOne({ domain });

    // 2. If it exists in DB, just return the precise saved tiers directly.
    if (roadmapDb && roadmapDb.tiers && roadmapDb.tiers.length > 0) {
      return res.json({ tiers: roadmapDb.tiers });
    }

    // 3. Otherwise, Generate it completely from scratch with Gemini
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Missing GEMINI_API_KEY for automatic roadmap generation." });
    }

    // Safety fallback for extremely long generation times
    req.setTimeout(600000); // 10 minutes
    res.setTimeout(600000);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-2.5-flash as it is fast and capable of strict JSON
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert software engineering curriculum designer. The user wants to learn the domain: "${domain}".
Generate a highly structured, accurate learning roadmap. 
It must be valid JSON ONLY, with no markdown formatting tricks outside of the JSON block itself.
Structure:
{
  "tiers": [
    {
      "name": "beginner",
      "modules": [
        {
          "id": "module_1", 
          "title": "Module Name (e.g. Fundamentals)",
          "description": "Short description of the module.",
          "steps": [
            {
              "id": "step_1",
              "title": "Topic Name",
              "description": "Short description of what the student will learn in this video.",
              "type": "video",
              "xp": 50
            },
            {
              "id": "step_2",
              "title": "Module Assessment",
              "description": "Test your knowledge on this module.",
              "type": "test",
              "xp": 100,
              "questions": [
                {
                  "question": "What is...? (make it specific to the domain)",
                  "options": ["A", "B", "C", "D"],
                  "answerIndex": 0 
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

CRITICAL RULES:
- Make exactly 3 tiers named strictly: "beginner", "intermediate", "advanced".
- Inside EACH tier, make exactly 2 modules.
- Inside EACH module, make exactly 3 steps. 
- The first 2 steps MUST be type "video". 
- The 3rd step MUST be type "test" covering the previous 2 videos.
- Provide precisely 3 challenging multiple-choice questions for each "test" step.
- Output RAW JSON ONLY. Do not wrap in \`\`\`json. Just start with { and end with }.
`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    // Rigorously clean markdown block if gemini occasionally disobeys
    rawText = rawText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

    const parsedData = JSON.parse(rawText);

    // 4. Hydrate video steps with YouTube IDs in parallel using youtube-search-api
    const hydratePromises = [];
    for (let t of parsedData.tiers) {
      for (let m of t.modules) {
        for (let s of m.steps) {
          if (s.type === "video") {
            const query = `${domain} ${s.title} tutorial english`;
            const p = youtubesearchapi.GetListByKeyword(query, false, 1, [{ type: "video" }])
              .then(ytRes => {
                if (ytRes && ytRes.items && ytRes.items.length > 0) {
                  s.videoId = ytRes.items[0].id;
                } else {
                  s.videoId = "dQw4w9WgXcQ"; // Never Gonna Give You Up fallback instead of breaking UI
                }
              })
              .catch(err => {
                console.error("Youtube API error on", query, err);
                s.videoId = "dQw4w9WgXcQ";
              });
            hydratePromises.push(p);
          }
        }
      }
    }

    await Promise.all(hydratePromises);

    // 5. Save the perfectly constructed tiered roadmap to MongoDB for instant future loads
    roadmapDb = new Roadmap({
      domain,
      tiers: parsedData.tiers
    });

    await roadmapDb.save();

    res.json({ tiers: parsedData.tiers });

  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    res.status(500).json({ message: "Failed to fetch or generate roadmap tiers.", error: error.message });
  }
};