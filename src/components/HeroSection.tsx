import React, { useState, useEffect } from 'react';

export default function HeroSection() {
  const [activeLanguage, setActiveLanguage] = useState(0); // Start with JavaScript (index 0)
  
  const languages = [
    'JAVASCRIPT', 'PYTHON', 'TYPESCRIPT', 'JAVA', 'GO', 'RUST',
    'C++', 'C#', 'PHP', 'RUBY', 'SWIFT', 'KOTLIN'
  ];

  useEffect(() => {
    let currentIndex = 0;
    
    // Start the animation cycle
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        // Move to the next language
        currentIndex = (currentIndex + 1) % languages.length;
        setActiveLanguage(currentIndex);
        
        // After the highlight duration, fade it out
        setTimeout(() => {
          setActiveLanguage(-1); // Return to default state
        }, 1500); // 1.5 seconds highlight duration
      }, 3000); // Total cycle time: 1.5s highlight + 1.5s fade out

      return () => clearInterval(interval);
    }, 1000); // Reduced initial delay

    return () => {
      clearTimeout(startDelay);
    };
  }, [languages.length]); // Include languages.length dependency

  return (
    <main id="hero" className="relative z-10 flex-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center pt-40 pb-16 min-h-screen flex flex-col justify-center">
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            SECURE YOUR GITHUB REPOS
            <br />
            WITH AI-POWERED AUDITS
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Automatically scan your repositories for security vulnerabilities, compliance issues,
            and code quality problems. Get detailed AI-generated reports and actionable insights.
          </p>

          <div className="border-t border-gray-800 pt-10">
            <div className="flex items-center justify-center mb-5">
              <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
              <p className="text-[10px] md:text-[11px] text-gray-500 uppercase tracking-[0.2em] font-semibold">
                Expert analysis for multiple programming languages
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              {/* First row - 6 languages */}
              <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-12">
                {languages.slice(0, 6).map((language, index) => (
                  <div
                    key={language}
                    className={`font-bold text-sm md:text-base tracking-wider transition-all duration-[1500ms] ease-in-out ${
                      activeLanguage === index
                        ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]'
                        : 'text-zinc-400/40'
                    }`}
                  >
                    {language}
                  </div>
                ))}
              </div>
              
              {/* Second row - 6 languages */}
              <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-12">
                {languages.slice(6, 12).map((language, index) => (
                  <div
                    key={language}
                    className={`font-bold text-sm md:text-base tracking-wider transition-all duration-[1500ms] ease-in-out ${
                      activeLanguage === index + 6
                        ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]'
                        : 'text-zinc-400/40'
                    }`}
                  >
                    {language}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}