import React from 'react';
import { Shield, Zap, Users, Eye, Lock, CheckCircle } from 'lucide-react';

export default function AdvantagesSection() {
  return (
    <section id="advantages" className="relative z-10 py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-400 transition-colors">
                <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Advanced Security</h3>
                <p className="text-gray-400">Comprehensive vulnerability scanning and real-time threat detection for your repositories.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-400 transition-colors">
                <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
                <p className="text-gray-400">Instant security analysis with automated CI/CD integration and rapid deployment.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-400 transition-colors">
                <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Team Collaboration</h3>
                <p className="text-gray-400">Seamless team workflows with role-based access and collaborative security reviews.</p>
              </div>

              {/* Card 4 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-400 transition-colors">
                <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Complete Visibility</h3>
                <p className="text-gray-400">Full transparency into your security posture with detailed analytics and reporting.</p>
              </div>

              {/* Card 5 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-400 transition-colors">
                <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Enterprise Grade</h3>
                <p className="text-gray-400">Bank-level encryption and compliance with industry standards like SOC 2 and ISO 27001.</p>
              </div>

              {/* Card 6 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-400 transition-colors">
                <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Automated Fixes</h3>
                <p className="text-gray-400">Smart auto-remediation suggestions and one-click security patches for common vulnerabilities.</p>
              </div>
            </div>
          </div>

          {/* CTA Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-lime-400 to-green-500 p-8 rounded-lg text-gray-900 sticky top-8">
              <h3 className="text-2xl font-bold mb-4">Ready to secure your code?</h3>
              <p className="mb-6 opacity-90">Join thousands of developers who trust our platform to keep their repositories safe.</p>
              <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-4">
                Start Free Trial
              </button>
              <p className="text-sm opacity-75 text-center">No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}