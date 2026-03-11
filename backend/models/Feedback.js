const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String, // Cached for easier tabular viewing
            required: true
        },
        email: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ["bug", "feature", "question", "other"],
            default: "other"
        },
        message: {
            type: String,
            required: true
        },
        isResolved: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
