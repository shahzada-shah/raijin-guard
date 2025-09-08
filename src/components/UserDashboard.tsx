import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Activity, Users, Settings } from 'lucide-react';

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="group flex items-center text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to home</span>
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-gray-900 rounded-sm"></div>
              </div>
              <div className="text-white">
                <div className="text-xl font-bold tracking-tight">SECURE</div>
                <div className="text-xs text-gray-400 -mt-1">CODE</div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold text-sm">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to your Dashboard</h1>
          <p className="text-gray-400">Monitor your repository security and manage your projects.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-lime-400" />
              <span className="text-2xl font-bold text-white">12</span>
            </div>
            <h3 className="text-white font-medium mb-1">Repositories Scanned</h3>
            <p className="text-gray-400 text-sm">Active security monitoring</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-white font-medium mb-1">Critical Issues</h3>
            <p className="text-gray-400 text-sm">Require immediate attention</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">8</span>
            </div>
            <h3 className="text-white font-medium mb-1">Team Members</h3>
            <p className="text-gray-400 text-sm">Collaborating on security</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">94%</span>
            </div>
            <h3 className="text-white font-medium mb-1">Security Score</h3>
            <p className="text-gray-400 text-sm">Overall repository health</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Security Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Critical vulnerability detected in main-app</p>
                  <p className="text-gray-400 text-sm">SQL injection vulnerability in user authentication</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Security scan completed for api-service</p>
                  <p className="text-gray-400 text-sm">No critical issues found, 2 minor warnings</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">4 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">New team member added</p>
                  <p className="text-gray-400 text-sm">Sarah Johnson joined the security team</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">1 day ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}