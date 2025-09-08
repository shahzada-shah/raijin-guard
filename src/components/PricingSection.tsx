import React from 'react';
import { Check } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 py-20 bg-gray-950 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            PRICING
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Use SecureCode for free with your whole team. Upgrade to enable unlimited security 
            scans, enhanced repository monitoring, and additional features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-900/30 border border-gray-800/50 rounded-2xl p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-3xl font-bold text-white mb-2">$0</div>
              <p className="text-gray-400">Free for everyone</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-gray-500" />
                <span className="text-gray-300">Security dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-gray-500" />
                <span className="text-gray-300">Up to 2 repository scans</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-gray-500" />
                <span className="text-gray-300">Manual vulnerability reports</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-gray-500" />
                <span className="text-gray-300">Basic compliance checks</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-gray-500" />
                <span className="text-gray-300">Basic security profile</span>
              </div>
            </div>

            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
              START NOW
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gray-800/50 border border-gray-700/70 rounded-2xl p-8 relative">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-bold text-white">$8</span>
                <span className="text-gray-400">/ per month</span>
                <span className="bg-lime-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">-20%</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                <span className="text-gray-400">Billed yearly</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-gray-300">All free plan features and ...</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Unlimited repository scans</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Advanced security monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Advanced compliance reports</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Verify data and premium integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Display in security leaderboard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Unlimited data storage</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Import & Export security data</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Manual update of security profiles</span>
              </div>
            </div>

            <button className="w-full bg-lime-400 hover:bg-lime-300 text-gray-900 py-3 px-6 rounded-lg font-bold transition-colors duration-200">
              START NOW
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Prices are displayed in USD and are subject to change in the future.
          </p>
        </div>
      </div>
    </section>
  );
}