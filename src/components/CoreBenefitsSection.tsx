import React from 'react';
import { Shield, Zap, TrendingUp } from 'lucide-react';

export default function CoreBenefitsSection() {
  return (
    <section id="core-benefits" className="relative z-10 py-20 bg-zinc-950 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-2 h-2 bg-white rounded-full mr-4 animate-pulse"></div>
            <span className="text-sm text-zinc-400 uppercase tracking-wider font-medium">Core advantages</span>
          </div>
          <h2 className="text-[40px] md:text-[56px] lg:text-[64px] font-extrabold text-white leading-[1.1] tracking-tight">
            MAIN BENEFITS OF SECURECODE
            <br />
            SECURITY PLATFORM
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 - Build trust */}
          <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-2xl p-8 hover:border-white/60 hover:scale-105 transition-all duration-300 ease-out group">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48">
                {/* Outer rings */}
                <div className="absolute inset-0 rounded-full border border-zinc-700/30"></div>
                <div className="absolute inset-4 rounded-full border border-zinc-700/40"></div>
                <div className="absolute inset-8 rounded-full border border-zinc-700/50"></div>
                <div className="absolute inset-12 rounded-full border border-zinc-700/60"></div>
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 ease-out">
                    <Shield className="w-6 h-6 text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ease-out" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Build trust</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Verified security assessments with API integration ensure accurate, real-time data for repositories.
            </p>
          </div>

          {/* Card 2 - Save time */}
          <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-2xl p-8 hover:border-white/60 hover:scale-105 transition-all duration-300 ease-out group">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48">
                {/* Outer rings */}
                <div className="absolute inset-0 rounded-full border border-zinc-700/30"></div>
                <div className="absolute inset-4 rounded-full border border-zinc-700/40"></div>
                <div className="absolute inset-8 rounded-full border border-zinc-700/50"></div>
                <div className="absolute inset-12 rounded-full border border-zinc-700/60"></div>
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 ease-out">
                    <Zap className="w-6 h-6 text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ease-out" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Save time</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Automated security scans with API integration ensure accurate, real-time data for development teams.
            </p>
          </div>

          {/* Card 3 - Innovative growth */}
          <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-2xl p-8 hover:border-white/60 hover:scale-105 transition-all duration-300 ease-out group">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48">
                {/* Outer rings - more prominent for highlighted card */}
                <div className="absolute inset-0 rounded-full border border-zinc-600/40"></div>
                <div className="absolute inset-4 rounded-full border border-zinc-600/50"></div>
                <div className="absolute inset-8 rounded-full border border-zinc-600/60"></div>
                <div className="absolute inset-12 rounded-full border border-zinc-600/70"></div>
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 ease-out">
                    <TrendingUp className="w-6 h-6 text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ease-out" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Innovative growth</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Advanced compliance monitoring with API integration ensure accurate, real-time data for enterprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}