/**
 * RaijinGuard - Navigation Component
 * 
 * Main navigation bar with smooth scroll-based section highlighting.
 * Features sticky positioning, backdrop blur effects, and responsive design.
 * 
 * Key Features:
 * - Automatic section highlighting based on scroll position
 * - Smooth scroll navigation
 * - Glass morphism effect on scroll
 * - Mobile responsive menu
 * 
 * @module Navigation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Navigation Item Interface
 * Defines the structure of navigation menu items
 */
interface NavItem {
  name: string;
  href: string;
  active?: boolean;
}

/**
 * Navigation Component Props
 */
interface NavigationProps {
  /** Currently active navigation section */
  activeNav: string;
  /** Function to update the active navigation section */
  setActiveNav: (nav: string) => void;
}

/**
 * Navigation Component
 * 
 * Provides site-wide navigation with smooth scrolling and active section tracking.
 * Uses IntersectionObserver for efficient scroll detection.
 * 
 * @param {NavigationProps} props - Component props
 * @returns {JSX.Element} Rendered navigation bar
 */
export default function Navigation({ activeNav, setActiveNav }: NavigationProps) {
  // Scroll state for background blur effect
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  /**
   * Scroll Effect Hook
   * 
   * Tracks scroll position and updates:
   * - Background blur state
   * - Active navigation section based on viewport position
   * 
   * Uses requestAnimationFrame for optimized performance
   */
  useEffect(() => {
    let rafId: number;
    let lastSection = 'SECURITY';

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 20);

        // Auto-update active nav based on scroll position
        const sections = [
          { id: 'hero', name: 'SECURITY' },
          { id: 'core-benefits', name: 'ADVANTAGES' },
          { id: 'features', name: 'FEATURES' },
          { id: 'pricing', name: 'PRICING' },
          { id: 'faq', name: 'FAQ' }
        ];

        let currentSection = 'SECURITY';

        // Find which section is currently in view
        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Check if section is in the middle of viewport
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
              currentSection = section.name;
            }
          }
        }

        // Only update if section actually changed (prevents unnecessary re-renders)
        if (currentSection !== lastSection) {
          lastSection = currentSection;
          setActiveNav(currentSection);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [setActiveNav]);

  /**
   * Navigation items configuration
   */
  const navItems: NavItem[] = [
    { name: 'SECURITY', href: '#security' },
    { name: 'ADVANTAGES', href: '#advantages' },
    { name: 'FEATURES', href: '#features' },
    { name: 'PRICING', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  /**
   * Handles navigation item click
   * Smoothly scrolls to the target section
   * 
   * @param item - The navigation item clicked
   */
  const handleNavClick = (item: NavItem) => {
    setActiveNav(item.name);
    
    if (item.name === 'ADVANTAGES') {
      const coreBenefitsSection = document.getElementById('core-benefits');
      if (coreBenefitsSection) {
        coreBenefitsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    } else if (item.name === 'FEATURES') {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    } else if (item.name === 'PRICING') {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    } else if (item.name === 'FAQ') {
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        faqSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    } else if (item.name === 'SECURITY') {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth',
        left: 0
      });
    }
  };

  /**
   * Handles login button click
   * Navigates to the login page
   */
  const handleLoginClick = () => {
    navigate('/login-auth');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? 'bg-zinc-950/98 backdrop-blur-lg shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-white">
            <div className="text-xl font-bold tracking-tight">RAIJIN</div>
            <div className="text-xs text-gray-400 -mt-1">GUARD</div>
          </div>

          {/* Nav items — thin labels, glow + short divider when active */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = activeNav === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item);
                    }}
                    className={[
                      'relative uppercase tracking-wide',
                      'text-xs md:text-sm font-light',
                      'px-1 py-2 transition-all duration-300 ease-out',
                      isActive
                        ? [
                            'text-white',
                            'drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]',
                            "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                            'after:-bottom-2 after:h-[2px] after:w-4 after:rounded-sm after:bg-white',
                            'after:shadow-[0_0_10px_rgba(255,255,255,0.6)]',
                          ].join(' ')
                        : 'text-gray-400/70 hover:text-white',
                    ].join(' ')}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Header actions — simplified */}
          <div className="hidden md:flex items-center gap-4">
            {/* outline pill (Login style) */}
            <button
              onClick={handleLoginClick}
              className="rounded-full px-5 py-2 uppercase text-[11px] font-semibold tracking-widest
                         border border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 ease-out"
            >
              Login
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu w/ simplified actions */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item);
              }}
              className={`block px-3 py-2 text-base font-light uppercase ${
                activeNav === item.name
                  ? 'text-white bg-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              {item.name}
            </a>
          ))}

          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-3 flex items-center justify-center">
              <button onClick={handleLoginClick} className="w-full rounded-full px-5 py-2 uppercase text-[11px] font-semibold tracking-widest border border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 ease-out">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}