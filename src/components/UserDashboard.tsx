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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('DASHBOARD');
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
  const [scanningRepos, setScanningRepos] = useState<Set<string>>(new Set());
  const [hasInitialScanned, setHasInitialScanned] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showAllAiVulns, setShowAllAiVulns] = useState<Map<string, boolean>>(new Map());

  // Calculate security metrics from scan results
  const calculateSecurityMetrics = () => {
    const reports = Array.from(securityReports.values());
    
    if (reports.length === 0) {
      return {
        totalVulnerabilities: 0,
        criticalVulnerabilities: 0,
        highVulnerabilities: 0,
        mediumVulnerabilities: 0,
        lowVulnerabilities: 0,
        totalRepos: rows.length,
        scannedRepos: reports.length,
        avgRiskScore: 0,
        healthyRepos: 0,
        criticalRepos: 0
      };
    }

    const totalVulnerabilities = reports.reduce((sum, report) => sum + report.summary.total_vulnerabilities, 0);
    const criticalVulnerabilities = reports.reduce((sum, report) => sum + report.summary.critical, 0);
    const highVulnerabilities = reports.reduce((sum, report) => sum + report.summary.high, 0);
    const mediumVulnerabilities = reports.reduce((sum, report) => sum + report.summary.medium, 0);
    const lowVulnerabilities = reports.reduce((sum, report) => sum + report.summary.low, 0);
    const avgRiskScore = reports.reduce((sum, report) => sum + report.summary.risk_score, 0) / reports.length;
    
    const healthyRepos = reports.filter(report => report.summary.total_vulnerabilities === 0).length;
    const criticalRepos = reports.filter(report => report.summary.critical > 0 || report.summary.high > 5).length;

    return {
      totalVulnerabilities,
      criticalVulnerabilities,
      highVulnerabilities,
      mediumVulnerabilities,
      lowVulnerabilities,
      totalRepos: rows.length,
      scannedRepos: reports.length,
      avgRiskScore: Math.round(avgRiskScore),
      healthyRepos,
      criticalRepos
    };
  };

  const metrics = calculateSecurityMetrics();

  // Load scan results from localStorage
  const loadScanResults = () => {
    try {
      const saved = localStorage.getItem('securityScanResults');
      if (saved) {
        const data = JSON.parse(saved);
        const reportsMap = new Map(Object.entries(data));
        setSecurityReports(reportsMap);
        
        // Update rows with saved scan data
        setRows(prevRows => prevRows.map(row => {
          const report = reportsMap.get(row.full_name);
          if (report) {
            return updateRowWithSecurityData(row, report);
          }
          return row;
        }));
      }
    } catch (error) {
      console.error('Failed to load scan results from localStorage:', error);
    }
  };

  // Save scan results to localStorage
  const saveScanResults = (reports: Map<string, RepositorySecurityReport>) => {
    try {
      const data = Object.fromEntries(reports);
      localStorage.setItem('securityScanResults', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save scan results to localStorage:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Check for auth success parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

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
          
          // Load saved scan results
          loadScanResults();
          
          // Run initial scan if not already done
          if (!hasInitialScanned) {
            setHasInitialScanned(true);
            // Small delay to let repos load first, then scan the newly loaded repositories
            setTimeout(() => {
              runInitialScan(securityRepos);
            }, 1000);
          }
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
      
      // Auto-scan repositories when refreshed
      setTimeout(() => {
        runInitialScan(securityRepos);
      }, 500);
    } catch (e: any) {
      setRepoError(e?.message || 'Failed to refresh repositories');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const scanAllRepositories = async (repos: any[]) => {
    console.log(`🚀 [Dashboard] Starting batch scan for ${repos.length} repositories`);
    console.log(`📋 [Dashboard] Repositories to scan:`, repos.map(r => r.full_name).join(', '));
    
    setIsScanning(true);
    const newReports = new Map<string, RepositorySecurityReport>();
    
    // Scan repositories in parallel (limit to 5 at a time to avoid rate limits)
    const batchSize = 5;
    for (let i = 0; i < repos.length; i += batchSize) {
      const batch = repos.slice(i, i + batchSize);
      console.log(`🔄 [Dashboard] Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(repos.length/batchSize)}: ${batch.map(r => r.full_name).join(', ')}`);
      
      const scanPromises = batch.map(async (repo) => {
        try {
          console.log(`🎯 [Dashboard] Starting scan for: ${repo.full_name}`);
          const [owner, repoName] = repo.full_name.split('/');
          const report = await securityScanner.scanRepository(owner, repoName);
          newReports.set(repo.full_name, report);
          
          // Console log batch scan results
          console.log('🔄 [Dashboard] Batch Scan Results for:', repo.full_name);
          console.log('📊 [Dashboard] Summary:', report.summary);
          console.log('🚨 [Dashboard] Vulnerabilities Found:', report.vulnerabilities.length);
          console.log('📈 [Dashboard] Full Report:', report);
          
          // Update the row with real security data
          updateRowWithSecurityData(repo.full_name, report);
        } catch (error) {
          console.error(`❌ [Dashboard] Failed to scan ${repo.full_name}:`, error);
        }
      });
      
      await Promise.all(scanPromises);
      console.log(`✅ [Dashboard] Completed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(repos.length/batchSize)}`);
    }
    
    console.log(`🎉 [Dashboard] Batch scan completed for all ${repos.length} repositories`);
    setSecurityReports(newReports);
    saveScanResults(newReports); // Save to localStorage
    setIsScanning(false);
  };

  const runInitialScan = async (repos?: any[]) => {
    const repositoriesToScan = repos || rows;
    console.log(`🚀 [Dashboard] Starting initial scan for all repositories`);
    await scanAllRepositories(repositoriesToScan);
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
      console.log(`🎯 [Dashboard] Starting scan for repository: ${repoFullName}`);
      console.log(`⏰ [Dashboard] Scan initiated at: ${new Date().toLocaleString()}`);
      
      // Add to scanning set
      setScanningRepos(prev => new Set(prev).add(repoFullName));

      const [owner, repoName] = repoFullName.split('/');
      console.log(`🔍 [Dashboard] Calling security scanner for ${owner}/${repoName}`);
      const report = await securityScanner.scanRepository(owner, repoName);
      
      // Console log all scan results
      console.log('🔍 Security Scan Results for:', repoFullName);
      console.log('📊 Summary:', report.summary);
      console.log('🚨 GitHub Vulnerabilities:', report.vulnerabilities.filter(v => !v.id.startsWith('ai-')));
      console.log('🤖 AI Analysis Results:', report.ai_vulnerabilities || []);
      console.log('📁 AI Files Analyzed:', report.ai_files_analyzed || 0);
      console.log('📈 Total Files Scanned:', report.files_scanned || 0);
      console.log('🔧 Dependencies Scanned:', report.dependencies_scanned || 0);
      
      if (report.ai_vulnerabilities && report.ai_vulnerabilities.length > 0) {
        console.log('🚨 AI Found Security Issues:');
        report.ai_vulnerabilities.forEach((vuln, index) => {
          console.log(`   ${index + 1}. [${vuln.severity}] ${vuln.title} in ${vuln.file_path}`);
          console.log(`      Category: ${vuln.category}`);
          console.log(`      Remediation: ${vuln.remediation}`);
        });
      } else if (report.ai_files_analyzed > 0) {
        console.log('✅ AI Analysis Complete - No security vulnerabilities detected in analyzed files');
        console.log('💡 Consider implementing additional security measures like input validation, rate limiting, and regular security audits');
      }
      
      console.log('📈 Full Report:', report);
      
      // Scan completed
      
      setSecurityReports(prev => {
        const newReports = new Map(prev).set(repoFullName, report);
        saveScanResults(newReports); // Save to localStorage
        return newReports;
      });
      updateRowWithSecurityData(repoFullName, report);
      
      // Remove from scanning set after a brief delay
      setTimeout(() => {
        setScanningRepos(prev => {
          const newSet = new Set(prev);
          newSet.delete(repoFullName);
          return newSet;
        });
      }, 1000);
    } catch (error) {
      console.error(`Failed to scan ${repoFullName}:`, error);
      // Remove from scanning set on error
      setScanningRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(repoFullName);
        return newSet;
      });
    }
  };

  const menuItems = useMemo(() => [
    { name: 'Home', icon: Home, active: false }
  ], []);

  const bottomMenuItems = useMemo(() => [
    { name: 'Support', icon: HelpCircle },
    { name: 'Settings', icon: Settings }
  ], []);

  const navItems = useMemo(() => [], []);

  const messagesData = useMemo(() => [{ value: 2200 }, { value: 2300 }, { value: 2100 }, { value: 2400 }, { value: 2350 }, { value: 2450 }, { value: 2400 }, { value: 2500 }], []);
  const protocolsData = useMemo(() => [{ value: 25 }, { value: 28 }, { value: 30 }, { value: 27 }, { value: 32 }, { value: 30 }, { value: 29 }, { value: 30 }], []);
  const analyticsData = useMemo(() => [{ value: 95 }, { value: 97 }, { value: 99 }, { value: 98 }, { value: 99.5 }, { value: 99.9 }, { value: 99.8 }, { value: 99.9 }], []);
  const securityData = useMemo(() => [{ value: 20 }, { value: 18 }, { value: 15 }, { value: 12 }, { value: 10 }, { value: 15 }, { value: 13 }, { value: 15 }], []);
  const errorsData = useMemo(() => [{ value: 12 }, { value: 10 }, { value: 8 }, { value: 6 }, { value: 5 }, { value: 7 }, { value: 6 }, { value: 7 }], []);

  const filteredRows = rows.filter(repo =>
    repo.repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.private ? 'private' : 'public').includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentScans = useMemo(() => {
    if (securityReports.size === 0) {
      return [];
    }

    // Convert security reports to recent scans format
    const scans = Array.from(securityReports.entries()).map(([repoName, report]) => {
      const summary = report.summary;
      let status: 'Critical' | 'Warning' | 'Healthy' | 'Offline' = 'Healthy';
      
      if (summary.critical > 0 || summary.high > 5) {
        status = 'Critical';
      } else if (summary.high > 0 || summary.medium > 3) {
        status = 'Warning';
      } else if (summary.total_vulnerabilities === 0) {
        status = 'Healthy';
      }

      // Calculate time ago from last scan
      const lastScanDate = new Date(summary.last_scan);
      const now = new Date();
      const diffMs = now.getTime() - lastScanDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      let timeAgo: string;
      if (diffHours > 24) {
        const days = Math.floor(diffHours / 24);
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMinutes > 0) {
        timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = 'Just now';
      }

      return {
        repo: repoName.split('/')[1] || repoName, // Just the repo name, not owner/repo
        fullName: repoName,
        status,
        time: timeAgo,
        type: 'Security Scan' as const,
        vulnerabilities: summary.total_vulnerabilities,
        riskScore: summary.risk_score
      };
    });

    // Sort by most recent scan time and return top 5
    return scans
      .sort((a, b) => {
        const aTime = new Date(securityReports.get(a.fullName)?.summary.last_scan || 0).getTime();
        const bTime = new Date(securityReports.get(b.fullName)?.summary.last_scan || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [securityReports]);

  const handleRowClick = (repo: SecurityRow) => {
    setSelectedRepo(repo);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedRepo(null);
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
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

      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <header className="fixed top-0 right-0 left-0 bg-zinc-900/30 border-b border-zinc-800/50 backdrop-blur-sm z-50" style={{ left: isCollapsed ? '64px' : '256px' }}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center">
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-2 py-1 bg-zinc-800/30 text-zinc-400 rounded-sm text-xs font-normal border border-zinc-700/30">
                      <Github className="w-3 h-3" />
                      <span>{login || 'Connected'}</span>
                    </div>
                    <button 
                      onClick={refreshRepositories} 
                      disabled={isLoadingRepos} 
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700/30 rounded-sm transition-colors disabled:opacity-50" 
                      title="Refresh repositories"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingRepos ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={handleGitHubDisconnect} 
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700/30 rounded-sm transition-colors" 
                      title="Disconnect GitHub"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button onClick={handleGitHubConnect} className="flex items-center gap-2 px-2 py-1 bg-zinc-800/30 text-zinc-400 rounded-sm text-xs font-normal hover:bg-zinc-700/30 transition-colors border border-zinc-700/30">
                    <Github className="w-3 h-3" />
                    Connect GitHub
                  </button>
                )}
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">Security Dashboard</h1>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="relative dropdown-container">
                  <button onClick={() => setShowUserDropdown(v => !v)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
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
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Total Vulnerabilities</p>
                  {isScanning || !hasInitialScanned ? (
                    <div className="flex flex-col items-center justify-center gap-4 h-20">
                      <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                      <p className="text-zinc-400 text-sm">Loading...</p>
                    </div>
                  ) : (
                    <p className="text-white text-2xl font-bold">{metrics.totalVulnerabilities}</p>
                  )}
                </div>
              </div>
              <div className="h-8">
                {isScanning || !hasInitialScanned ? (
                  <div className="w-full h-full bg-zinc-800/50 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { value: metrics.criticalVulnerabilities },
                      { value: metrics.highVulnerabilities },
                      { value: metrics.mediumVulnerabilities },
                      { value: metrics.lowVulnerabilities }
                    ]}>
                      <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Repositories</p>
                  {isScanning || !hasInitialScanned ? (
                    <div className="flex flex-col items-center justify-center gap-4 h-20">
                      <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                      <p className="text-zinc-400 text-sm">Loading...</p>
                    </div>
                  ) : (
                    <p className="text-white text-2xl font-bold">{metrics.scannedRepos}/{metrics.totalRepos}</p>
                  )}
                </div>
              </div>
              <div className="h-8">
                {isScanning || !hasInitialScanned ? (
                  <div className="w-full h-full bg-zinc-800/50 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { value: metrics.scannedRepos },
                      { value: metrics.healthyRepos },
                      { value: metrics.criticalRepos }
                    ]}>
                      <Bar dataKey="value" fill="#6b7280" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Avg Risk Score</p>
                  {isScanning || !hasInitialScanned ? (
                    <div className="flex flex-col items-center justify-center gap-4 h-20">
                      <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                      <p className="text-zinc-400 text-sm">Loading...</p>
                    </div>
                  ) : (
                    <p className="text-white text-2xl font-bold">{metrics.avgRiskScore}/100</p>
                  )}
                </div>
              </div>
              <div className="h-8">
                {isScanning || !hasInitialScanned ? (
                  <div className="w-full h-full bg-zinc-800/50 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { value: metrics.avgRiskScore },
                      { value: 100 - metrics.avgRiskScore }
                    ]}>
                      <Bar dataKey="value" fill="#6b7280" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Critical Issues</p>
                  {isScanning || !hasInitialScanned ? (
                    <div className="flex flex-col items-center justify-center gap-4 h-20">
                      <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                      <p className="text-zinc-400 text-sm">Loading...</p>
                    </div>
                  ) : (
                    <p className="text-white text-2xl font-bold">{metrics.criticalVulnerabilities}</p>
                  )}
                </div>
              </div>
              <div className="h-8">
                {isScanning || !hasInitialScanned ? (
                  <div className="w-full h-full bg-zinc-800/50 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { value: metrics.criticalVulnerabilities },
                      { value: metrics.highVulnerabilities },
                      { value: metrics.mediumVulnerabilities }
                    ]}>
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">High Severity</p>
                  {isScanning || !hasInitialScanned ? (
                    <div className="flex flex-col items-center justify-center gap-4 h-20">
                      <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                      <p className="text-zinc-400 text-sm">Loading...</p>
                    </div>
                  ) : (
                    <p className="text-white text-2xl font-bold">{metrics.highVulnerabilities}</p>
                  )}
                </div>
              </div>
              <div className="h-8">
                {isScanning || !hasInitialScanned ? (
                  <div className="w-full h-full bg-zinc-800/50 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { value: metrics.highVulnerabilities },
                      { value: metrics.mediumVulnerabilities },
                      { value: metrics.lowVulnerabilities }
                    ]}>
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
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
                {recentScans.length === 0 ? (
                  <div className="text-center py-8">
                    {isScanning || !hasInitialScanned ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                        <p className="text-zinc-400">Scanning repositories...</p>
                        <p className="text-zinc-500 text-sm">Recent scan results will appear here</p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-zinc-400 mb-2">No scan results available</p>
                        <p className="text-zinc-500 text-sm">Run a security scan to see recent results</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentScans.map((scan, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between py-3 px-4 bg-zinc-800/20 rounded-lg hover:bg-zinc-800/30 transition-colors cursor-pointer"
                      onClick={() => {
                        const repo = rows.find(r => r.full_name === scan.fullName);
                        if (repo) {
                          handleRowClick(repo);
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${scan.status === 'Critical' ? 'bg-red-400' : scan.status === 'Warning' ? 'bg-yellow-400' : scan.status === 'Healthy' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{scan.repo}</div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className={`font-medium ${scan.status === 'Critical' ? 'text-red-400' : scan.status === 'Warning' ? 'text-yellow-400' : scan.status === 'Healthy' ? 'text-green-400' : 'text-gray-400'}`}>{scan.status}</span>
                            <span className="text-zinc-500">•</span>
                            <span className="text-zinc-400">{scan.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-zinc-500 text-sm">{scan.type}</span>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
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
                    placeholder="Search by name, language, privacy, or status"
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
                <div className="mb-4 p-4 bg-zinc-800/20 border border-zinc-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-zinc-400 animate-spin" />
                    <div>
                      <p className="text-zinc-400 font-medium">Loading Repositories</p>
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
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Security Status</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Repository</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Language</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Vulnerabilities</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Last Scan</th>
                    <th className="text-left py-4 px-6 text-zinc-400 font-medium text-sm uppercase tracking-wider">Risk Score</th>
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
                        <span className={`text-sm font-medium ${
                          repo.vulnerabilities > 10 ? 'text-red-400' : 
                          repo.vulnerabilities > 5 ? 'text-yellow-400' : 
                          repo.vulnerabilities > 0 ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                          {repo.vulnerabilities}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-zinc-400 text-sm">
                          {repo.lastScan}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${parseFloat(repo.risk) > 50 ? 'text-red-400' : parseFloat(repo.risk) > 5 ? 'text-yellow-400' : 'text-green-400'}`}>{repo.risk}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {scanningRepos.has(repo.full_name) ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                            <span className="text-zinc-400 text-xs font-medium">Scanning...</span>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              scanSingleRepository(repo.full_name);
                            }}
                            disabled={isScanning}
                            className="bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700/50 hover:border-zinc-600/50"
                          >
                            Scan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filteredRows.length && (
                    <tr>
                      <td className="py-4 px-6 text-zinc-500" colSpan={7}>No repositories</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-zinc-800/30 bg-zinc-900/20">
              <p className="text-zinc-500 text-sm text-center">
                The platform found <span className="text-white font-medium">{filteredRows.reduce((sum, repo) => sum + repo.vulnerabilities, 0)} vulnerabilities</span> across your repositories
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
                  <div className="grid grid-cols-3 gap-0 mb-8">
                    <div className="text-center border-r border-zinc-700/50 pr-8">
                      <div className="text-3xl font-bold text-white mb-2">
                        {securityReports.has(selectedRepo.full_name) 
                          ? securityReports.get(selectedRepo.full_name)!.files_scanned || 0
                          : 0
                        }
                      </div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wider">Files Scanned</div>
                    </div>
                    <div className="text-center border-r border-zinc-700/50 px-8">
                      <div className="text-3xl font-bold text-white mb-2">
                        {securityReports.has(selectedRepo.full_name) 
                          ? securityReports.get(selectedRepo.full_name)!.dependencies_scanned || 0
                          : 0
                        }
                      </div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wider">Dependencies</div>
                    </div>
                    <div className="text-center pl-8">
                      <div className="text-3xl font-bold text-white mb-2">
                        {securityReports.has(selectedRepo.full_name) 
                          ? securityReports.get(selectedRepo.full_name)!.ai_files_analyzed || 0
                          : 0
                        }
                      </div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wider">AI Analyzed</div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Security Scan Results</h3>
                    <button 
                      onClick={() => scanSingleRepository(selectedRepo.full_name)}
                      disabled={scanningRepos.has(selectedRepo.full_name)}
                      className="text-zinc-400 hover:text-zinc-300 text-sm font-medium disabled:opacity-50"
                    >
                      {scanningRepos.has(selectedRepo.full_name) ? 'Scanning...' : 'Re-scan'}
                    </button>
                  </div>
                  
                  {scanningRepos.has(selectedRepo.full_name) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                        <span className="text-sm text-zinc-400">Scanning in progress...</span>
                      </div>
                    </div>
                  )}
                  
                  {securityReports.has(selectedRepo.full_name) ? (
                    <div className="space-y-4">
                      {(() => {
                        const report = securityReports.get(selectedRepo.full_name)!;
                        const summary = report.summary;
                        const githubVulns = report.vulnerabilities.filter(v => !v.id.startsWith('ai-'));
                        const aiVulns = report.vulnerabilities.filter(v => v.id.startsWith('ai-'));
                        
                        return (
                          <>
                            {/* Scan Summary */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-zinc-800/30 rounded-lg p-3">
                                <div className="text-2xl font-bold text-white mb-1">{summary.total_vulnerabilities}</div>
                                <div className="text-zinc-400 text-xs">Total Vulnerabilities</div>
                              </div>
                              <div className="bg-zinc-800/30 rounded-lg p-3">
                                <div className="text-2xl font-bold text-white mb-1">{summary.risk_score}</div>
                                <div className="text-zinc-400 text-xs">Risk Score</div>
                              </div>
                            </div>

                            {/* Scan Statistics */}
                            <div className="bg-zinc-800/20 rounded-lg p-3 mb-4">
                              <h4 className="text-white font-medium mb-2">Scan Statistics</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Files Scanned:</span>
                                  <span className="text-white">{report.files_scanned || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">AI Files Analyzed:</span>
                                  <span className="text-white">{report.ai_files_analyzed || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Dependencies:</span>
                                  <span className="text-white">{report.dependencies_scanned || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Last Scan:</span>
                                  <span className="text-white">{new Date(summary.last_scan).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Severity Breakdown */}
                            <div className="space-y-3">
                              <h4 className="text-white font-medium">Severity Breakdown</h4>
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-400">Critical</span>
                                <span className="text-red-400 font-medium">{summary.critical}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-400">High</span>
                                <span className="text-orange-400 font-medium">{summary.high}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-400">Medium</span>
                                <span className="text-yellow-400 font-medium">{summary.medium}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-400">Low</span>
                                <span className="text-green-400 font-medium">{summary.low}</span>
                              </div>
                            </div>
                            
                            {/* GitHub Vulnerabilities */}
                            {githubVulns.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-white font-medium mb-2">GitHub Security Alerts</h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {githubVulns.slice(0, 3).map((vuln, index) => (
                                    <div key={index} className="bg-zinc-800/20 rounded p-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs px-2 py-1 rounded ${
                                          vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                          vuln.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                          vuln.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                          'bg-green-500/20 text-green-400'
                                        }`}>
                                          {vuln.severity}
                                        </span>
                                        <span className="text-zinc-500 text-xs">{vuln.category}</span>
                                      </div>
                                      <div className="text-white text-sm font-medium">{vuln.title}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* AI Analysis Results */}
                            {aiVulns.length > 0 ? (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-white font-medium">AI Security Analysis</h4>
                                  <button 
                                    onClick={() => toggleSection('ai-vulnerabilities')}
                                    className="text-zinc-400 hover:text-white"
                                  >
                                    {collapsedSections.has('ai-vulnerabilities') ? 
                                      <ChevronDown className="w-4 h-4" /> : 
                                      <ChevronUp className="w-4 h-4" />
                                    }
                                  </button>
                                </div>
                                {!collapsedSections.has('ai-vulnerabilities') && (
                                  <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {(showAllAiVulns.get(selectedRepo.full_name) ? aiVulns : aiVulns.slice(0, 3)).map((vuln, index) => (
                                      <div key={index} className="bg-zinc-800/20 border border-zinc-700/30 rounded p-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className={`text-xs px-2 py-1 rounded ${
                                            vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                            vuln.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                            vuln.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-green-500/20 text-green-400'
                                          }`}>
                                            {vuln.severity}
                                          </span>
                                          <span className="text-zinc-400 text-xs">{vuln.file_path}</span>
                                        </div>
                                        <div className="text-white text-sm font-medium mb-1">{vuln.title}</div>
                                        <div className="text-zinc-400 text-xs mb-2">{vuln.description}</div>
                                        <div className="text-green-400 text-xs">
                                          <strong>Fix:</strong> {vuln.remediation}
                                        </div>
                                      </div>
                                    ))}
                                    {aiVulns.length > 3 && !showAllAiVulns.get(selectedRepo.full_name) && (
                                      <button
                                        onClick={() => setShowAllAiVulns(prev => new Map(prev).set(selectedRepo.full_name, true))}
                                        className="w-full mt-2 text-zinc-400 hover:text-zinc-300 text-sm font-medium py-2 border border-zinc-700/30 rounded hover:bg-zinc-800/10 transition-colors"
                                      >
                                        Load More ({aiVulns.length - 3} more)
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : report.ai_files_analyzed > 0 && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-white font-medium">AI Security Analysis</h4>
                                  <button 
                                    onClick={() => toggleSection('ai-analysis')}
                                    className="text-zinc-400 hover:text-white"
                                  >
                                    {collapsedSections.has('ai-analysis') ? 
                                      <ChevronDown className="w-4 h-4" /> : 
                                      <ChevronUp className="w-4 h-4" />
                                    }
                                  </button>
                                </div>
                                {!collapsedSections.has('ai-analysis') && (
                                  <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                    <div className="text-green-400 text-sm font-medium mb-2">No security vulnerabilities detected</div>
                                    <div className="text-zinc-400 text-xs mb-3">AI analyzed {report.ai_files_analyzed} files and found no security issues.</div>
                                    
                                    {/* AI-Generated Recommendations */}
                                    {report.ai_recommendations && report.ai_recommendations.length > 0 ? (
                                      <div className="text-zinc-300 text-xs">
                                        <div className="font-medium mb-2">AI-Generated Security Recommendations:</div>
                                        <div className="space-y-2">
                                          {report.ai_recommendations.map((rec, index) => (
                                            <div key={index} className="bg-zinc-800/30 rounded p-2 border border-zinc-700/30">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                                  rec.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                                                  rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                  'bg-zinc-800/20 text-zinc-400'
                                                }`}>
                                                  {rec.priority}
                                                </span>
                                                <span className="text-xs text-zinc-400 capitalize">{rec.category}</span>
                                              </div>
                                              <h6 className="text-xs font-medium text-white mb-1">{rec.title}</h6>
                                              <p className="text-xs text-zinc-400">{rec.description}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-zinc-300 text-xs">
                                        <div className="font-medium mb-1">General Security Recommendations:</div>
                                        <ul className="space-y-1 text-xs">
                                          <li>• Implement input validation for user inputs</li>
                                          <li>• Store API keys in environment variables</li>
                                          <li>• Add rate limiting to prevent attacks</li>
                                          <li>• Set up security monitoring and logging</li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-zinc-400 mb-2">No scan results available</div>
                      <button 
                        onClick={() => scanSingleRepository(selectedRepo.full_name)}
                        disabled={scanningRepos.has(selectedRepo.full_name)}
                        className="text-zinc-400 hover:text-zinc-300 text-sm font-medium disabled:opacity-50"
                      >
                        {scanningRepos.has(selectedRepo.full_name) ? 'Scanning...' : 'Run Security Scan'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Security Status</h3>
                    <button 
                      onClick={() => toggleSection('security-status')}
                      className="text-zinc-400 hover:text-white"
                    >
                      {collapsedSections.has('security-status') ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronUp className="w-4 h-4" />
                      }
                    </button>
                  </div>
                  {!collapsedSections.has('security-status') && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Risk Score</span>
                        <span className={`font-medium ${
                          securityReports.has(selectedRepo.full_name) && securityReports.get(selectedRepo.full_name)!.summary.risk_score > 50 
                            ? 'text-red-400' 
                            : securityReports.has(selectedRepo.full_name) && securityReports.get(selectedRepo.full_name)!.summary.risk_score > 10
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}>
                          {securityReports.has(selectedRepo.full_name) 
                            ? `${securityReports.get(selectedRepo.full_name)!.summary.risk_score}/100`
                            : '0/100'
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Last Scan</span>
                        <span className="text-white font-medium">
                          {securityReports.has(selectedRepo.full_name) 
                            ? new Date(securityReports.get(selectedRepo.full_name)!.summary.last_scan).toLocaleString()
                            : 'Never'
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Branch</span>
                        <span className="text-white font-medium font-mono">{selectedRepo.branch}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-lg">Security Metrics</h3>
                    <button 
                      onClick={() => toggleSection('security-metrics')}
                      className="text-zinc-400 hover:text-white"
                    >
                      {collapsedSections.has('security-metrics') ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronUp className="w-4 h-4" />
                      }
                    </button>
                  </div>
                  {!collapsedSections.has('security-metrics') && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Total Vulnerabilities</span>
                        <span className="text-white font-medium">
                          {securityReports.has(selectedRepo.full_name) 
                            ? securityReports.get(selectedRepo.full_name)!.summary.total_vulnerabilities
                            : 0
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Critical Issues</span>
                        <span className="text-red-400 font-medium">
                          {securityReports.has(selectedRepo.full_name) 
                            ? securityReports.get(selectedRepo.full_name)!.summary.critical
                            : 0
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">High Priority</span>
                        <span className="text-orange-400 font-medium">
                          {securityReports.has(selectedRepo.full_name) 
                            ? securityReports.get(selectedRepo.full_name)!.summary.high
                            : 0
                          }
                        </span>
                      </div>
                    </div>
                  )}
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
