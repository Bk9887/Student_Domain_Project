const mongoose = require("mongoose");
require("dotenv").config();
const Domain = require("../models/Domain");

const domains = [
    {
        name: "Web Development",
        description: "Master both frontend and backend technologies to build complete, scalable web applications from scratch.",
        skills: ["React & Next.js", "Node.js & Express", "MongoDB & SQL", "Tailwind CSS", "REST APIs"],
        careers: ["Full Stack Developer", "Frontend Engineer", "Backend Developer", "Web Architect"]
    },
    {
        name: "Data Science",
        description: "Uncover insights from data using statistical analysis, visualization, and predictive modeling.",
        skills: ["Python & R", "Statistics", "Pandas & Numpy", "Data Visualization", "Big Data"],
        careers: ["Data Scientist", "Data Analyst", "Business Intelligence", "Data Engineer"]
    },
    {
        name: "Cyber Security",
        description: "Protect systems and networks from digital attacks. Learn ethical hacking, risk management, and defense.",
        skills: ["Ethical Hacking", "Network Security", "Cryptography", "Identity Management", "Incident Response"],
        careers: ["Security Analyst", "Penetration Tester", "Security Engineer", "CISO"]
    },
    {
        name: "Artificial Intelligence",
        description: "Build intelligent systems using machine learning, neural networks, and deep learning algorithms.",
        skills: ["Machine Learning", "Neural Networks", "Deep Learning", "NLP", "TensorFlow/PyTorch"],
        careers: ["AI Engineer", "ML Researcher", "Intelligence Architect", "Robotics Dev"]
    },
    {
        name: "Cloud Computing",
        description: "Design and manage scalable cloud infrastructure. Learn AWS, Azure, and DevOps practices.",
        skills: ["AWS/Azure/GCP", "Kubernetes & Docker", "CI/CD Pipelines", "Terraform", "Serverless Architecture"],
        careers: ["Cloud Architect", "DevOps Engineer", "Solutions Architect", "SRE"]
    },
    {
        name: "Graphics Designing",
        description: "Create visual concepts to communicate ideas that inspire, inform, and captivate consumers.",
        skills: ["Adobe Photoshop", "Adobe Illustrator", "UI/UX Design", "Typography", "Branding"],
        careers: ["Graphic Designer", "UI/UX Designer", "Art Director", "Brand Identity Developer"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing domains
        await Domain.deleteMany({});
        console.log("Cleared existing domains.");

        // Insert new domains
        await Domain.insertMany(domains);
        console.log("Seeded " + domains.length + " domains successfully!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
