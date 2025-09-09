import React from 'react';
import { Check } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            PRICING
          </h2>
          <p className="text-neutral-400 max-w-3xl mx-auto text-lg">
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Use SecureCode for free with your whole team. Upgrade to enable unlimited security 
            scans, enhanced repository monitoring, and additional features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
              <div className="text-4xl font-bold text-white mb-4">$0</div>
              <p className="text-gray-300 mb-8">Free for everyone</p>
            </div>

            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-200">Security dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-200">Up to 2 repository scans</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-200">Manual vulnerability reports</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-200">Basic compliance checks</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-200">Basic security profile</span>
              </div>
            </div>

            <button className="w-full bg-gray-700/60 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors duration-200">
              START NOW
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gray-800/60 rounded-2xl p-8 border border-gray-600/50 relative backdrop-blur-sm">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-white">$8</span>
                <span className="text-gray-300">/ per month</span>
                <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded uppercase">-20%</span>
              </div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-gray-300">Billed yearly</span>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <div className="text-gray-200 mb-4">All free plan features and ...</div>
              <div className="text-gray-200">Unlimited repository scans</div>
              <div className="text-gray-200">Advanced security monitoring</div>
              <div className="text-gray-200">Advanced compliance reports</div>
              <div className="text-gray-200">Verify data and premium integrations</div>
              <div className="text-gray-200">Display in security leaderboard</div>
              <div className="text-gray-200">Unlimited data storage</div>
              <div className="text-gray-200">Import & Export security data</div>
              <div className="text-gray-200">Manual update of security profiles</div>
            </div>

            <button className="w-full bg-white hover:bg-gray-100 text-black py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors duration-200">
              START NOW
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <span className="w-4 h-4 border border-gray-500 rounded flex items-center justify-center">
              <span className="text-xs">ℹ</span>
            </span>
            Prices are displayed in USD and are subject to change in the future.
          </p>
        </div>
      </div>
    </section>
  );
}