const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true
  },
  steps: [
    {
      title: String,
      description: String,
      order: Number
    }
  ]
});

module.exports = mongoose.model("Roadmap", roadmapSchema);