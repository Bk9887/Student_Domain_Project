const User = require("../models/user");
const AppConfig = require("../models/AppConfig");

// @desc    Get global app statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        // Calculate total points across the entire system
        const allUsers = await User.find({}).select("points domain");
        const totalPoints = allUsers.reduce((sum, user) => sum + (user.points || 0), 0);

        // Calculate domain distribution
        const domainCounts = {};
        let usersWithDomain = 0;

        allUsers.forEach(user => {
            if (user.domain && user.domain !== "Not Selected") {
                usersWithDomain++;
                domainCounts[user.domain] = (domainCounts[user.domain] || 0) + 1;
            }
        });

        res.json({
            totalUsers,
            totalPoints,
            activeLearners: usersWithDomain,
            domainDistribution: domainCounts
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ message: "Failed to fetch statistics" });
    }
};

// @desc    Get all users (for tracking table)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select("name email domain points streak isAdmin lastActiveDate createdAt")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error("Admin users error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// @desc    Get global app config
// @route   GET /api/admin/config
// @access  Public (so app can read it on mount)
exports.getConfig = async (req, res) => {
    try {
        let config = await AppConfig.findOne();

        if (!config) {
            // Create default config if it doesn't exist yet
            config = await AppConfig.create({
                maintenanceMode: false,
                announcement: "",
                showAiMentor: true
            });
        }

        res.json(config);
    } catch (error) {
        console.error("Config fetch error:", error);
        res.status(500).json({ message: "Failed to fetch app configuration" });
    }
};

// @desc    Update global app config
// @route   PUT /api/admin/config
// @access  Private/Admin
exports.updateConfig = async (req, res) => {
    try {
        const { maintenanceMode, announcement, showAiMentor } = req.body;

        let config = await AppConfig.findOne();

        if (!config) {
            config = new AppConfig();
        }

        if (maintenanceMode !== undefined) config.maintenanceMode = maintenanceMode;
        if (announcement !== undefined) config.announcement = announcement;
        if (showAiMentor !== undefined) config.showAiMentor = showAiMentor;

        await config.save();

        res.json(config);
    } catch (error) {
        console.error("Config update error:", error);
        res.status(500).json({ message: "Failed to update app configuration" });
    }
};

const Domain = require("../models/Domain");

// ==========================================
// STUDENT MANAGEMENT
// ==========================================

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isAdmin) {
            return res.status(403).json({ message: "Cannot delete another administrator" });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User removed successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

// ==========================================
// DOMAIN MANAGEMENT
// ==========================================

// @desc    Get all domains
// @route   GET /api/admin/domains
// @access  Public (so users can eventually see them in the app list)
exports.getDomains = async (req, res) => {
    try {
        const domains = await Domain.find({}).sort({ createdAt: -1 });
        res.json(domains);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch domains" });
    }
};

// @desc    Create a specific domain
// @route   POST /api/admin/domains
// @access  Private/Admin
exports.createDomain = async (req, res) => {
    try {
        const { name, description, skills, careers } = req.body;

        const domainExists = await Domain.findOne({ name });
        if (domainExists) {
            return res.status(400).json({ message: "Domain already exists" });
        }

        const domain = await Domain.create({
            name,
            description,
            skills: skills || [],
            careers: careers || [],
            roadmap: [] // Initializes empty UI for the Roadmap builder later
        });

        res.status(201).json(domain);
    } catch (error) {
        console.error("Create domain error:", error);
        res.status(500).json({ message: "Failed to create domain" });
    }
};

// @desc    Update a specific domain
// @route   PUT /api/admin/domains/:id
// @access  Private/Admin
exports.updateDomain = async (req, res) => {
    try {
        const domain = await Domain.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!domain) return res.status(404).json({ message: "Domain not found" });

        res.json(domain);
    } catch (error) {
        res.status(500).json({ message: "Failed to update domain" });
    }
};

// @desc    Delete a specific domain
// @route   DELETE /api/admin/domains/:id
// @access  Private/Admin
exports.deleteDomain = async (req, res) => {
    try {
        const domain = await Domain.findByIdAndDelete(req.params.id);
        if (!domain) return res.status(404).json({ message: "Domain not found" });

        res.json({ message: "Domain removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete domain" });
    }
};

const Feedback = require("../models/Feedback");

// ==========================================
// ROADMAP MANAGEMENT (Embedded inside Domain)
// ==========================================

// @desc    Update a roadmap array for a specific domain
// @route   PUT /api/admin/roadmaps/:domainId
// @access  Private/Admin
exports.updateRoadmap = async (req, res) => {
    try {
        const { roadmap } = req.body;

        const domain = await Domain.findByIdAndUpdate(
            req.params.domainId,
            { roadmap },
            { new: true, runValidators: true }
        );

        if (!domain) return res.status(404).json({ message: "Domain not found" });

        res.json(domain);
    } catch (error) {
        console.error("Roadmap update error:", error);
        res.status(500).json({ message: "Failed to update roadmap" });
    }
};

// ==========================================
// FEEDBACK & SUPPORT
// ==========================================

// @desc    Get all feedback tickets
// @route   GET /api/admin/feedback
// @access  Private/Admin
exports.getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({}).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch feedback" });
    }
};

// @desc    Mark a ticket as resolved
// @route   PUT /api/admin/feedback/:id/resolve
// @access  Private/Admin
exports.resolveFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { isResolved: true },
            { new: true }
        );
        if (!feedback) return res.status(404).json({ message: "Ticket not found" });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Failed to resolve ticket" });
    }
};
