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
  ChevronDown,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showNotification, setShowNotification] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('MESSAGES');

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowNotificationDropdown(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure only one dropdown is open at a time
  const handleNotificationToggle = () => {
    setShowUserDropdown(false);
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const handleUserToggle = () => {
    setShowNotificationDropdown(false);
    setShowUserDropdown(!showUserDropdown);
  };

  const menuItems = [
    { name: 'Home', icon: Home, active: false },
    { name: 'Repositories', icon: FolderOpen, active: false },
  ];

  const bottomMenuItems = [
    { name: 'Support', icon: HelpCircle },
    { name: 'Settings', icon: Settings },
  ];

  const navItems = ['MESSAGES', 'PROTOCOLS', 'ANALYTICS', 'TOOLS', 'DNS'];

  // Mock data for charts
  const messagesData = [
    { value: 2200 }, { value: 2300 }, { value: 2100 }, { value: 2400 }, 
    { value: 2350 }, { value: 2450 }, { value: 2400 }, { value: 2500 }
  ];

  const protocolsData = [
    { value: 25 }, { value: 28 }, { value: 30 }, { value: 27 }, 
    { value: 32 }, { value: 30 }, { value: 29 }, { value: 30 }
  ];

  const analyticsData = [
    { value: 95 }, { value: 97 }, { value: 99 }, { value: 98 }, 
    { value: 99.5 }, { value: 99.9 }, { value: 99.8 }, { value: 99.9 }
  ];

  const securityData = [
    { value: 20 }, { value: 18 }, { value: 15 }, { value: 12 }, 
    { value: 10 }, { value: 15 }, { value: 13 }, { value: 15 }
  ];

  const errorsData = [
    { value: 12 }, { value: 10 }, { value: 8 }, { value: 6 }, 
    { value: 5 }, { value: 7 }, { value: 6 }, { value: 7 }
  ];

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
              {/* Navigation Items */}
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveNavItem(item)}
                    className={`text-sm font-medium transition-colors ${
                      activeNavItem === item
                        ? 'text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-4">
                {/* Notification Dropdown */}
                <div className="relative dropdown-container">
                  <button 
                    onClick={handleNotificationToggle}
                    className="text-zinc-400 hover:text-white transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </button>
                  
                  {showNotificationDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-zinc-900/98 border border-zinc-700/50 rounded-lg shadow-2xl backdrop-blur-md z-[60]">
                      <div className="p-4 border-b border-zinc-800/50">
                        <h3 className="text-white font-medium">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="p-4 border-b border-zinc-800/30 hover:bg-zinc-800/30 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                            <div>
                              <p className="text-white text-sm font-medium">Critical vulnerability detected</p>
                              <p className="text-zinc-400 text-xs">SQL injection in main-app repository</p>
                              <p className="text-zinc-500 text-xs mt-1">2 hours ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-b border-zinc-800/30 hover:bg-zinc-800/30 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                            <div>
                              <p className="text-white text-sm font-medium">Security scan completed</p>
                              <p className="text-zinc-400 text-xs">api-service passed all checks</p>
                              <p className="text-zinc-500 text-xs mt-1">4 hours ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-t border-zinc-800/50">
                        <button className="text-lime-400 text-sm hover:text-lime-300 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative dropdown-container">
                  <button 
                    onClick={handleUserToggle}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-zinc-300" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900/98 border border-zinc-700/50 rounded-lg shadow-2xl backdrop-blur-md z-[60]">
                      <div className="p-4 border-b border-zinc-800/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                            <span className="text-zinc-900 font-bold text-sm">JD</span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">John Doe</p>
                            <p className="text-zinc-400 text-xs">john@company.com</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <button className="w-full px-4 py-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-800/30 transition-colors flex items-center gap-3">
                          <UserIcon className="w-4 h-4" />
                          Profile Settings
                        </button>
                        <button className="w-full px-4 py-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-800/30 transition-colors flex items-center gap-3">
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </button>
                        <div className="border-t border-zinc-800/50 mt-2 pt-2">
                          <button 
                            onClick={() => navigate('/')}
                            className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-zinc-800/30 transition-colors flex items-center gap-3"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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

          {/* Analytics Row with Recharts */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            {/* Messages */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Messages (24h)</p>
                  <p className="text-white text-2xl font-bold">2,450</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={messagesData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Protocols */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Protocols</p>
                  <p className="text-white text-2xl font-bold">30</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={protocolsData}>
                    <Bar dataKey="value" fill="#6b7280" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">API Uptime</p>
                  <p className="text-white text-2xl font-bold">99.9%</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <Bar dataKey="value" fill="#6b7280" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Security Incidents */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Security Incidents (24h)</p>
                  <p className="text-white text-2xl font-bold">15</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={securityData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ef4444" 
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Errors */}
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Errors (24h)</p>
                  <p className="text-white text-2xl font-bold">7</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errorsData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ef4444" 
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
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