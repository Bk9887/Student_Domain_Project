const mongoose = require("mongoose");

const domainProgressSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  completedVideos: {
    type: [String],
    default: []
  }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    domain: {
      type: String,
      default: null
    },

    domainProgress: [domainProgressSchema],

    points: {
      type: Number,
      default: 0
    },

    streak: {
      type: Number,
      default: 0
    },

    lastActiveDate: {
      type: Date
    },

    // Profile Details
    photo: {
      type: String,
      default: ""
    },

    phone: {
      type: String
    },

    parentPhone: {
      type: String
    },

    address: {
      type: String
    },

    github: {
      type: String
    },

    // ================= EMAIL VERIFICATION =================
    isVerified: {
      type: Boolean,
      default: false
    },

    verificationToken: {
      type: String,
      default: null
    },

    // ================= PASSWORD RESET =================
    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpire: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);