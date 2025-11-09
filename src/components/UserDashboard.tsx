import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Home,
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
  RefreshCw,
  Shield,
  FileText,
  Activity
} from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { githubAuthServer } from '../services/githubAuthServer';
import { githubApiServer } from '../services/githubApiServer';
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
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
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
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Hardcoded control center data
  const MOCK_METRICS = {
    totalVulnerabilities: 47,
    criticalVulnerabilities: 8,
    highVulnerabilities: 15,
    mediumVulnerabilities: 18,
    lowVulnerabilities: 6,
    totalRepos: 12,
    scannedRepos: 12,
    avgRiskScore: 68,
    healthyRepos: 5,
    criticalRepos: 3
  };

  const [animatedMetrics, setAnimatedMetrics] = useState({
    totalVulnerabilities: 0,
    criticalVulnerabilities: 0,
    highVulnerabilities: 0,
    mediumVulnerabilities: 0,
    lowVulnerabilities: 0,
    totalRepos: 0,
    scannedRepos: 0,
    avgRiskScore: 0,
    healthyRepos: 0,
    criticalRepos: 0
  });

  // Calculate security metrics from scan results
  const calculateSecurityMetrics = () => {
    return animatedMetrics;
  };

  const metrics = calculateSecurityMetrics();

  // Animate metrics on load
  useEffect(() => {
    // Simulate loading delay
    const loadTimer = setTimeout(() => {
      setHasInitialScanned(true);

      // Animate each metric individually
      const duration = 1500;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const animationInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

        setAnimatedMetrics({
          totalVulnerabilities: Math.round(MOCK_METRICS.totalVulnerabilities * easeOutProgress),
          criticalVulnerabilities: Math.round(MOCK_METRICS.criticalVulnerabilities * easeOutProgress),
          highVulnerabilities: Math.round(MOCK_METRICS.highVulnerabilities * easeOutProgress),
          mediumVulnerabilities: Math.round(MOCK_METRICS.mediumVulnerabilities * easeOutProgress),
          lowVulnerabilities: Math.round(MOCK_METRICS.lowVulnerabilities * easeOutProgress),
          totalRepos: Math.round(MOCK_METRICS.totalRepos * easeOutProgress),
          scannedRepos: Math.round(MOCK_METRICS.scannedRepos * easeOutProgress),
          avgRiskScore: Math.round(MOCK_METRICS.avgRiskScore * easeOutProgress),
          healthyRepos: Math.round(MOCK_METRICS.healthyRepos * easeOutProgress),
          criticalRepos: Math.round(MOCK_METRICS.criticalRepos * easeOutProgress)
        });

        if (currentStep >= steps) {
          clearInterval(animationInterval);
          setAnimatedMetrics(MOCK_METRICS);
        }
      }, stepDuration);

      return () => clearInterval(animationInterval);
    }, 2000); // 2 second loading delay

    return () => clearTimeout(loadTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scan results are now managed in state, localStorage is optional backup
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Hardcoded mock repositories
  const MOCK_REPOS: SecurityRow[] = [
    {
      status: 'Critical',
      repo: 'web-api-gateway',
      language: 'TypeScript',
      risk: '85',
      lastScan: '2 mins ago',
      vulnerabilities: 12,
      branch: 'main',
      color: 'red',
      description: 'Core API gateway service',
      uptime: '99.2%',
      messages: '24',
      incidents: '3',
      securityScore: '62',
      activeAlerts: 5,
      successRate: '94.5%',
      full_name: 'company/web-api-gateway',
      html_url: 'https://github.com/company/web-api-gateway',
      stargazers_count: 234,
      forks_count: 45,
      open_issues_count: 8,
      updated_at: new Date().toISOString(),
      private: true
    },
    {
      status: 'Warning',
      repo: 'auth-service',
      language: 'Go',
      risk: '58',
      lastScan: '5 mins ago',
      vulnerabilities: 6,
      branch: 'main',
      color: 'yellow',
      description: 'Authentication microservice',
      uptime: '99.8%',
      messages: '12',
      incidents: '1',
      securityScore: '78',
      activeAlerts: 2,
      successRate: '98.2%',
      full_name: 'company/auth-service',
      html_url: 'https://github.com/company/auth-service',
      stargazers_count: 156,
      forks_count: 32,
      open_issues_count: 4,
      updated_at: new Date().toISOString(),
      private: true
    },
    {
      status: 'Healthy',
      repo: 'frontend-dashboard',
      language: 'React',
      risk: '22',
      lastScan: '10 mins ago',
      vulnerabilities: 0,
      branch: 'main',
      color: 'green',
      description: 'Main web dashboard',
      uptime: '99.9%',
      messages: '8',
      incidents: '0',
      securityScore: '94',
      activeAlerts: 0,
      successRate: '99.7%',
      full_name: 'company/frontend-dashboard',
      html_url: 'https://github.com/company/frontend-dashboard',
      stargazers_count: 89,
      forks_count: 23,
      open_issues_count: 2,
      updated_at: new Date().toISOString(),
      private: false
    },
    {
      status: 'Critical',
      repo: 'payment-processor',
      language: 'Python',
      risk: '92',
      lastScan: '1 min ago',
      vulnerabilities: 18,
      branch: 'main',
      color: 'red',
      description: 'Payment processing service',
      uptime: '98.5%',
      messages: '45',
      incidents: '7',
      securityScore: '45',
      activeAlerts: 8,
      successRate: '91.3%',
      full_name: 'company/payment-processor',
      html_url: 'https://github.com/company/payment-processor',
      stargazers_count: 312,
      forks_count: 67,
      open_issues_count: 15,
      updated_at: new Date().toISOString(),
      private: true
    },
    {
      status: 'Warning',
      repo: 'data-pipeline',
      language: 'Java',
      risk: '64',
      lastScan: '8 mins ago',
      vulnerabilities: 8,
      branch: 'develop',
      color: 'yellow',
      description: 'ETL data pipeline',
      uptime: '99.4%',
      messages: '18',
      incidents: '2',
      securityScore: '71',
      activeAlerts: 3,
      successRate: '96.8%',
      full_name: 'company/data-pipeline',
      html_url: 'https://github.com/company/data-pipeline',
      stargazers_count: 178,
      forks_count: 41,
      open_issues_count: 6,
      updated_at: new Date().toISOString(),
      private: true
    },
    {
      status: 'Healthy',
      repo: 'mobile-app',
      language: 'Swift',
      risk: '18',
      lastScan: '15 mins ago',
      vulnerabilities: 1,
      branch: 'main',
      color: 'green',
      description: 'iOS mobile application',
      uptime: '99.9%',
      messages: '5',
      incidents: '0',
      securityScore: '96',
      activeAlerts: 0,
      successRate: '99.8%',
      full_name: 'company/mobile-app',
      html_url: 'https://github.com/company/mobile-app',
      stargazers_count: 445,
      forks_count: 92,
      open_issues_count: 3,
      updated_at: new Date().toISOString(),
      private: false
    },
    {
      status: 'Warning',
      repo: 'notification-service',
      language: 'Node.js',
      risk: '52',
      lastScan: '12 mins ago',
      vulnerabilities: 4,
      branch: 'main',
      color: 'yellow',
      description: 'Real-time notification system',
      uptime: '99.6%',
      messages: '15',
      incidents: '1',
      securityScore: '82',
      activeAlerts: 1,
      successRate: '97.5%',
      full_name: 'company/notification-service',
      html_url: 'https://github.com/company/notification-service',
      stargazers_count: 98,
      forks_count: 28,
      open_issues_count: 5,
      updated_at: new Date().toISOString(),
      private: true
    },
    {
      status: 'Critical',
      repo: 'legacy-monolith',
      language: 'PHP',
      risk: '88',
      lastScan: '3 mins ago',
      vulnerabilities: 15,
      branch: 'master',
      color: 'red',
      description: 'Legacy core system',
      uptime: '97.8%',
      messages: '67',
      incidents: '12',
      securityScore: '38',
      activeAlerts: 10,
      successRate: '89.2%',
      full_name: 'company/legacy-monolith',
      html_url: 'https://github.com/company/legacy-monolith',
      stargazers_count: 12,
      forks_count: 8,
      open_issues_count: 23,
      updated_at: new Date().toISOString(),
      private: true
    },
    {
      status: 'Healthy',
      repo: 'cdn-manager',
      language: 'Rust',
      risk: '12',
      lastScan: '20 mins ago',
      vulnerabilities: 0,
      branch: 'main',
      color: 'green',
      description: 'CDN management service',
      uptime: '99.99%',
      messages: '3',
      incidents: '0',
      securityScore: '98',
      activeAlerts: 0,
      successRate: '99.9%',
      full_name: 'company/cdn-manager',
      html_url: 'https://github.com/company/cdn-manager',
      stargazers_count: 567,
      forks_count: 134,
      open_issues_count: 1,
      updated_at: new Date().toISOString(),
      private: false
    },
    {
      status: 'Warning',
      repo: 'analytics-engine',
      language: 'Scala',
      risk: '61',
      lastScan: '7 mins ago',
      vulnerabilities: 7,
      branch: 'develop',
      color: 'yellow',
      description: 'Real-time analytics processor',
      uptime: '99.3%',
      messages: '22',
      incidents: '2',
      securityScore: '74',
      activeAlerts: 3,
      successRate: '95.8%',
      full_name: 'company/analytics-engine',
      html_url: 'https://github.com/company/analytics-engine',
      stargazers_count: 203,
      forks_count: 56,
      open_issues_count: 9,
      updated_at: new Date().toISOString(),
      private: true
    },
    {
      status: 'Healthy',
      repo: 'docs-portal',
      language: 'Vue',
      risk: '15',
      lastScan: '18 mins ago',
      vulnerabilities: 0,
      branch: 'main',
      color: 'green',
      description: 'Documentation website',
      uptime: '99.95%',
      messages: '6',
      incidents: '0',
      securityScore: '97',
      activeAlerts: 0,
      successRate: '99.6%',
      full_name: 'company/docs-portal',
      html_url: 'https://github.com/company/docs-portal',
      stargazers_count: 145,
      forks_count: 67,
      open_issues_count: 2,
      updated_at: new Date().toISOString(),
      private: false
    },
    {
      status: 'Warning',
      repo: 'email-service',
      language: 'Ruby',
      risk: '55',
      lastScan: '9 mins ago',
      vulnerabilities: 5,
      branch: 'main',
      color: 'yellow',
      description: 'Email delivery service',
      uptime: '99.5%',
      messages: '19',
      incidents: '1',
      securityScore: '79',
      activeAlerts: 2,
      successRate: '96.3%',
      full_name: 'company/email-service',
      html_url: 'https://github.com/company/email-service',
      stargazers_count: 67,
      forks_count: 19,
      open_issues_count: 7,
      updated_at: new Date().toISOString(),
      private: true
    }
  ];

  useEffect(() => {
    // Simulate loading repos with animation
    setIsConnected(true);
    setLogin('control-center-user');

    const loadTimer = setTimeout(() => {
      // Add repos one by one for smooth animation
      MOCK_REPOS.forEach((repo, index) => {
        setTimeout(() => {
          setRows(prev => [...prev, repo]);
        }, index * 150);
      });
    }, 1500);

    return () => clearTimeout(loadTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGitHubConnect = () => {
    // Mockup - no action
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
    } catch (e) {
      const error = e as Error;
      setRepoError(error?.message || 'Failed to refresh repositories');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const scanAllRepositories = async (repos: SecurityRow[]) => {
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

  const runInitialScan = async (repos?: SecurityRow[]) => {
    const repositoriesToScan = repos || rows;
    console.log(`🚀 [Dashboard] Starting initial scan for all repositories`);
    await scanAllRepositories(repositoriesToScan);
  };

  const menuItems = useMemo(() => [
    { name: 'Dashboard', icon: Home, active: false },
    { name: 'Security Scans', icon: Shield, active: false },
    { name: 'Reports', icon: FileText, active: false },
    { name: 'Activity', icon: Activity, active: false }
  ], []);

  const bottomMenuItems = useMemo(() => [
    { name: 'Support', icon: HelpCircle },
    { name: 'Settings', icon: Settings }
  ], []);

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
                  onClick={() => {
                    if (item.name === 'Support') {
                      setShowSupportModal(true);
                    } else if (item.name === 'Settings') {
                      setShowSettingsModal(true);
                    }
                  }}
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
                    <div className="absolute right-0 mt-2 w-80 bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl backdrop-blur-xl z-[100] animate-modal-appear">
                      <div className="p-5 border-b border-zinc-800/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-white to-zinc-300 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-zinc-900 font-bold text-base">JD</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-base tracking-tight">John Doe</p>
                            <p className="text-zinc-400 text-sm truncate">john@company.com</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <button onClick={() => { setShowUserDropdown(false); setShowSettingsModal(true); }} className="w-full px-5 py-3 text-left text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 flex items-center gap-3 group">
                          <UserIcon className="w-4 h-4 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-all" />
                          <span className="text-sm font-medium">Profile Settings</span>
                        </button>
                        <button onClick={() => { setShowUserDropdown(false); setShowSettingsModal(true); }} className="w-full px-5 py-3 text-left text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 flex items-center gap-3 group">
                          <Settings className="w-4 h-4 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-all" />
                          <span className="text-sm font-medium">Account Settings</span>
                        </button>
                        <div className="border-t border-zinc-800/50 my-2"></div>
                        <button onClick={() => navigate('/')} className="w-full px-5 py-3 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 flex items-center gap-3 group">
                          <LogOut className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all" />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 pt-24">
          {/* Dashboard View */}
          {activeMenuItem === 'Dashboard' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Security Dashboard</h1>
                <p className="text-zinc-400 text-base">Comprehensive threat detection and vulnerability analysis for your repositories.</p>
              </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
              <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2">Total Vulnerabilities</p>
              {isScanning || !hasInitialScanned ? (
                <div className="flex flex-col items-center justify-center gap-2 h-20">
                  <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                  <p className="text-zinc-400 text-xs">Loading...</p>
                </div>
              ) : (
                <p className="text-white text-2xl font-bold mb-2">{metrics.totalVulnerabilities}</p>
              )}
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
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
              <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2">Repositories</p>
              {isScanning || !hasInitialScanned ? (
                <div className="flex flex-col items-center justify-center gap-2 h-20">
                  <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                  <p className="text-zinc-400 text-xs">Loading...</p>
                </div>
              ) : (
                <p className="text-white text-2xl font-bold mb-2">{metrics.scannedRepos}/{metrics.totalRepos}</p>
              )}
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
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
              <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2">Avg Risk Score</p>
              {isScanning || !hasInitialScanned ? (
                <div className="flex flex-col items-center justify-center gap-2 h-20">
                  <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                  <p className="text-zinc-400 text-xs">Loading...</p>
                </div>
              ) : (
                <p className="text-white text-2xl font-bold mb-2">{metrics.avgRiskScore}/100</p>
              )}
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
            <div className="bg-zinc-900/30 border border-red-900/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
              <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2 flex items-center gap-2">
                <span>Critical Issues</span>
                {!isScanning && hasInitialScanned && metrics.criticalVulnerabilities > 0 && (
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-critical-pulse"></span>
                )}
              </p>
              {isScanning || !hasInitialScanned ? (
                <div className="flex flex-col items-center justify-center gap-2 h-20">
                  <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                  <p className="text-zinc-400 text-xs">Loading...</p>
                </div>
              ) : (
                <p className="text-white text-2xl font-bold mb-2">{metrics.criticalVulnerabilities}</p>
              )}
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
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
              <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2">High Severity</p>
              {isScanning || !hasInitialScanned ? (
                <div className="flex flex-col items-center justify-center gap-2 h-20">
                  <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                  <p className="text-zinc-400 text-xs">Loading...</p>
                </div>
              ) : (
                <p className="text-white text-2xl font-bold mb-2">{metrics.highVulnerabilities}</p>
              )}
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

          <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden mb-8 animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
            <div className="p-6 border-b border-zinc-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-zinc-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Recent Scans</h2>
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

          <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
            <div className="p-6 border-b border-zinc-800/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white tracking-tight">Repository Security Status</h2>
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
                    placeholder="Search repositories by name, language, or status"
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
                      <p className="text-yellow-400 font-medium">Authentication Required</p>
                      <p className="text-zinc-400 text-sm">Connect your GitHub account to begin security monitoring.</p>
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

            <div className="overflow-x-auto relative">
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-8 animate-scan-line"></div>
                </div>
              )}
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
                  {filteredRows.map((repo, index) => (
                    <tr
                      key={repo.full_name}
                      className="border-b border-zinc-800/20 hover:bg-zinc-800/30 hover:border-zinc-700/50 transition-all duration-300 cursor-pointer animate-fadeIn group"
                      style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                      onClick={() => handleRowClick(repo)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${repo.color === 'red' ? 'bg-red-400 animate-critical-pulse' : repo.color === 'yellow' ? 'bg-yellow-400' : repo.color === 'green' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                          <span className={`text-sm font-medium ${repo.color === 'red' ? 'text-red-400' : repo.color === 'yellow' ? 'text-yellow-400' : repo.color === 'green' ? 'text-green-400' : 'text-gray-400'}`}>{repo.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white font-medium group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300">{repo.repo}</div>
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
                            className="bg-zinc-800/50 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] text-zinc-300 hover:text-zinc-900 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700/50 hover:border-white"
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
              <p className="text-zinc-400 text-sm text-center">
                Security analysis detected <span className="text-white font-semibold">{filteredRows.reduce((sum, repo) => sum + repo.vulnerabilities, 0)} vulnerabilities</span> across {filteredRows.length} monitored repositories
              </p>
            </div>
          </div>

          {showDrawer && selectedRepo && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-backdrop-fade" onClick={closeDrawer}></div>
              <div className="absolute right-0 top-0 h-full w-[600px] bg-zinc-900/95 border-l border-zinc-800/50 backdrop-blur-md overflow-y-auto animate-modal-appear">
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
                      className="px-4 py-2 bg-zinc-800/50 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] text-zinc-300 hover:text-zinc-900 rounded-md text-sm font-medium transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700/50 hover:border-white"
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

          {/* Support Modal */}
          {showSupportModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-fade" onClick={() => setShowSupportModal(false)}></div>
              <div className="relative bg-zinc-900 border border-zinc-800/50 rounded-lg shadow-2xl w-full max-w-md p-6 m-4 animate-modal-appear">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">Support Center</h2>
                  <button onClick={() => setShowSupportModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">
                    Need assistance with RaijinGuard? Our security team is here to help.
                  </p>
                  <div className="space-y-3">
                    <a href="#" onClick={(e) => e.preventDefault()} className="block p-3 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-700/30">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-zinc-400" />
                        <div>
                          <div className="text-white font-medium text-sm">Documentation</div>
                          <div className="text-zinc-400 text-xs">Browse our security guides</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="block p-3 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-700/30">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-zinc-400" />
                        <div>
                          <div className="text-white font-medium text-sm">Report Issue</div>
                          <div className="text-zinc-400 text-xs">Submit a security concern</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/50">
                    <p className="text-zinc-500 text-xs">
                      Email: <span className="text-white">security@raijinguard.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettingsModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-fade" onClick={() => setShowSettingsModal(false)}></div>
              <div className="relative bg-zinc-900 border border-zinc-800/50 rounded-lg shadow-2xl w-full max-w-md p-6 m-4 animate-modal-appear">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
                  <button onClick={() => setShowSettingsModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Security Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all duration-300 gap-4">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">Auto-scan new repositories</div>
                          <div className="text-zinc-400 text-xs mt-1">Automatically scan when repos are added</div>
                        </div>
                        <div className="flex-shrink-0">
                          <input 
                            type="checkbox" 
                            defaultChecked 
                            className="w-5 h-5 rounded bg-zinc-700/50 border-2 border-zinc-600 checked:bg-white checked:border-white appearance-none cursor-pointer relative transition-all duration-300 ease-out hover:border-zinc-500 checked:hover:bg-zinc-200 checked:hover:border-zinc-200 after:content-[''] after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDRMNC41IDcuNUwxMSAxIiBzdHJva2U9IiMxODE4MWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] after:bg-center after:bg-no-repeat after:opacity-0 checked:after:opacity-100 after:transition-opacity after:duration-200" 
                          />
                        </div>
                      </label>
                      <label className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all duration-300 gap-4">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">Security notifications</div>
                          <div className="text-zinc-400 text-xs mt-1">Receive alerts for critical issues</div>
                        </div>
                        <div className="flex-shrink-0">
                          <input 
                            type="checkbox" 
                            defaultChecked 
                            className="w-5 h-5 rounded bg-zinc-700/50 border-2 border-zinc-600 checked:bg-white checked:border-white appearance-none cursor-pointer relative transition-all duration-300 ease-out hover:border-zinc-500 checked:hover:bg-zinc-200 checked:hover:border-zinc-200 after:content-[''] after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDRMNC41IDcuNUwxMSAxIiBzdHJva2U9IiMxODE4MWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] after:bg-center after:bg-no-repeat after:opacity-0 checked:after:opacity-100 after:transition-opacity after:duration-200" 
                          />
                        </div>
                      </label>
                      <label className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all duration-300 gap-4">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">Weekly reports</div>
                          <div className="text-zinc-400 text-xs mt-1">Email summary of security status</div>
                        </div>
                        <div className="flex-shrink-0">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded bg-zinc-700/50 border-2 border-zinc-600 checked:bg-white checked:border-white appearance-none cursor-pointer relative transition-all duration-300 ease-out hover:border-zinc-500 checked:hover:bg-zinc-200 checked:hover:border-zinc-200 after:content-[''] after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDRMNC41IDcuNUwxMSAxIiBzdHJva2U9IiMxODE4MWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] after:bg-center after:bg-no-repeat after:opacity-0 checked:after:opacity-100 after:transition-opacity after:duration-200" 
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/50">
                    <button onClick={() => setShowSettingsModal(false)} className="w-full bg-white text-zinc-900 py-2 px-4 rounded-lg font-medium hover:bg-zinc-100 transition-colors text-sm">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
          )}

          {/* Security Scans View */}
          {activeMenuItem === 'Security Scans' && (
            <div className="animate-slide-up-fade">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Security Scans</h1>
                <p className="text-zinc-400 text-base">Active vulnerability scanning and threat detection operations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-6 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isScanning ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                      {isScanning ? 'SCANNING' : 'READY'}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Active Scans</h3>
                  <p className="text-4xl font-bold text-white mb-2">{scanningRepos.size}</p>
                  <p className="text-zinc-400 text-sm">Currently running</p>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-6 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Completed Today</h3>
                  <p className="text-4xl font-bold text-white mb-2">{hasInitialScanned ? rows.length : 0}</p>
                  <p className="text-zinc-400 text-sm">Successful scans</p>
                </div>

                <div className="bg-zinc-900/30 border border-red-900/30 rounded-lg p-6 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    {metrics.criticalVulnerabilities > 0 && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-critical-pulse"></div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Threats Detected</h3>
                  <p className="text-4xl font-bold text-red-400 mb-2">{metrics.criticalVulnerabilities}</p>
                  <p className="text-zinc-400 text-sm">Critical issues found</p>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden mb-8 animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
                <div className="p-6 border-b border-zinc-800/30">
                  <h2 className="text-xl font-bold text-white tracking-tight">Scan Queue</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {rows.slice(0, 5).map((repo, index) => (
                      <div key={repo.full_name} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${scanningRepos.has(repo.full_name) ? 'bg-yellow-500/20' : 'bg-zinc-700/50'}`}>
                            <Shield className={`w-5 h-5 ${scanningRepos.has(repo.full_name) ? 'text-yellow-400' : 'text-zinc-400'}`} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{repo.repo}</p>
                            <p className="text-zinc-400 text-sm">{repo.full_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-zinc-400 text-sm">Last scan</p>
                            <p className="text-white text-sm font-medium">{repo.lastScan}</p>
                          </div>
                          {scanningRepos.has(repo.full_name) ? (
                            <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <button 
                              onClick={() => scanSingleRepository(repo.full_name)}
                              className="px-4 py-2 bg-zinc-800/50 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] text-zinc-300 hover:text-zinc-900 rounded-md text-sm font-medium transition-all duration-300 ease-out border border-zinc-700/50 hover:border-white"
                            >
                              Scan Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports View */}
          {activeMenuItem === 'Reports' && (
            <div className="animate-slide-up-fade">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Security Reports</h1>
                <p className="text-zinc-400 text-base">Comprehensive vulnerability analysis and intelligence reports.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-6 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-white" />
                      <h3 className="text-white font-semibold text-lg">Vulnerability Summary</h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Critical</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: `${(metrics.criticalVulnerabilities / metrics.totalVulnerabilities) * 100}%` }}></div>
                        </div>
                        <span className="text-red-400 font-bold w-8 text-right">{metrics.criticalVulnerabilities}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">High</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500" style={{ width: `${(metrics.highVulnerabilities / metrics.totalVulnerabilities) * 100}%` }}></div>
                        </div>
                        <span className="text-orange-400 font-bold w-8 text-right">{metrics.highVulnerabilities}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Medium</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: `${(metrics.mediumVulnerabilities / metrics.totalVulnerabilities) * 100}%` }}></div>
                        </div>
                        <span className="text-yellow-400 font-bold w-8 text-right">{metrics.mediumVulnerabilities}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Low</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${(metrics.lowVulnerabilities / metrics.totalVulnerabilities) * 100}%` }}></div>
                        </div>
                        <span className="text-green-400 font-bold w-8 text-right">{metrics.lowVulnerabilities}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-6 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-white" />
                    <h3 className="text-white font-semibold text-lg">Repository Health</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <span className="text-zinc-300">Healthy</span>
                      <span className="text-green-400 font-bold text-xl">{metrics.healthyRepos}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <span className="text-zinc-300">Critical</span>
                      <span className="text-red-400 font-bold text-xl">{metrics.criticalRepos}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-700/20 rounded-lg border border-zinc-700/30">
                      <span className="text-zinc-300">Total Repositories</span>
                      <span className="text-white font-bold text-xl">{metrics.totalRepos}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
                <div className="p-6 border-b border-zinc-800/30">
                  <h2 className="text-xl font-bold text-white tracking-tight">Generated Reports</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { name: 'Weekly Security Digest', date: 'Nov 9, 2025', type: 'Summary', severity: 'info' },
                      { name: 'Critical Vulnerabilities Report', date: 'Nov 8, 2025', type: 'Alert', severity: 'critical' },
                      { name: 'Dependency Analysis', date: 'Nov 7, 2025', type: 'Analysis', severity: 'info' },
                      { name: 'Compliance Audit', date: 'Nov 6, 2025', type: 'Audit', severity: 'warning' },
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            report.severity === 'critical' ? 'bg-red-500/20' :
                            report.severity === 'warning' ? 'bg-yellow-500/20' :
                            'bg-zinc-700/50'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              report.severity === 'critical' ? 'text-red-400' :
                              report.severity === 'warning' ? 'text-yellow-400' :
                              'text-zinc-400'
                            }`} />
                          </div>
                          <div>
                            <p className="text-white font-medium group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all">{report.name}</p>
                            <p className="text-zinc-400 text-sm">{report.type} • {report.date}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-zinc-800/50 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] text-zinc-300 hover:text-zinc-900 rounded-md text-sm font-medium transition-all duration-300 ease-out border border-zinc-700/50 hover:border-white">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity View */}
          {activeMenuItem === 'Activity' && (
            <div className="animate-slide-up-fade">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Activity Log</h1>
                <p className="text-zinc-400 text-base">Real-time monitoring and audit trail of all security operations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2">Events Today</p>
                  <p className="text-white text-3xl font-bold">{hasInitialScanned ? rows.length * 3 : 0}</p>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2">Active Users</p>
                  <p className="text-white text-3xl font-bold">1</p>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2">API Calls</p>
                  <p className="text-white text-3xl font-bold">{hasInitialScanned ? rows.length * 5 : 0}</p>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 backdrop-blur-sm animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-2">Alerts Sent</p>
                  <p className="text-white text-3xl font-bold">{metrics.criticalVulnerabilities}</p>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg backdrop-blur-sm overflow-hidden animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
                <div className="p-6 border-b border-zinc-800/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-medium">Live</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { action: 'Security scan completed', repo: rows[0]?.repo || 'repository-1', time: '2 minutes ago', type: 'scan', severity: 'success' },
                      { action: 'Critical vulnerability detected', repo: rows[1]?.repo || 'repository-2', time: '15 minutes ago', type: 'alert', severity: 'critical' },
                      { action: 'User authenticated', repo: 'GitHub OAuth', time: '1 hour ago', type: 'auth', severity: 'info' },
                      { action: 'Repository added', repo: rows[2]?.repo || 'repository-3', time: '2 hours ago', type: 'repo', severity: 'info' },
                      { action: 'Scan initiated', repo: rows[3]?.repo || 'repository-4', time: '3 hours ago', type: 'scan', severity: 'info' },
                      { action: 'Report generated', repo: 'Weekly Summary', time: '5 hours ago', type: 'report', severity: 'success' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-zinc-800/20 rounded-lg border border-zinc-700/30 hover:bg-zinc-800/30 transition-all duration-300">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          activity.severity === 'critical' ? 'bg-red-500/20' :
                          activity.severity === 'success' ? 'bg-green-500/20' :
                          'bg-zinc-700/50'
                        }`}>
                          {activity.type === 'scan' && <Shield className={`w-5 h-5 ${activity.severity === 'success' ? 'text-green-400' : 'text-zinc-400'}`} />}
                          {activity.type === 'alert' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                          {activity.type === 'auth' && <UserIcon className="w-5 h-5 text-zinc-400" />}
                          {activity.type === 'repo' && <Github className="w-5 h-5 text-zinc-400" />}
                          {activity.type === 'report' && <FileText className="w-5 h-5 text-green-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-zinc-400 text-sm truncate">{activity.repo}</p>
                        </div>
                        <span className="text-zinc-500 text-sm whitespace-nowrap">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support Modal */}
          {showSupportModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-fade" onClick={() => setShowSupportModal(false)}></div>
              <div className="relative bg-zinc-900 border border-zinc-800/50 rounded-lg shadow-2xl w-full max-w-md p-6 m-4 animate-modal-appear">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">Support Center</h2>
                  <button onClick={() => setShowSupportModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">
                    Need assistance with RaijinGuard? Our security team is here to help.
                  </p>
                  <div className="space-y-3">
                    <a href="#" onClick={(e) => e.preventDefault()} className="block p-3 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-700/30">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-zinc-400" />
                        <div>
                          <div className="text-white font-medium text-sm">Documentation</div>
                          <div className="text-zinc-400 text-xs">Browse our security guides</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="block p-3 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-700/30">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-zinc-400" />
                        <div>
                          <div className="text-white font-medium text-sm">Report Issue</div>
                          <div className="text-zinc-400 text-xs">Submit a security concern</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/50">
                    <p className="text-zinc-500 text-xs">
                      Email: <span className="text-white">security@raijinguard.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettingsModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-fade" onClick={() => setShowSettingsModal(false)}></div>
              <div className="relative bg-zinc-900 border border-zinc-800/50 rounded-lg shadow-2xl w-full max-w-md p-6 m-4 animate-modal-appear">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
                  <button onClick={() => setShowSettingsModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Security Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all duration-300 gap-4">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">Auto-scan new repositories</div>
                          <div className="text-zinc-400 text-xs mt-1">Automatically scan when repos are added</div>
                        </div>
                        <div className="flex-shrink-0">
                          <input 
                            type="checkbox" 
                            defaultChecked 
                            className="w-5 h-5 rounded bg-zinc-700/50 border-2 border-zinc-600 checked:bg-white checked:border-white appearance-none cursor-pointer relative transition-all duration-300 ease-out hover:border-zinc-500 checked:hover:bg-zinc-200 checked:hover:border-zinc-200 after:content-[''] after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDRMNC41IDcuNUwxMSAxIiBzdHJva2U9IiMxODE4MWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] after:bg-center after:bg-no-repeat after:opacity-0 checked:after:opacity-100 after:transition-opacity after:duration-200" 
                          />
                        </div>
                      </label>
                      <label className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all duration-300 gap-4">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">Security notifications</div>
                          <div className="text-zinc-400 text-xs mt-1">Receive alerts for critical issues</div>
                        </div>
                        <div className="flex-shrink-0">
                          <input 
                            type="checkbox" 
                            defaultChecked 
                            className="w-5 h-5 rounded bg-zinc-700/50 border-2 border-zinc-600 checked:bg-white checked:border-white appearance-none cursor-pointer relative transition-all duration-300 ease-out hover:border-zinc-500 checked:hover:bg-zinc-200 checked:hover:border-zinc-200 after:content-[''] after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDRMNC41IDcuNUwxMSAxIiBzdHJva2U9IiMxODE4MWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] after:bg-center after:bg-no-repeat after:opacity-0 checked:after:opacity-100 after:transition-opacity after:duration-200" 
                          />
                        </div>
                      </label>
                      <label className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all duration-300 gap-4">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">Weekly reports</div>
                          <div className="text-zinc-400 text-xs mt-1">Email summary of security status</div>
                        </div>
                        <div className="flex-shrink-0">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded bg-zinc-700/50 border-2 border-zinc-600 checked:bg-white checked:border-white appearance-none cursor-pointer relative transition-all duration-300 ease-out hover:border-zinc-500 checked:hover:bg-zinc-200 checked:hover:border-zinc-200 after:content-[''] after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDRMNC41IDcuNUwxMSAxIiBzdHJva2U9IiMxODE4MWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] after:bg-center after:bg-no-repeat after:opacity-0 checked:after:opacity-100 after:transition-opacity after:duration-200" 
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/50">
                    <button onClick={() => setShowSettingsModal(false)} className="w-full bg-white text-zinc-900 py-2 px-4 rounded-lg font-medium hover:bg-zinc-100 transition-colors text-sm">
                      Save Changes
                    </button>
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
