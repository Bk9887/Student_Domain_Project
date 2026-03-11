const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// ✅ Create app FIRST
const app = express();

// ✅ Connect database
connectDB();

// ✅ Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const domainRoutes = require("./routes/domainRoutes");
const profileRoutes = require("./routes/profileRoutes"); // ⭐ ADD THIS
const aiRoutes = require("./routes/aiRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const adminRoutes = require("./routes/adminRoutes"); // ⭐ ADD THIS

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/domain", domainRoutes);
app.use("/api/profile", profileRoutes); // ⭐ ADD THIS
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/admin", adminRoutes); // ⭐ ADD THIS

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});