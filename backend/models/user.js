const mongoose = require("mongoose");

const domainProgressSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  progress: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    domain: { type: String, default: null },
    domainProgress: [domainProgressSchema],

    points: { type: Number, default: 0 },

    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },

    // 🔹 Profile Details
    photo: { type: String, default: "" },
    phone: { type: String },
    parentPhone: { type: String },
    address: { type: String },
    github: { type: String }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);