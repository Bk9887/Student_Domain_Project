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
  },
  totalSteps: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
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

    isAdmin: {
      type: Boolean,
      default: false
    },

    // Embedded Array for cloud-saved resumes
    savedResumes: [
      {
        name: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        data: { type: Object, required: true } // Stores the entire JSON state dump 
      }
    ],

    // Embedded Array for cloud-saved portfolios
    savedPortfolios: [
      {
        name: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        data: { type: Object, required: true } // Stores the entire JSON state dump 
      }
    ],

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

    studentName: {
      type: String
    },

    studentEmail: {
      type: String
    },

    college: {
      type: String
    },

    parentName: {
      type: String
    },

    parentEmail: {
      type: String
    },

    linkedin: {
      type: String
    },

    portfolio: {
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