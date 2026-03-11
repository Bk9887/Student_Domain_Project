const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        skills: {
            type: [String],
            default: []
        },
        careers: {
            type: [String],
            default: []
        },
        roadmap: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
                duration: { type: String }, // e.g. "2 Weeks"
                resources: [
                    {
                        title: { type: String },
                        url: { type: String },
                        type: { type: String, enum: ["video", "article", "course", "book"], default: "video" }
                    }
                ]
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Domain", domainSchema);
