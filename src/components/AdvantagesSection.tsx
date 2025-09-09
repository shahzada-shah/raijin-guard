import React from 'react';
import { Shield, Zap, Users, Eye, Lock, CheckCircle } from 'lucide-react';

export default function AdvantagesSection() {
  return (
    <section id="advantages" className="relative z-10 py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/30 hover:border-white transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Advanced Security</h3>
                <p className="text-gray-300 text-sm">Comprehensive vulnerability scanning and real-time threat detection for your repositories.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/30 hover:border-white transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Lightning Fast</h3>
                <p className="text-gray-300 text-sm">Instant security analysis with automated CI/CD integration and rapid deployment.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/30 hover:border-white transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Team Collaboration</h3>
                <p className="text-gray-300 text-sm">Seamless team workflows with role-based access and collaborative security reviews.</p>
              </div>

              {/* Card 4 */}
              <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/30 hover:border-white transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Complete Visibility</h3>
                <p className="text-gray-300 text-sm">Full transparency into your security posture with detailed analytics and reporting.</p>
              </div>

              {/* Card 5 */}
              <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/30 hover:border-white transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Enterprise Grade</h3>
                <p className="text-gray-300 text-sm">Bank-level encryption and compliance with industry standards like SOC 2 and ISO 27001.</p>
              </div>

              {/* Card 6 */}
              <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/30 hover:border-white transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Automated Fixes</h3>
                <p className="text-gray-300 text-sm">Smart auto-remediation suggestions and one-click security patches for common vulnerabilities.</p>
              </div>
            </div>
          </div>

          {/* CTA Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/60 p-8 rounded-lg border border-zinc-800/50 text-white sticky top-8">
              <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Ready to secure your code?</h3>
              <p className="mb-6 text-gray-300 text-sm">Join thousands of developers who trust our platform to keep their repositories safe.</p>
              <button className="w-full border border-white text-white hover:bg-white hover:text-zinc-900 py-3 px-6 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300 ease-out mb-4">
                Start Free Trial
              </button>
              <p className="text-xs text-gray-400 text-center">No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}