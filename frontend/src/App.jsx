import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";
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
import ResumeBuilder from "./pages/ResumeBuilder";
import PortfolioGenerator from "./pages/PortfolioGenerator";
import Chat from "./pages/Chat";
import MyJourney from "./pages/MyJourney";

// Admin Imports
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ManageStudents from "./admin/ManageStudents";
import ManageDomains from "./admin/ManageDomains";
import ManageRoadmaps from "./admin/ManageRoadmaps";
import ManageFeedback from "./admin/ManageFeedback";
import AdminSettings from "./admin/AdminSettings";

function App() {
  const [appConfig, setAppConfig] = useState(null);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/config`);
      setAppConfig(res.data);
    } catch (err) {
      console.error("Boot Config Error:", err);
    }
  };

  useEffect(() => {
    fetchConfig();
    window.addEventListener("configUpdated", fetchConfig);
    return () => window.removeEventListener("configUpdated", fetchConfig);
  }, []);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Enforce Maintenance mode for non-admins
  if (appConfig?.maintenanceMode && user && !user.isAdmin) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-4xl">
          🚧
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Under Maintenance</h1>
        <p className="text-zinc-400 max-w-md">
          Student Hub is currently undergoing scheduled maintenance and upgrades. We'll be back online shortly!
        </p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:id/:token" element={<VerifyEmail />} />

      {/* Admin CMS (Nested Routes using AdminLayout as base wrapper) */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="manage-students" element={<ManageStudents />} />
        <Route path="manage-domains" element={<ManageDomains />} />
        <Route path="manage-roadmaps" element={<ManageRoadmaps />} />
        <Route path="manage-feedback" element={<ManageFeedback />} />
        <Route path="global-config" element={<AdminSettings />} />
      </Route>

      {/* Protected Routes with Layout */}
      <Route
        path="/domains"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <DomainSelection />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <Leaderboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <Roadmap />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <ResumeBuilder />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <PortfolioGenerator />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <Contact />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <AboutUs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <HelpCenter />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <Chat />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/journey"
        element={
          <ProtectedRoute>
            <Layout appConfig={appConfig}>
              <MyJourney />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;