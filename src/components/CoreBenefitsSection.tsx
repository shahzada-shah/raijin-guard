import React from 'react';
import { Shield, Zap, CheckCircle } from 'lucide-react';

export default function CoreBenefitsSection() {
  return (
    <section id="core-benefits" className="relative z-10 py-20 bg-neutral-950 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-8 h-0.5 bg-white mr-4"></div>
            <span className="text-sm text-neutral-400 uppercase tracking-wider font-medium">Core advantages</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            MAIN BENEFITS OF SECURECODE
            <br />
            SECURITY PLATFORM
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 - Build trust */}
          <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-8 hover:bg-neutral-900/50 transition-all duration-300">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48">
                {/* Outer rings */}
                <div className="absolute inset-0 rounded-full border border-neutral-700/30"></div>
                <div className="absolute inset-4 rounded-full border border-neutral-700/40"></div>
                <div className="absolute inset-8 rounded-full border border-neutral-700/50"></div>
                <div className="absolute inset-12 rounded-full border border-neutral-700/60"></div>
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-6 h-0.5 bg-white mr-3"></div>
              <h3 className="text-xl font-semibold text-white">Build trust</h3>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Verified security assessments with API integration ensure accurate, real-time data for repositories.
            </p>
          </div>

          {/* Card 2 - Save time */}
          <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-8 hover:bg-neutral-900/50 transition-all duration-300">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48">
                {/* Outer rings */}
                <div className="absolute inset-0 rounded-full border border-neutral-700/30"></div>
                <div className="absolute inset-4 rounded-full border border-neutral-700/40"></div>
                <div className="absolute inset-8 rounded-full border border-neutral-700/50"></div>
                <div className="absolute inset-12 rounded-full border border-neutral-700/60"></div>
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-6 h-0.5 bg-white mr-3"></div>
              <h3 className="text-xl font-semibold text-white">Save time</h3>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Automated security scans with API integration ensure accurate, real-time data for development teams.
            </p>
          </div>

          {/* Card 3 - Innovative growth */}
          <div className="bg-neutral-900/50 border border-neutral-700/70 rounded-2xl p-8 hover:bg-neutral-900/70 transition-all duration-300">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48">
                {/* Outer rings - more prominent for highlighted card */}
                <div className="absolute inset-0 rounded-full border border-neutral-600/40"></div>
                <div className="absolute inset-4 rounded-full border border-neutral-600/50"></div>
                <div className="absolute inset-8 rounded-full border border-neutral-600/60"></div>
                <div className="absolute inset-12 rounded-full border border-neutral-600/70"></div>
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-6 h-0.5 bg-white mr-3"></div>
              <h3 className="text-xl font-semibold text-white">Innovative growth</h3>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Advanced compliance monitoring with API integration ensure accurate, real-time data for enterprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}