/**
 * RaijinGuard - Security Dashboard Application
 * 
 * Main application component that handles routing and page layout.
 * Provides GitHub repository security scanning and vulnerability detection.
 * 
 * @module App
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core Components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import CoreBenefitsSection from './components/CoreBenefitsSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

// Authentication & Dashboard Components
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import GitHubCallback from './components/GitHubCallback';

/**
 * HomePage Component
 * 
 * Renders the main landing page with all marketing sections.
 * Includes navigation, hero, benefits, features, pricing, FAQ, and footer.
 * 
 * @returns {JSX.Element} The complete homepage layout
 */
function HomePage() {
  // Active navigation state for scroll-based section highlighting
  const [activeNav, setActiveNav] = useState('SECURITY');

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col">
      {/* Navigation stays first so your hover/active logic still works */}
      <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main content area (shapes are confined here) */}
      <main className="relative flex-1 overflow-hidden">
        {/* Background geometric shapes only inside main, not under footer */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-zinc-900 opacity-30 -rotate-45 -translate-x-48 -translate-y-48" />
          <div className="absolute top-20 right-0 w-80 h-80 bg-zinc-800 opacity-20 rotate-12 translate-x-32 -translate-y-20" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-zinc-900 opacity-25 -rotate-12" />
          <div className="absolute bottom-40 right-1/3 w-48 h-48 bg-zinc-800 opacity-15 rotate-45" />
        </div>

        {/* Sections above shapes */}
        <div className="relative z-10">
          <HeroSection />
          <CoreBenefitsSection />
          <FeaturesSection />
          <PricingSection />
          <FAQSection />
        </div>
      </main>

      {/* Footer pinned to bottom; solid bg ensures no see-through */}
      <footer className="mt-auto shrink-0 bg-zinc-950">
        <Footer />
      </footer>
    </div>
  );
}

/**
 * App Component
 * 
 * Root application component with React Router configuration.
 * Manages all application routes including:
 * - Landing page (/)
 * - Authentication (/login-auth)
 * - Dashboard (/dashboard, /user-dashboard)
 * - OAuth callback (/auth/github/callback)
 * 
 * @returns {JSX.Element} The routed application
 */
function App() {
  return (
    <Router basename="/raijin-guard">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login-auth" element={<LoginPage />} />
        
        {/* Protected Routes - Dashboard */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        
        {/* OAuth Callback Route */}
        <Route path="/auth/github/callback" element={<GitHubCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
