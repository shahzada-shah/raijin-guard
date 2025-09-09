import React from 'react';

export default function HeroSection() {
  return (
    <main className="relative z-10 flex-1">
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

          <div className="border-t border-neutral-800 pt-10">
            <div className="flex items-center justify-center mb-5">
              <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
              <p className="text-[10px] md:text-[11px] text-neutral-500 uppercase tracking-[0.2em] font-semibold">
                Expert analysis for multiple programming languages
              </p>
            </div>
            <div className="flex items-center justify-center gap-8 md:gap-12 opacity-40">
              <div className="text-neutral-400 font-bold text-sm md:text-base tracking-wider">JAVASCRIPT</div>
              <div className="text-neutral-400 font-bold text-sm md:text-base tracking-wider">PYTHON</div>
              <div className="text-neutral-400 font-bold text-sm md:text-base tracking-wider">TYPESCRIPT</div>
              <div className="text-neutral-400 font-bold text-sm md:text-base tracking-wider">JAVA</div>
              <div className="text-neutral-400 font-bold text-sm md:text-base tracking-wider">GO</div>
              <div className="text-neutral-400 font-bold text-sm md:text-base tracking-wider">RUST</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}