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
  Bell,
  TrendingUp,
  TrendingDown
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

  // Mock chart data points for mini charts
  const generateMiniChart = (trend: 'up' | 'down' | 'stable') => {
    const basePoints = [20, 25, 22, 28, 24, 30, 26, 32, 28, 35];
    if (trend === 'up') return basePoints.map((p, i) => p + i * 2);
    if (trend === 'down') return basePoints.map((p, i) => p - i * 1.5);
    return basePoints;
  };

  const MiniChart = ({ points, color = '#10b981' }: { points: number[], color?: string }) => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    const pathData = points
      .map((point, index) => {
        const x = (index / (points.length - 1)) * 60;
        const y = 20 - ((point - min) / range) * 15;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg width="60" height="20" className="opacity-80">
        <path
          d={pathData}
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div 
        className={`bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-sm ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-zinc-800/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-zinc-900 rounded-sm"></div>
            </div>
            {!isCollapsed && (
              <div className="text-white ml-3 transition-opacity duration-300">
                <div className="text-lg font-bold tracking-tight">SECURE</div>
                <div className="text-xs text-zinc-400 -mt-1">CODE</div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4 border-b border-zinc-800/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-zinc-800/50 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-zinc-700/50 transition-colors backdrop-blur-sm"
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
                      ? 'bg-zinc-800/50 text-white backdrop-blur-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
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
        <div className="border-t border-zinc-800/50 p-3">
          <nav className="space-y-1">
            {bottomMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 rounded-lg transition-colors"
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
          <div className="m-3 bg-gradient-to-r from-lime-400/10 to-green-500/10 border border-lime-400/20 rounded-lg p-4 relative transition-opacity duration-300 backdrop-blur-sm">
            <button
              onClick={() => setShowNotification(false)}
              className="absolute top-2 right-2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-lime-400 text-sm font-medium mb-2">
              New security features available!
            </div>
            <p className="text-zinc-300 text-xs mb-3">
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
                <div className="text-zinc-400 text-xs">Advanced AI scanning</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center">
                <span className="text-zinc-900 font-bold text-xs">SC</span>
              </div>
              <div>
                <div className="text-white text-xs font-medium">SecureCode Team</div>
                <div className="text-zinc-400 text-xs">security@securecode.com</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-zinc-900/30 border-b border-zinc-800/50 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={() => navigate('/')}
                className="group flex items-center text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back to home</span>
              </button>

              {/* Header Actions */}
              <div className="flex items-center gap-4">
                <button className="text-zinc-400 hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                  <span className="text-zinc-900 font-bold text-sm">U</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
            <p className="text-zinc-400">Monitor your repository security and manage your projects.</p>
          </div>

          {/* Analytics Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Messages Card */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Messages (24h)</p>
                  <p className="text-white text-2xl font-bold">2,450</p>
                </div>
                <MiniChart points={generateMiniChart('up')} color="#10b981" />
              </div>
            </div>

            {/* Total ROI Card */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Total ROI</p>
                  <p className="text-white text-2xl font-bold">30</p>
                </div>
                <MiniChart points={generateMiniChart('stable')} color="#6b7280" />
              </div>
            </div>

            {/* API Usage Card */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">API Usage</p>
                  <p className="text-white text-2xl font-bold">99.9%</p>
                </div>
                <MiniChart points={generateMiniChart('up')} color="#10b981" />
              </div>
            </div>

            {/* Security Incidents Card */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Security Incidents (24h)</p>
                  <p className="text-white text-2xl font-bold">15</p>
                </div>
                <MiniChart points={generateMiniChart('down')} color="#ef4444" />
              </div>
            </div>

            {/* Errors Card */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Errors (24h)</p>
                  <p className="text-white text-2xl font-bold">7</p>
                </div>
                <MiniChart points={generateMiniChart('down')} color="#ef4444" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">Recent Security Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-zinc-800/30 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Critical vulnerability detected in main-app</p>
                    <p className="text-zinc-400 text-sm">SQL injection vulnerability in user authentication</p>
                  </div>
                </div>
                <span className="text-zinc-400 text-sm">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-zinc-800/30 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Security scan completed for api-service</p>
                    <p className="text-zinc-400 text-sm">No critical issues found, 2 minor warnings</p>
                  </div>
                </div>
                <span className="text-zinc-400 text-sm">4 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-zinc-800/30 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">New team member added</p>
                    <p className="text-zinc-400 text-sm">Sarah Johnson joined the security team</p>
                  </div>
                </div>
                <span className="text-zinc-400 text-sm">1 day ago</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}