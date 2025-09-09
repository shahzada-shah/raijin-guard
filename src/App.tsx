import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import CoreBenefitsSection from './components/CoreBenefitsSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';

function HomePage() {
  const [activeNav, setActiveNav] = useState('SECURITY');

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative min-h-screen">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-700 opacity-10 transform -rotate-45 -translate-x-48 -translate-y-48" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-gray-600 opacity-8 transform rotate-12 translate-x-32 -translate-y-20" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gray-700 opacity-10 transform -rotate-12 translate-y-32" />
        <div className="absolute bottom-40 right-1/3 w-48 h-48 bg-gray-600 opacity-8 transform rotate-45" />
      </div>

      <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />
      <HeroSection />
      <CoreBenefitsSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-auth" element={<LoginPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;