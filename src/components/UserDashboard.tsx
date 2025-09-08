import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Activity, 
  Users, 
  Settings,
  Home,
  BarChart3,
  FolderOpen,
  AlertTriangle,
  FileText,
  HelpCircle,
  Search,
  X,
  Bell
} from 'lucide-react';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showNotification, setShowNotification] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { name: 'Home', icon: Home, active: false },
    { name: 'Repositories', icon: FolderOpen, active: false },
  ];

  const bottomMenuItems = [
    { name: 'Support', icon: HelpCircle },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <div 
        className={`bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-gray-900 rounded-sm"></div>
            </div>
            {!isCollapsed && (
              <div className="text-white ml-3 transition-opacity duration-300">
                <div className="text-lg font-bold tracking-tight">SECURE</div>
                <div className="text-xs text-gray-400 -mt-1">CODE</div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-gray-700 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.name === activeMenuItem;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenuItem(item.name)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-300">{item.name}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-800 p-3">
          <nav className="space-y-1">
            {bottomMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                  title={isCollapsed ? item.name : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-300">{item.name}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Notification Banner */}
        {showNotification && !isCollapsed && (
          <div className="m-3 bg-gradient-to-r from-lime-400/10 to-green-500/10 border border-lime-400/20 rounded-lg p-4 relative transition-opacity duration-300">
            <button
              onClick={() => setShowNotification(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-lime-400 text-sm font-medium mb-2">
              New security features available!
            </div>
            <p className="text-gray-300 text-xs mb-3">
              Enhanced vulnerability scanning and AI-powered threat detection are now live.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
                alt="Security update"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <div className="text-white text-xs font-medium">What's new?</div>
                <div className="text-gray-400 text-xs">Advanced AI scanning</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold text-xs">SC</span>
              </div>
              <div>
                <div className="text-white text-xs font-medium">SecureCode Team</div>
                <div className="text-gray-400 text-xs">security@securecode.com</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900/50 border-b border-gray-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={() => navigate('/')}
                className="group flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back to home</span>
              </button>

              {/* Header Actions */}
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">U</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
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
    </div>
  );
}