import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

import './index.css';

import Preloader from "./components/Preloader/Preloader";
import VintageBackground from "./components/VintageBackground/VintageBackground";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Landing + Auth
import Hero from "./components/Hero/Hero";
import Trending from "./components/Trending/Trending";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import FeaturedProperties from "./components/FeaturedProperties/FeaturedProperties";
import Testimonials from "./components/Testimonials/Testimonials";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";

// Dashboard pages
import Dashboard from "./Pages/Dashboard/Dashboard";
import Marketplace from "./Pages/Marketplace/Marketplace";
import LiveStream from "./Pages/LiveStream/LiveStream";
import Projects from "./Pages/Dashboard/Projects";
import Messages from "./Pages/Dashboard/Messages";
import Profile from "./Pages/Dashboard/Profile";
import Settings from "./Pages/Dashboard/Settings";

// New components
import ProtectedRoute from "./components/ProtectedRoute";
import LiveStreamView from "./Pages/LiveStream/LiveStreamView";
import UserProfile from './Pages/UserProfile/UserProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <VintageBackground />
        <Preloader />

        <Routes>
          {/* Landing */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Hero />
                <Trending />
                <HowItWorks />
                <FeaturedProperties />
                <Testimonials />
              </MainLayout>
            }
          />

          {/* Auth */}
          <Route path="/signin" element={<MainLayout><SignIn /></MainLayout>} />
          <Route path="/signup" element={<MainLayout><SignUp /></MainLayout>} />

          {/* Public Profile */}
          <Route path="/profile/:id" element={<UserProfile />} />

          {/* Dashboard with nested routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="live" element={<LiveStream />} />
            <Route path="live/:id" element={<LiveStreamView />} />
            <Route path="projects" element={<Projects />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={
            <MainLayout>
              <div className="not-found">
                <h1>404</h1>
                <p>Page not found</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;