# Student Domain - AI Powered Career Ecosystem

**Student Domain** is an advanced, AI-driven career guidance and skill-tracking platform designed to help students bridge the gap between academic learning and industry mastery. 

The application uses Google's Gemini AI to discover a student's ideal career path and provides a structured, multi-tiered learning environment with built-in professional output tools like automated Portfolio and Resume builders.

---

## 🌟 Key Features

### 🧠 AI Oracle & Discovery
- **Personalized Recommendations**: An AI-driven Interest Test helps students find the best career domain for their personality and goals.
- **AI Career Mentor**: A persistent sidebar chatbot powered by Gemini for instant contextual support.

### 🗺️ Dynamic Learning Roadmaps
- **Tiered Progression**: Structured learning split into **Beginner**, **Intermediate**, and **Advanced** levels.
- **Sequential Locking**: Tiers only unlock once previous milestones are verified, ensuring a solid foundation.
- **Integrated Video Modules**: Curated high-quality video lessons embedded directly within the UI.
- **Interactive Quizzes**: AI-generated MCQ tests to validate learning and award XP.

### 📊 My Journey Dashboard
- **Multi-Domain Tracking**: Start and track progress across multiple career paths simultaneously.
- **Persistence**: Real-time progress syncing to MongoDB Atlas ensures your journey is never lost.
- **Leaderboard**: Compete with students globally and track your Efficiency (XP) and Streak.

### 📄 Professional Output Tools
- **Automated Resume Builder**: Convert your learning progress into a professional, minimalist resume with one-click PDF export.
- **Portfolio Generator**: Create and host a professional portfolio showcasing your projects and experiences.

### 🛡️ Admin Command Center
- **Domain Management**: Full CRUD capability to add or modify carrer domains and roadmaps.
- **Student Oversight**: Monitor student progress, XP distribution, and system-wide activity.
- **Feedback Inbox**: Integrated system for managing student bug reports and support requests with real-time notifications.

---

## 🛠️ Tech Stack (MERN)

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (Mongoose ODM).
- **AI Integration**: Google Gemini Pro (Generative AI SDK).
- **Authentication**: Stateless JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).
- **Security**: Bcryptjs password hashing & CORS protection.

---

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bk9887/Student_Domain_Project.git
   cd Student_Domain_Project/student-domain-app
   ```

2. **Backend Configuration**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secure_secret
   GEMINI_API_KEY=your_google_ai_key
   ```
   
   Install and start:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Configuration**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📂 Architecture Overview
The project follows a modular RESTful architecture:
- **Presentation Layer**: React logic separated into Pages and reusable UI Components.
- **Service Layer**: Backend controllers handling business logic and AI orchestration.
- **Data Layer**: MongoDB Atlas for high-availability document storage.

---

## 📄 Documentation
Detailed technical documentation and guides are available for deeper project analysis:
- [Full Documentation Report](project_report.html)

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---
*Developed as part of the Student Domain Excellence Project.*