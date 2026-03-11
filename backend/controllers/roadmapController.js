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

    let rawText = "";

    try {
      const result = await model.generateContent(prompt);
      rawText = result.response.text().trim();
      rawText = rawText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    } catch (apiError) {
      console.warn("⚠️ Gemini API Error (Likely Rate Limit/429). Generating Fallback Mock Curriculum:", apiError.message);

      // Fallback Static Curriculum if Gemini reaches quota limit
      rawText = JSON.stringify({
        tiers: [
          {
            name: "beginner",
            modules: [
              {
                id: "module_1", title: "Fundamentals of " + domain, description: "Basic concepts and definitions.",
                steps: [
                  { id: "step_1", title: "Introduction to " + domain, description: "Overview of the field.", type: "video", xp: 50 },
                  { id: "step_2", title: "Core Basics", description: "Fundamental building blocks.", type: "video", xp: 50 },
                  { id: "step_3", title: "Module Assessment", description: "Test your knowledge.", type: "test", xp: 100, questions: [{ question: "What is " + domain + "?", options: ["A field", "A rock", "A car", "A tree"], answerIndex: 0 }, { question: "Is this fundamental?", options: ["Yes", "No", "Maybe", "I don't know"], answerIndex: 0 }, { question: "Pick the right answer.", options: ["Wrong", "Right", "Wrong", "Wrong"], answerIndex: 1 }] }
                ]
              },
              {
                id: "module_2", title: "Environment Setup", description: "Getting your tools ready.",
                steps: [
                  { id: "step_4", title: "Installing Tools", description: "Software required.", type: "video", xp: 50 },
                  { id: "step_5", title: "First Configuration", description: "Hello world setup.", type: "video", xp: 50 },
                  { id: "step_6", title: "Module Assessment", description: "Test your knowledge.", type: "test", xp: 100, questions: [{ question: "What do you install?", options: ["Tools", "Games", "Malware", "Nothing"], answerIndex: 0 }, { question: "Is setup important?", options: ["Yes", "No", "Sometimes", "Never"], answerIndex: 0 }, { question: "Did you configure?", options: ["Yes", "No", "Maybe", "Later"], answerIndex: 0 }] }
                ]
              }
            ]
          },
          {
            name: "intermediate",
            modules: [
              {
                id: "module_3", title: "Intermediate Concepts", description: "Going a level deeper.",
                steps: [
                  { id: "step_7", title: "Architecture", description: "How things connect.", type: "video", xp: 50 },
                  { id: "step_8", title: "Best Practices", description: "Standard conventions.", type: "video", xp: 50 },
                  { id: "step_9", title: "Module Assessment", description: "Test your knowledge.", type: "test", xp: 100, questions: [{ question: "What is architecture?", options: ["Structure", "Art", "Music", "Food"], answerIndex: 0 }, { question: "Are best practices good?", options: ["Yes", "No", "Maybe", "Bad"], answerIndex: 0 }, { question: "Pick A.", options: ["A", "B", "C", "D"], answerIndex: 0 }] }
                ]
              },
              {
                id: "module_4", title: "Real-world Applications", description: "Building actual things.",
                steps: [
                  { id: "step_10", title: "Project 1", description: "First intermediate project.", type: "video", xp: 50 },
                  { id: "step_11", title: "Project 2", description: "Second intermediate project.", type: "video", xp: 50 },
                  { id: "step_12", title: "Module Assessment", description: "Test your knowledge.", type: "test", xp: 100, questions: [{ question: "Did you build it?", options: ["Yes", "No", "Broken", "Wait"], answerIndex: 0 }, { question: "Was it hard?", options: ["Yes", "No", "Very", "Easy"], answerIndex: 0 }, { question: "Done?", options: ["Yes", "No", "Almost", "Barely"], answerIndex: 0 }] }
                ]
              }
            ]
          },
          {
            name: "advanced",
            modules: [
              {
                id: "module_5", title: "Advanced Topics", description: "Expert level material.",
                steps: [
                  { id: "step_13", title: "Optimization", description: "Making it fast.", type: "video", xp: 50 },
                  { id: "step_14", title: "Security", description: "Making it safe.", type: "video", xp: 50 },
                  { id: "step_15", title: "Module Assessment", description: "Test your knowledge.", type: "test", xp: 100, questions: [{ question: "Is it fast?", options: ["Yes", "No", "Slow", "Stopped"], answerIndex: 0 }, { question: "Is it safe?", options: ["Yes", "No", "Hacked", "Leaked"], answerIndex: 0 }, { question: "Advanced enough?", options: ["Yes", "No", "Too advanced", "Basic"], answerIndex: 0 }] }
                ]
              },
              {
                id: "module_6", title: "Mastery", description: "The final frontier.",
                steps: [
                  { id: "step_16", title: "Expert Architecture", description: "System design.", type: "video", xp: 50 },
                  { id: "step_17", title: "Deployment", description: "Going live.", type: "video", xp: 50 },
                  { id: "step_18", title: "Final Assessment", description: "Test your knowledge.", type: "test", xp: 100, questions: [{ question: "Are you a master?", options: ["Yes", "No", "Jedi", "Sith"], answerIndex: 0 }, { question: "Is it deployed?", options: ["Yes", "No", "Crash", "Burn"], answerIndex: 0 }, { question: "Course complete?", options: ["Yes", "Yes", "Yes", "Yes"], answerIndex: 0 }] }
                ]
              }
            ]
          }
        ]
      });
    }

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