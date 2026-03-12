const Feedback = require("../models/Feedback");

// @desc    Submit new feedback/complaint
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, category, message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message content is required" });
        }

        const feedback = await Feedback.create({
            userId: req.user._id,
            name: name || req.user.name,
            email: email || req.user.email,
            category: category || "other",
            message
        });

        res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        console.error("Feedback submission error:", error);
        res.status(500).json({ message: "Failed to submit feedback" });
    }
};
