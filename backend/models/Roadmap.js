const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['video', 'test'], required: true },
  xp: { type: Number, default: 50 },
  videoId: { type: String },
  questions: [{
    question: String,
    options: [String],
    answerIndex: Number
  }]
});

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  steps: [stepSchema]
});

const tierSchema = new mongoose.Schema({
  name: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  modules: [moduleSchema]
});

const roadmapSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true
  },
  tiers: [tierSchema]
});

module.exports = mongoose.model("Roadmap", roadmapSchema);