# Student Domain App

A MERN stack web application that helps students explore different career domains, build portfolios, track their learning progress, and interact with an AI Mentor.

## Features

- **Robust Authentication:** Secure user signup, login, password reset flow, strict password validation, and email verification.
- **AI Mentor:** An interactive, dedicated chat page powered by Google's Gemini AI to answer technical and career-related questions.
- **Domain Selection & Roadmaps:** Choose a tech domain to learn and unlock step-by-step interactive roadmaps and resources.
- **Resume Builder:** Construct and save professional resumes directly to your profile.
- **Portfolio Generator:** Build beautiful portfolio pages, preview them, and save them.
- **Persistent User Profiles:** Keep track of personal links (LinkedIn, GitHub), collegiate details, and parent contact information.
- **Leaderboard System:** Track learning points and compete with peers on a global leaderboard.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- HTML2PDF

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Google Generative AI (Gemini SDK)
- JWT (JSON Web Tokens) for security
- Bcryptjs for password hashing
- Nodemailer for email dispatch

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bk9887/Student_Domain_Project.git
   cd Student_Domain_Project
   ```

2. **Backend Setup**
   Ensure you have a local instance of MongoDB running. Set up your `.env` variables in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/student-domain-app
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   GEMINI_API_KEY=your_gemini_api_key
   ```
   
   Install dependencies and start the server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Contributing
Feel free to open issues or submit pull requests for new features, bug fixes, or enhancements.