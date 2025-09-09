export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  default_branch: string;
  updated_at: string;
  created_at: string;
  size: number;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  archived: boolean;
  disabled: boolean;
  topics?: string[];
}

export interface RepositorySecurityData {
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
}

class GitHubApiServerService {
  private readonly apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  async getUserRepositories(): Promise<GitHubRepository[]> {
    const r = await fetch(`${this.apiBase}/api/github/repos`, { credentials: 'include' });
    if (r.status === 401) throw new Error('Not connected to GitHub');
    if (!r.ok) throw new Error('Failed to fetch repositories');
    return r.json();
  }

  transformToSecurityData(repos: GitHubRepository[]): RepositorySecurityData[] {
    return repos.map((repo) => {
      // Start with basic repo data - security data will be updated after scanning
      return {
        status: 'Healthy' as const,
        repo: repo.name,
        language: repo.language || 'Unknown',
        risk: '0%', // Will be updated after scan
        lastScan: 'Never scanned',
        vulnerabilities: 0, // Will be updated after scan
        branch: repo.default_branch,
        color: 'green' as const,
        description: repo.description || 'No description',
        uptime: '99.9%',
        messages: '0',
        incidents: '0',
        securityScore: 'Not scanned',
        activeAlerts: 0,
        successRate: '99.9%',
        full_name: repo.full_name,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        updated_at: repo.updated_at,
        private: repo.private
      };
    });
  }
}

export const githubApiServer = new GitHubApiServerService();