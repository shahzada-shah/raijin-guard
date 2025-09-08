import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import CoreBenefitsSection from './components/CoreBenefitsSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

function App() {
  const [activeNav, setActiveNav] = useState('SECURITY');

  return (
    <div className="bg-gray-950 relative">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-900 opacity-30 transform -rotate-45 -translate-x-48 -translate-y-48" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-gray-800 opacity-20 transform rotate-12 translate-x-32 -translate-y-20" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gray-900 opacity-25 transform -rotate-12 translate-y-32" />
        <div className="absolute bottom-40 right-1/3 w-48 h-48 bg-gray-800 opacity-15 transform rotate-45" />
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

export default App;