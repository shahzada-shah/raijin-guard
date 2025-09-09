import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Home,
  FolderOpen,
  AlertTriangle,
  HelpCircle,
  Search,
  X,
  Bell,
  ChevronDown,
  ChevronUp,
  LogOut,
  User as UserIcon,
  Clock,
  Github,
  RefreshCw
} from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { githubAuthServer } from '../services/githubAuthServer';
import { githubApiServer, RepositorySecurityData } from '../services/githubApiServer';
import { securityScanner, RepositorySecurityReport } from '../services/securityScanner';


type SecurityRow = {
  status: 'Critical' | 'Warning' | 'Healthy' | 'Offline';
  repo: string;
  language: string;
  risk: string;
  lastScan: string;
  vulnerabilities: number;
  branch: string;
  color: 'red' | 'yellow' | 'green' | 'gray';
  description: string;
  uptime: string;
  messages: string;
  incidents: string;
  securityScore: string;
  activeAlerts: number;
  successRate: string;
  full_name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  private: boolean;
};


export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showNotification, setShowNotification] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('MESSAGES');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<SecurityRow | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRecentScans, setShowRecentScans] = useState(true);

  const [isConnected, setIsConnected] = useState(false);
  const [login, setLogin] = useState<string | null>(null);
  const [rows, setRows] = useState<SecurityRow[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState('');
  const [securityReports, setSecurityReports] = useState<Map<string, RepositorySecurityReport>>(new Map());
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const authStatus = await githubAuthServer.status();
        if (!mounted) return;
        setIsConnected(authStatus.connected);
        
        if (authStatus.connected) {
          // Get user info from auth status
          setLogin(authStatus.login || null);
          
          // Get repositories
          setIsLoadingRepos(true);
          const rawRepos = await githubApiServer.getUserRepositories();
          if (!mounted) return;
          const securityRepos = githubApiServer.transformToSecurityData(rawRepos);
          setRows(securityRepos);
          
          // Start security scanning for each repository
          await scanAllRepositories(rawRepos);
        } else {
          setLogin(null);
          setRows([]);
        }
      } catch (e: any) {
        setRepoError(e?.message || 'Failed to load repositories');
      } finally {
        setIsLoadingRepos(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleGitHubConnect = () => {
    githubAuthServer.initiateAuth();
  };

  const handleGitHubDisconnect = async () => {
    await githubAuthServer.logout();
    setIsConnected(false);
    setLogin(null);
    setRows([]);
  };

  const refreshRepositories = async () => {
    if (!isConnected) return;
    setIsLoadingRepos(true);
    setRepoError('');
    try {
      const rawRepos = await githubApiServer.getUserRepositories();
      const securityRepos = githubApiServer.transformToSecurityData(rawRepos);
      setRows(securityRepos);
      
      // Re-scan all repositories
      await scanAllRepositories(rawRepos);
    } catch (e: any) {
      setRepoError(e?.message || 'Failed to refresh repositories');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const scanAllRepositories = async (repos: any[]) => {
    setIsScanning(true);
    const newReports = new Map<string, RepositorySecurityReport>();
    
    // Scan repositories in parallel (limit to 5 at a time to avoid rate limits)
    const batchSize = 5;
    for (let i = 0; i < repos.length; i += batchSize) {
      const batch = repos.slice(i, i + batchSize);
      const scanPromises = batch.map(async (repo) => {
        try {
          const [owner, repoName] = repo.full_name.split('/');
          const report = await securityScanner.scanRepository(owner, repoName);
          newReports.set(repo.full_name, report);
          
          // Update the row with real security data
          updateRowWithSecurityData(repo.full_name, report);
        } catch (error) {
          console.error(`Failed to scan ${repo.full_name}:`, error);
        }
      });
      
      await Promise.all(scanPromises);
    }
    
    setSecurityReports(newReports);
    setIsScanning(false);
  };

  const updateRowWithSecurityData = (repoFullName: string, report: RepositorySecurityReport) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.full_name === repoFullName) {
        // Update with real security data
        const summary = report.summary;
        let status: 'Critical' | 'Warning' | 'Healthy' | 'Offline' = 'Healthy';
        let color: 'red' | 'yellow' | 'green' | 'gray' = 'green';
        
        if (summary.critical > 0) {
          status = 'Critical';
          color = 'red';
        } else if (summary.high > 0) {
          status = 'Warning';
          color = 'yellow';
        } else if (summary.medium > 0) {
          status = 'Warning';
          color = 'yellow';
        }
        
        return {
          ...row,
          status,
          color,
          vulnerabilities: summary.total_vulnerabilities,
          risk: `${summary.risk_score}%`,
          lastScan: new Date(summary.last_scan).toLocaleDateString(),
          securityScore: `${summary.risk_score}/100`,
          activeAlerts: summary.critical + summary.high
        };
      }
      return row;
    }));
  };

  const scanSingleRepository = async (repoFullName: string) => {
    try {
      const [owner, repoName] = repoFullName.split('/');
      const report = await securityScanner.scanRepository(owner, repoName);
      
      setSecurityReports(prev => new Map(prev).set(repoFullName, report));
      updateRowWithSecurityData(repoFullName, report);
    } catch (error) {
      console.error(`Failed to scan ${repoFullName}:`, error);
    }
  };

  const menuItems = useMemo(() => [
    { name: 'Home', icon: Home, active: false },
    { name: 'Repositories', icon: FolderOpen, active: false }
  ], []);

  const bottomMenuItems = useMemo(() => [
    { name: 'Support', icon: HelpCircle },
    { name: 'Settings', icon: Settings }
  ], []);

  const navItems = useMemo(() => ['MESSAGES', 'PROTOCOLS', 'ANALYTICS', 'TOOLS', 'DNS'], []);

  const messagesData = useMemo(() => [{ value: 2200 }, { value: 2300 }, { value: 2100 }, { value: 2400 }, { value: 2350 }, { value: 2450 }, { value: 2400 }, { value: 2500 }], []);
  const protocolsData = useMemo(() => [{ value: 25 }, { value: 28 }, { value: 30 }, { value: 27 }, { value: 32 }, { value: 30 }, { value: 29 }, { value: 30 }], []);
  const analyticsData = useMemo(() => [{ value: 95 }, { value: 97 }, { value: 99 }, { value: 98 }, { value: 99.5 }, { value: 99.9 }, { value: 99.8 }, { value: 99.9 }], []);
  const securityData = useMemo(() => [{ value: 20 }, { value: 18 }, { value: 15 }, { value: 12 }, { value: 10 }, { value: 15 }, { value: 13 }, { value: 15 }], []);
  const errorsData = useMemo(() => [{ value: 12 }, { value: 10 }, { value: 8 }, { value: 6 }, { value: 5 }, { value: 7 }, { value: 6 }, { value: 7 }], []);

  const filteredRows = rows.filter(repo =>
    repo.repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentScans = useMemo(() => [
    { repo: 'main-app', status: 'Critical', time: '2 hours ago', type: 'Scheduled' },
    { repo: 'notification-service', status: 'Healthy', time: '1 hour ago', type: 'Manual' },
    { repo: 'auth-service', status: 'Critical', time: '4 hours ago', type: 'Triggered' },
    { repo: 'file-storage', status: 'Healthy', time: '3 hours ago', type: 'Scheduled' },
    { repo: 'analytics-engine', status: 'Healthy', time: '5 hours ago', type: 'Manual' }
  ], []);

  const handleRowClick = (repo: SecurityRow) => {
    setSelectedRepo(repo);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedRepo(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex relative">
      <div
        className={`fixed left-0 top-0 h-full bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-sm z-50 ${isCollapsed ? 'w-16' : 'w-64'}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="p-4 border-b border-zinc-800/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-zinc-900 rounded-sm"></div>
            </div>
            {!isCollapsed && (
              <div className="text-white ml-3 transition-opacity duration-300">
                <div className="text-lg font-extrabold tracking-tight">RAIJIN</div>
                <div className="text-xs text-zinc-400 -mt-1">GUARD</div>
              </div>
            )}
          </div>
        </div>

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

        <div className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map(item => {
              const IconComponent = item.icon;
              const isActive = item.name === activeMenuItem;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenuItem(item.name)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ease-out group ${isActive ? 'bg-zinc-800/50 text-white backdrop-blur-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <IconComponent className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ease-out ${isActive ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]' : ''}`} />
                  {!isCollapsed && <span className={`ml-3 transition-opacity duration-300 ${isActive ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]' : ''}`}>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-800/50 p-3">
          <nav className="space-y-1">
            {bottomMenuItems.map(item => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 rounded-lg transition-all duration-300 ease-out hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]"
                  title={isCollapsed ? item.name : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="ml-3 transition-opacity duration-300">{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {showNotification && !isCollapsed && (
          <div className="m-3 bg-gradient-to-r from-white/10 to-zinc-300/10 border border-white/20 rounded-lg p-4 relative transition-opacity duration-300 backdrop-blur-sm">
            <button onClick={() => setShowNotification(false)} className="absolute top-2 right-2 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <div className="text-white text-sm font-medium mb-2">New security features available!</div>
            <p className="text-zinc-300 text-xs mb-3">Enhanced vulnerability scanning and AI-powered threat detection are now live.</p>
            <div className="flex items-center gap-2 px-2 py-1 bg-white/10 rounded text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white">System operational</span>
            </div>
          </div>
        )}
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <header className="fixed top-0 right-0 left-0 bg-zinc-900/30 border-b border-zinc-800/50 backdrop-blur-sm z-50" style={{ left: isCollapsed ? '64px' : '256px' }}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                {navItems.map(item => (
                  <button
                    key={item}
                    onClick={() => setActiveNavItem(item)}
                    className={`text-sm font-medium transition-all duration-300 ease-out ${activeNavItem === item ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]' : 'text-zinc-400 hover:text-white hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <Github className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">{login || 'Connected'}</span>
                    </div>
                    <button onClick={refreshRepositories} disabled={isLoadingRepos} className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50" title="Refresh repositories">
                      <RefreshCw className={`w-4 h-4 ${isLoadingRepos ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={handleGitHubDisconnect} className="text-zinc-400 hover:text-red-400 transition-colors text-sm" title="Disconnect GitHub">
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button onClick={handleGitHubConnect} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
                    <Github className="w-4 h-4" />
                    Connect GitHub
                  </button>
                )}

                <div className="relative dropdown-container">
                  <button onClick={() => { setShowNotificationDropdown(v => !v); setShowUserDropdown(false); }} className="text-zinc-400 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </button>
                  {showNotificationDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl backdrop-blur-md z-[100]">
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
                        <button className="text-white text-sm hover:text-zinc-300 transition-colors">View all notifications</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative dropdown-container">
                  <button onClick={() => { setShowUserDropdown(v => !v); setShowNotificationDropdown(false); }} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-zinc-300" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl backdrop-blur-md z-[100]">
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
                          <button onClick={() => navigate('/')} className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-zinc-800/30 transition-colors flex items-center gap-3">
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

        <main className="flex-1 p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 pt-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
            <p className="text-zinc-400">Monitor your repository security and manage your projects.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Messages (24h)</p>
                  <p className="text-white text-2xl font-bold">2,450</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ value: 2200 }, { value: 2300 }, { value: 2100 }, { value: 2400 }, { value: 2350 }, { value: 2450 }, { value: 2400 }, { value: 2500 }]}>
                    <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Protocols</p>
                  <p className="text-white text-2xl font-bold">30</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ value: 25 }, { value: 28 }, { value: 30 }, { value: 27 }, { value: 32 }, { value: 30 }, { value: 29 }, { value: 30 }]}>
                    <Bar dataKey="value" fill="#6b7280" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">API Uptime</p>
                  <p className="text-white text-2xl font-bold">99.9%</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ value: 95 }, { value: 97 }, { value: 99 }, { value: 98 }, { value: 99.5 }, { value: 99.9 }, { value: 99.8 }, { value: 99.9 }]}>
                    <Bar dataKey="value" fill="#6b7280" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Security Incidents (24h)</p>
                  <p className="text-white text-2xl font-bold">15</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ value: 20 }, { value: 18 }, { value: 15 }, { value: 12 }, { value: 10 }, { value: 15 }, { value: 13 }, { value: 15 }]}>
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Errors (24h)</p>
                  <p className="text-white text-2xl font-bold">7</p>
                </div>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ value: 12 }, { value: 10 }, { value: 8 }, { value: 6 }, { value: 5 }, { value: 7 }, { value: 6 }, { value: 7 }]}>
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-zinc-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-zinc-400" />
                  <h2 className="text-xl font-bold text-white">Recent Scans</h2>
                </div>
                <button onClick={() => setShowRecentScans(!showRecentScans)} className="text-zinc-400 hover:text-white transition-colors">
                  {showRecentScans ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {showRecentScans && (
              <div className="p-6">
                <div className="space-y-3">
                  {recentScans.map((scan, i) => (
                    <div key={i} className="flex items-center justify-between py-3 px-4 bg-zinc-800/20 rounded-lg hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${scan.status === 'Critical' ? 'bg-red-400' : scan.status === 'Warning' ? 'bg-yellow-400' : scan.status === 'Healthy' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className="text-white font-medium">{scan.repo}</div>
                          <div className="text-zinc-400 text-sm">{scan.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${scan.status === 'Critical' ? 'text-red-400' : scan.status === 'Warning' ? 'text-yellow-400' : scan.status === 'Healthy' ? 'text-green-400' : 'text-gray-400'}`}>{scan.status}</span>
                        <span className="text-zinc-500 text-sm">{scan.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-800/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Repository Security Status</h2>
                  {isConnected ? (
                    <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                      isScanning 
                        ? 'bg-yellow-500/20 border border-yellow-500/30' 
                        : 'bg-green-500/20 border border-green-500/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isScanning ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                      }`}></div>
                      <span className={`font-medium ${
                        isScanning ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {isScanning ? 'Scanning...' : 'Live Data'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-400 font-medium">Disconnected</span>
                    </div>
                  )}
                </div>
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

              {!isConnected && (
                <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-yellow-400 font-medium">Not connected</p>
                      <p className="text-zinc-400 text-sm">Connect GitHub to fetch your repositories.</p>
                    </div>
                  </div>
                </div>
              )}

              {repoError && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-red-400 font-medium">Error Loading Repositories</p>
                      <p className="text-zinc-400 text-sm">{repoError}</p>
                    </div>
                  </div>
                </div>
              )}

              {isLoadingRepos && (
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                    <div>
                      <p className="text-blue-400 font-medium">Loading Repositories</p>
                      <p className="text-zinc-400 text-sm">Fetching your GitHub repositories...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                  {filteredRows.map((repo) => (
                    <tr
                      key={repo.full_name}
                      className="border-b border-zinc-800/20 hover:bg-zinc-800/20 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(repo)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${repo.color === 'red' ? 'bg-red-400' : repo.color === 'yellow' ? 'bg-yellow-400' : repo.color === 'green' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                          <span className={`text-sm font-medium ${repo.color === 'red' ? 'text-red-400' : repo.color === 'yellow' ? 'text-yellow-400' : repo.color === 'green' ? 'text-green-400' : 'text-gray-400'}`}>{repo.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">{repo.repo}</div>
                        <div className="text-zinc-400 text-sm">{repo.full_name}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-zinc-300 text-sm">{repo.language}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${parseFloat(repo.risk) > 50 ? 'text-red-400' : parseFloat(repo.risk) > 5 ? 'text-yellow-400' : 'text-green-400'}`}>{repo.risk}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-zinc-400 text-sm">{repo.lastScan}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${repo.vulnerabilities > 10 ? 'text-red-400' : repo.vulnerabilities > 5 ? 'text-yellow-400' : 'text-green-400'}`}>{repo.vulnerabilities}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-zinc-400 text-sm font-mono">{repo.branch}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            scanSingleRepository(repo.full_name);
                          }}
                          disabled={isScanning}
                          className="border border-white text-white hover:bg-white hover:text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isScanning ? 'Scanning...' : 'Scan Now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!filteredRows.length && (
                    <tr>
                      <td className="py-4 px-6 text-zinc-500" colSpan={8}>No repositories</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-zinc-800/30 bg-zinc-900/20">
              <p className="text-zinc-500 text-sm text-center">
                The platform found <span className="text-white font-medium">{filteredRows.reduce((sum, repo) => sum + repo.vulnerabilities, 0)} DVN</span> for your request
              </p>
            </div>
          </div>

          {showDrawer && selectedRepo && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDrawer}></div>
              <div className="absolute right-0 top-0 h-full w-[600px] bg-zinc-900/95 border-l border-zinc-800/50 backdrop-blur-md overflow-y-auto">
                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedRepo.color === 'red' ? 'bg-red-400' : selectedRepo.color === 'yellow' ? 'bg-yellow-400' : selectedRepo.color === 'green' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className={`text-sm font-medium ${selectedRepo.color === 'red' ? 'text-red-400' : selectedRepo.color === 'yellow' ? 'text-yellow-400' : selectedRepo.color === 'green' ? 'text-green-400' : 'text-gray-400'}`}>{selectedRepo.status}</span>
                    </div>
                    <button onClick={closeDrawer} className="text-zinc-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedRepo.repo}</h2>
                  <p className="text-zinc-400 text-base mb-6 leading-relaxed">{selectedRepo.description || 'No description available'}</p>
                  <div className="flex items-center gap-6 text-sm text-zinc-400">
                    <span>{selectedRepo.full_name}</span>
                    <span>•</span>
                    <span>{selectedRepo.language}</span>
                  </div>
                </div>

                <div className="p-8 border-b border-zinc-800/30">
                  <div className="grid grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{selectedRepo.messages}</div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Messages (24h)</div>
                      <div className="h-12 mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }]}>
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
                          <BarChart data={[{ v: 99 }, { v: 100 }, { v: 99 }, { v: 100 }, { v: 99 }]}>
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
                          <BarChart data={[{ v: 1 }, { v: 0 }, { v: 2 }, { v: 1 }, { v: 0 }]}>
                            <Bar dataKey="v" fill="#6b7280" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

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

                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Security</h3>
                    <button className="text-zinc-400 hover:text-white text-sm text-white">See more</button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Security Score</span>
                      <span className={`${selectedRepo.color === 'red' ? 'text-red-400' : selectedRepo.color === 'yellow' ? 'text-yellow-400' : selectedRepo.color === 'green' ? 'text-green-400' : 'text-gray-400'} font-medium`}>{selectedRepo.securityScore}</span>
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

                <div className="p-8 pb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Incidents/Error Log</h3>
                    <button className="text-zinc-400 hover:text-white text-sm text-white">See more</button>
                  </div>
                  <div className="space-y-4">
                    <div className="text-zinc-400 mb-4">Status: {selectedRepo.vulnerabilities} • Timestamp: {selectedRepo.lastScan} • Type: Security</div>
                    {Number(selectedRepo.vulnerabilities) > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-lg">
                          <div className={`${selectedRepo.color === 'red' ? 'bg-red-400' : selectedRepo.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'} w-2 h-2 rounded-full`}></div>
                          <div className="flex-1">
                            <div className="text-white font-medium">
                              {selectedRepo.color === 'red' ? 'Critical vulnerability detected' : selectedRepo.color === 'yellow' ? 'Security warning found' : 'Minor security issue'}
                            </div>
                            <div className="text-zinc-400 text-sm">
                              {selectedRepo.color === 'red' ? 'SQL injection in authentication module' : selectedRepo.color === 'yellow' ? 'Outdated dependency detected' : 'Code quality improvement needed'}
                            </div>
                            <div className="text-zinc-500 text-sm mt-1">{selectedRepo.lastScan}</div>
                          </div>
                          <div className={`${selectedRepo.color === 'red' ? 'bg-red-400/20' : 'bg-yellow-400/20'} w-5 h-5 rounded-full flex items-center justify-center`}>
                            <div className={`${selectedRepo.color === 'red' ? 'bg-red-400' : 'bg-yellow-400'} w-2.5 h-2.5 rounded-full`}></div>
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
