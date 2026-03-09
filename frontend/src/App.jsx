import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import DomainSelection from "./pages/DomainSelection";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Leaderboard from "./pages/Leaderboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import VerifyEmail from "./pages/VerifyEmail";



function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/domains"
        element={
          <ProtectedRoute>
            <Layout>
              <DomainSelection />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Leaderboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <Layout>
              <Roadmap />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
              <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
              <Contact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
              <AboutUs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
              <HelpCenter />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;