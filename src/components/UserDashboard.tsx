import React, { useState, useEffect } from 'react';
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
  ChevronUp,
  LogOut,
  User as UserIcon,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRecentScans, setShowRecentScans] = useState(true);

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

  // Repository data
  const repositories = [
    { 
      status: 'Critical', 
      repo: 'main-app', 
      language: 'JavaScript', 
      risk: '10.2%', 
      lastScan: '2 hours ago', 
      vulnerabilities: 15, 
      branch: 'main', 
      color: 'red',
      description: 'Primary application with user authentication and core business logic',
      uptime: '99.8%',
      messages: '1430729',
      incidents: '3',
      securityScore: 'High (85/100)',
      activeAlerts: 5,
      successRate: '96.7%'
    },
    { 
      status: 'Critical', 
      repo: 'auth-service', 
      language: 'TypeScript', 
      risk: '11.7%', 
      lastScan: '4 hours ago', 
      vulnerabilities: 12, 
      branch: 'develop', 
      color: 'red',
      description: 'Authentication and authorization microservice',
      uptime: '99.9%',
      messages: '892456',
      incidents: '2',
      securityScore: 'High (82/100)',
      activeAlerts: 3,
      successRate: '98.1%'
    },
    { 
      status: 'Warning', 
      repo: 'api-gateway', 
      language: 'Python', 
      risk: '7.9%', 
      lastScan: '1 day ago', 
      vulnerabilities: 8, 
      branch: 'main', 
      color: 'yellow',
      description: 'API gateway handling external requests and routing',
      uptime: '99.5%',
      messages: '2156789',
      incidents: '1',
      securityScore: 'Medium (65/100)',
      activeAlerts: 2,
      successRate: '97.3%'
    },
    { 
      status: 'Warning', 
      repo: 'user-dashboard', 
      language: 'React', 
      risk: '6.1%', 
      lastScan: '2 days ago', 
      vulnerabilities: 5, 
      branch: 'feature/ui', 
      color: 'yellow',
      description: 'User interface dashboard for customer management',
      uptime: '99.7%',
      messages: '567234',
      incidents: '0',
      securityScore: 'Medium (72/100)',
      activeAlerts: 1,
      successRate: '99.1%'
    },
    { 
      status: 'Warning', 
      repo: 'payment-processor', 
      language: 'Java', 
      risk: '8.4%', 
      lastScan: '3 days ago', 
      vulnerabilities: 7, 
      branch: 'main', 
      color: 'yellow',
      description: 'Payment processing and transaction handling service',
      uptime: '99.9%',
      messages: '1234567',
      incidents: '1',
      securityScore: 'Medium (68/100)',
      activeAlerts: 4,
      successRate: '99.8%'
    },
    { 
      status: 'Healthy', 
      repo: 'notification-service', 
      language: 'Go', 
      risk: '2.1%', 
      lastScan: '1 hour ago', 
      vulnerabilities: 2, 
      branch: 'main', 
      color: 'green',
      description: 'Email and push notification delivery service',
      uptime: '99.9%',
      messages: '345678',
      incidents: '0',
      securityScore: 'Low (25/100)',
      activeAlerts: 0,
      successRate: '99.9%'
    },
    { 
      status: 'Healthy', 
      repo: 'file-storage', 
      language: 'Rust', 
      risk: '1.8%', 
      lastScan: '3 hours ago', 
      vulnerabilities: 1, 
      branch: 'main', 
      color: 'green',
      description: 'Secure file storage and retrieval system',
      uptime: '100%',
      messages: '123456',
      incidents: '0',
      securityScore: 'Low (18/100)',
      activeAlerts: 0,
      successRate: '100%'
    },
    { 
      status: 'Healthy', 
      repo: 'analytics-engine', 
      language: 'Python', 
      risk: '3.2%', 
      lastScan: '5 hours ago', 
      vulnerabilities: 3, 
      branch: 'develop', 
      color: 'green',
      description: 'Data analytics and reporting engine',
      uptime: '99.8%',
      messages: '789012',
      incidents: '0',
      securityScore: 'Low (32/100)',
      activeAlerts: 0,
      successRate: '98.7%'
    },
    { 
      status: 'Healthy', 
      repo: 'cache-layer', 
      language: 'Redis', 
      risk: '1.5%', 
      lastScan: '6 hours ago', 
      vulnerabilities: 1, 
      branch: 'main', 
      color: 'green',
      description: 'Redis-based caching layer for improved performance',
      uptime: '99.9%',
      messages: '456789',
      incidents: '0',
      securityScore: 'Low (15/100)',
      activeAlerts: 0,
      successRate: '99.5%'
    },
    { 
      status: 'Offline', 
      repo: 'legacy-system', 
      language: 'PHP', 
      risk: '99.9%', 
      lastScan: '2 weeks ago', 
      vulnerabilities: 45, 
      branch: 'master', 
      color: 'gray',
      description: 'Legacy PHP system scheduled for decommission',
      uptime: '0%',
      messages: '0',
      incidents: '12',
      securityScore: 'Critical (99/100)',
      activeAlerts: 15,
      successRate: '0%'
    },
    { 
      status: 'Offline', 
      repo: 'old-frontend', 
      language: 'jQuery', 
      risk: '95.2%', 
      lastScan: '1 month ago', 
      vulnerabilities: 38, 
      branch: 'master', 
      color: 'gray',
      description: 'Deprecated jQuery-based frontend application',
      uptime: '0%',
      messages: '0',
      incidents: '8',
      securityScore: 'Critical (95/100)',
      activeAlerts: 12,
      successRate: '0%'
    },
    { 
      status: 'Offline', 
      repo: 'deprecated-api', 
      language: 'PHP', 
      risk: '87.6%', 
      lastScan: '3 weeks ago', 
      vulnerabilities: 29, 
      branch: 'main', 
      color: 'gray',
      description: 'Deprecated API endpoints no longer in use',
      uptime: '0%',
      messages: '0',
      incidents: '5',
      securityScore: 'High (87/100)',
      activeAlerts: 8,
      successRate: '0%'
    },
  ];

  // Filter repositories based on search term
  const filteredRepositories = repositories.filter(repo =>
    repo.repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Recent scans data
  const recentScans = [
    { repo: 'main-app', status: 'Critical', time: '2 hours ago', type: 'Scheduled' },
    { repo: 'notification-service', status: 'Healthy', time: '1 hour ago', type: 'Manual' },
    { repo: 'auth-service', status: 'Critical', time: '4 hours ago', type: 'Triggered' },
    { repo: 'file-storage', status: 'Healthy', time: '3 hours ago', type: 'Scheduled' },
    { repo: 'analytics-engine', status: 'Healthy', time: '5 hours ago', type: 'Manual' },
  ];

  const handleRowClick = (repo: any) => {
    setSelectedRepo(repo);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedRepo(null);
  };
  return (
    <div className="min-h-screen bg-zinc-950 flex relative">
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-sm z-40 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-zinc-800/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
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
                className="w-full bg-zinc-800/50 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-zinc-700/50 transition-colors backdrop-blur-sm"
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
          <div className="m-3 bg-gradient-to-r from-white/10 to-zinc-300/10 border border-white/20 rounded-lg p-4 relative transition-opacity duration-300 backdrop-blur-sm">
            <button
              onClick={() => setShowNotification(false)}
              className="absolute top-2 right-2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-white text-sm font-medium mb-2">
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
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
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
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 bg-zinc-900/30 border-b border-zinc-800/50 backdrop-blur-sm z-30" style={{ left: isCollapsed ? '64px' : '256px' }}>
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
                        <button className="text-white text-sm hover:text-zinc-300 transition-colors">
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
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
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
        <main className="flex-1 p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 pt-24">
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
                      stroke="#ffffff" 
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

          {/* Recent Scans Section */}
          <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-zinc-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-zinc-400" />
                  <h2 className="text-xl font-bold text-white">Recent Scans</h2>
                </div>
                <button
                  onClick={() => setShowRecentScans(!showRecentScans)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {showRecentScans ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {showRecentScans && (
              <div className="p-6">
                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-zinc-800/20 rounded-lg hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          scan.status === 'Critical' ? 'bg-red-400' :
                          scan.status === 'Warning' ? 'bg-yellow-400' :
                          scan.status === 'Healthy' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <div className="text-white font-medium">{scan.repo}</div>
                          <div className="text-zinc-400 text-sm">{scan.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${
                          scan.status === 'Critical' ? 'text-red-400' :
                          scan.status === 'Warning' ? 'text-yellow-400' :
                          scan.status === 'Healthy' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {scan.status}
                        </span>
                        <span className="text-zinc-500 text-sm">{scan.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Repository Security Table */}
          <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-zinc-800/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Repository Security Status</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by repository name or address"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-zinc-800/50 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-zinc-700/50 transition-colors backdrop-blur-sm w-80"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800/30">
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Repository</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Language</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Risk Score</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Last Scan</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Vulnerabilities</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Branch</th>
                    <th className="text-right py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRepositories.map((repo, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-zinc-800/20 hover:bg-zinc-800/20 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(repo)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            repo.color === 'red' ? 'bg-red-400' :
                            repo.color === 'yellow' ? 'bg-yellow-400' :
                            repo.color === 'green' ? 'bg-green-400' : 'bg-gray-400'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            repo.color === 'red' ? 'text-red-400' :
                            repo.color === 'yellow' ? 'text-yellow-400' :
                            repo.color === 'green' ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {repo.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">{repo.repo}</div>
                        <div className="text-zinc-400 text-sm">github.com/company/{repo.repo}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-zinc-300 text-sm">{repo.language}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${
                          parseFloat(repo.risk) > 50 ? 'text-red-400' :
                          parseFloat(repo.risk) > 5 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {repo.risk}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-zinc-400 text-sm">{repo.lastScan}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${
                          repo.vulnerabilities > 10 ? 'text-red-400' :
                          repo.vulnerabilities > 5 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {repo.vulnerabilities}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-zinc-400 text-sm font-mono">{repo.branch}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="bg-white hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Scan Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-zinc-800/30 bg-zinc-900/20">
              <p className="text-zinc-500 text-sm text-center">
                The platform found <span className="text-white font-medium">{filteredRepositories.reduce((sum, repo) => sum + repo.vulnerabilities, 0)} DVN</span> for your request
              </p>
            </div>
          </div>

          {/* Repository Details Drawer */}
          {showDrawer && selectedRepo && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDrawer}></div>
              <div className="absolute right-0 top-0 h-full w-[600px] bg-zinc-900/95 border-l border-zinc-800/50 backdrop-blur-md overflow-y-auto">
                {/* Header */}
                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedRepo.color === 'red' ? 'bg-red-400' :
                        selectedRepo.color === 'yellow' ? 'bg-yellow-400' :
                        selectedRepo.color === 'green' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        selectedRepo.color === 'red' ? 'text-red-400' :
                        selectedRepo.color === 'yellow' ? 'text-yellow-400' :
                        selectedRepo.color === 'green' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {selectedRepo.status}
                      </span>
                    </div>
                    <button
                      onClick={closeDrawer}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedRepo.repo}</h2>
                  <p className="text-zinc-400 text-base mb-6 leading-relaxed">{selectedRepo.description}</p>
                  <div className="flex items-center gap-6 text-sm text-zinc-400">
                    <span>github.com/company/{selectedRepo.repo}</span>
                    <span>•</span>
                    <span>{selectedRepo.language}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="p-8 border-b border-zinc-800/30">
                  <div className="grid grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{selectedRepo.messages}</div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Messages (24h)</div>
                      <div className="h-12 mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[{v:1},{v:2},{v:1},{v:3},{v:2}]}>
                            <Bar dataKey="v" fill="#6b7280" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{selectedRepo.uptime}</div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Uptime (24h)</div>
                      <div className="h-12 mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[{v:99},{v:100},{v:99},{v:100},{v:99}]}>
                            <Bar dataKey="v" fill="#6b7280" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{selectedRepo.incidents}</div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Incidents (24h)</div>
                      <div className="h-12 mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[{v:1},{v:0},{v:2},{v:1},{v:0}]}>
                            <Bar dataKey="v" fill="#6b7280" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Status</h3>
                    <button className="text-zinc-400 hover:text-white">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Uptime</span>
                      <span className="text-white font-medium">{selectedRepo.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Last Scan</span>
                      <span className="text-white font-medium">{selectedRepo.lastScan}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Branch</span>
                      <span className="text-white font-medium font-mono">{selectedRepo.branch}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Section */}
                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Performance</h3>
                    <button className="text-zinc-400 hover:text-white">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Messages (24h)</span>
                      <span className="text-white font-medium">{selectedRepo.messages} messages</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Latency</span>
                      <span className="text-white font-medium">45ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Success Rate</span>
                      <span className="text-white font-medium">{selectedRepo.successRate}</span>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Security</h3>
                    <button className="text-zinc-400 hover:text-white text-sm text-white">
                      See more
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Security Score</span>
                      <span className={`font-medium ${
                        selectedRepo.color === 'red' ? 'text-red-400' :
                        selectedRepo.color === 'yellow' ? 'text-yellow-400' :
                        selectedRepo.color === 'green' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {selectedRepo.securityScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Active Alerts</span>
                      <span className="text-white font-medium">{selectedRepo.activeAlerts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Success Rate</span>
                      <span className="text-white font-medium">{selectedRepo.successRate}</span>
                    </div>
                  </div>
                </div>

                {/* Incidents/Error Log */}
                <div className="p-8 pb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Incidents/Error Log</h3>
                    <button className="text-zinc-400 hover:text-white text-sm text-white">
                      See more
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="text-zinc-400 mb-4">
                      Status: {selectedRepo.vulnerabilities} • Timestamp: {selectedRepo.lastScan} • Type: Security
                    </div>
                    
                    {selectedRepo.vulnerabilities > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedRepo.color === 'red' ? 'bg-red-400' :
                            selectedRepo.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}></div>
                          <div className="flex-1">
                            <div className="text-white font-medium">
                              {selectedRepo.color === 'red' ? 'Critical vulnerability detected' : 
                               selectedRepo.color === 'yellow' ? 'Security warning found' : 'Minor security issue'}
                            </div>
                            <div className="text-zinc-400 text-sm">
                              {selectedRepo.color === 'red' ? 'SQL injection in authentication module' :
                               selectedRepo.color === 'yellow' ? 'Outdated dependency detected' : 'Code quality improvement needed'}
                            </div>
                            <div className="text-zinc-500 text-sm mt-1">{selectedRepo.lastScan}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            selectedRepo.color === 'red' ? 'bg-red-400/20' : 'bg-yellow-400/20'
                          }`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              selectedRepo.color === 'red' ? 'bg-red-400' : 'bg-yellow-400'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}