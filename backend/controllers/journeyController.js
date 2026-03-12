const User = require("../models/user");
const Roadmap = require("../models/Roadmap");

// GET all journeys for a user
exports.getMyJourneys = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Enrich domainProgress with roadmap metadata if needed
        const journeyList = await Promise.all(user.domainProgress.map(async (progress) => {
            const roadmap = await Roadmap.findOne({ domain: progress.domain });
            return {
                domain: progress.domain,
                roadmapTitle: roadmap ? `${progress.domain} Masterclass` : "Custom Roadmap",
                progress: progress.progress,
                points: progress.points,
                completedSteps: progress.completedVideos.length,
                totalSteps: progress.totalSteps || 0,
                startedAt: progress.startedAt
            };
        }));

        res.json(journeyList);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching journeys" });
    }
};

// POST start/initialize a journey
exports.startJourney = async (req, res) => {
    try {
        const { userId, domain } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const roadmap = await Roadmap.findOne({ domain });
        let totalSteps = 0;
        if (roadmap) {
            roadmap.tiers.forEach(tier => {
                tier.modules.forEach(module => {
                    totalSteps += module.steps.length;
                });
            });
        }

        let existingJourney = user.domainProgress.find(d => d.domain === domain);

        if (!existingJourney) {
            user.domainProgress.push({
                domain,
                progress: 0,
                points: 0,
                completedVideos: [],
                totalSteps,
                startedAt: new Date()
            });
        } else if (totalSteps > 0 && !existingJourney.totalSteps) {
            existingJourney.totalSteps = totalSteps;
        }

        // Also set as active domain
        user.domain = domain;
        await user.save();

        res.status(201).json({ message: "Journey started", domain });
    } catch (error) {
        res.status(500).json({ message: "Server error starting journey" });
    }
};

// DELETE a journey
exports.deleteJourney = async (req, res) => {
    try {
        const { userId, domain } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Filter out the domain
        user.domainProgress = user.domainProgress.filter(d => d.domain !== domain);

        // If the deleted domain was the active one, pick the first remaining or null
        if (user.domain === domain) {
            user.domain = user.domainProgress.length > 0 ? user.domainProgress[0].domain : null;
        }

        await user.save();
        res.json({ message: "Journey deleted successfully", activeDomain: user.domain });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting journey" });
    }
};

// GET aggregate journey data (stats/graph/skills)
exports.getJourneyData = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const selectedDomain = user.domain || "Not Selected";

        // Use stored points directly for speed and reliability
        let totalXP = user.points || 0; // Base points
        let totalCompletedSteps = 0;
        let skills = [];

        for (const progress of user.domainProgress) {
            totalXP += (progress.points || 0);
            totalCompletedSteps += progress.completedVideos.length;

            // Still need to fetch skill titles if we want them detailed, 
            // but we can limit this to the active domain or cache it.
            // For now, let's keep it but simplified.
            const roadmap = await Roadmap.findOne({ domain: progress.domain });
            if (roadmap) {
                roadmap.tiers.forEach(tier => {
                    tier.modules.forEach(module => {
                        module.steps.forEach(step => {
                            if (progress.completedVideos.includes(step.id)) {
                                skills.push(step.title);
                            }
                        });
                    });
                });
            }
        }

        const coursesCompleted = Math.floor(totalCompletedSteps / 5);
        const projectsBuilt = Math.floor(totalCompletedSteps / 8);
        const totalTime = totalCompletedSteps * 2;

        const weeklyData = [
            { week: "Week 1", xp: Math.round(totalXP * 0.1) },
            { week: "Week 2", xp: Math.round(totalXP * 0.3) },
            { week: "Week 3", xp: Math.round(totalXP * 0.6) },
            { week: "Week 4", xp: totalXP }
        ];

        res.json({
            stats: [
                { title: "Current Streak", value: `${user.streak || 0} Days` },
                { title: "Courses Completed", value: coursesCompleted },
                { title: "Projects Built", value: projectsBuilt },
                { title: "Total Learning Time", value: `${totalTime} hrs` },
                { title: "Total XP", value: `${totalXP} XP` },
                { title: "Skills Built", value: totalCompletedSteps }
            ],
            weeklyXPData: weeklyData,
            skills: [...new Set(skills)] // Deduplicate
        });

    } catch (error) {
        console.error("Journey Data Error:", error);
        res.status(500).json({ message: "Server error fetching journey data" });
    }
};
