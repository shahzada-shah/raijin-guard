import React from 'react';
import { Check, Lock } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 py-20 bg-zinc-950 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-white rounded-full mr-4 animate-pulse"></div>
            <span className="text-sm text-zinc-400 uppercase tracking-wider font-medium">Pricing plans</span>
          </div>
          <h2 className="text-[40px] md:text-[56px] lg:text-[64px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            PRICING
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Begin with comprehensive security monitoring at no cost. Scale to enterprise-grade
            protection with advanced threat detection and automated compliance reporting.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-zinc-900/40 rounded-2xl p-8 border border-zinc-800/30 backdrop-blur-sm hover:border-white/60 hover:scale-105 transition-all duration-300 ease-out group">
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-white mb-4 tracking-tight group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">Free</h3>
              <div className="text-4xl font-extrabold text-white mb-4 tracking-tight group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">$0</div>
              <p className="text-gray-300 mb-8 text-sm">Free for everyone</p>
            </div>

            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-white flex-shrink-0 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300 ease-out">Security dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-white flex-shrink-0 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300 ease-out">Up to 2 repository scans</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-white flex-shrink-0 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300 ease-out">Manual vulnerability reports</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-white flex-shrink-0 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300 ease-out">Basic compliance checks</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-white flex-shrink-0 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300 ease-out">Basic security profile</span>
              </div>
            </div>

            <button onClick={(e) => e.preventDefault()} className="w-full border border-white text-white hover:bg-white hover:text-gray-900 py-4 px-6 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300 ease-out">
              START NOW
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-zinc-900/60 rounded-2xl p-8 border border-zinc-700/50 relative backdrop-blur-sm opacity-60">
            {/* Coming Soon Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-zinc-800 border border-zinc-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Coming Soon
              </div>
            </div>
            
            {/* Lock Icon */}
            <div className="absolute top-4 right-4">
              <Lock className="w-5 h-5 text-zinc-500" />
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-white mb-4 tracking-tight">Premium</h3>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-extrabold text-white tracking-tight">$8</span>
                <span className="text-gray-300 text-sm">/ per month</span>
                <span className="bg-white text-zinc-900 text-xs font-semibold px-2 py-1 rounded uppercase">-20%</span>
              </div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-sm">Billed yearly</span>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <div className="text-gray-300 mb-4 text-sm">All free plan features and ...</div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 text-sm">Unlimited repository scans</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 text-sm">Advanced security monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 text-sm">Advanced compliance reports</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 text-sm">Verify data and premium integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 text-sm">Display in security leaderboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 text-sm">Unlimited data storage</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 text-sm">Import & Export security data</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 text-sm">Manual update of security profiles</span>
              </div>
            </div>

            <button className="w-full bg-zinc-700 text-zinc-400 py-4 px-6 rounded-full font-semibold text-sm uppercase tracking-widest cursor-not-allowed">
              COMING SOON
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}