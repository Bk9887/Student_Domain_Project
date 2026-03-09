const Roadmap = require("../models/Roadmap");

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