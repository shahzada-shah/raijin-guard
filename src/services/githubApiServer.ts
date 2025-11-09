/**
 * RaijinGuard - GitHub API Service
 * 
 * Handles communication with the GitHub REST API via the backend server.
 * Fetches repository data and transforms it for security analysis.
 * 
 * @module GitHubApiServer
 * @see {@link https://docs.github.com/en/rest | GitHub REST API Documentation}
 */

/**
 * GitHub Repository Interface
 * Complete data structure returned from GitHub API
 */
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

/**
 * Repository Security Data Interface
 * Enhanced repository data structure with security information
 */
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

/**
 * GitHubApiServerService Class
 * 
 * Provides methods for fetching GitHub repositories and transforming
 * the data into a format suitable for security analysis.
 */
class GitHubApiServerService {
  /** Base URL for the backend API server */
  private readonly apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  /**
   * Fetches all repositories for the authenticated GitHub user
   * 
   * @returns Promise resolving to an array of GitHub repositories
   * @throws {Error} When not authenticated (401) or fetch fails
   * 
   * @example
   * ```typescript
   * const repos = await githubApiServer.getUserRepositories();
   * console.log(`Found ${repos.length} repositories`);
   * ```
   */
  async getUserRepositories(): Promise<GitHubRepository[]> {
    const response = await fetch(`${this.apiBase}/api/github/repos`, { 
      credentials: 'include' 
    });

    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Not connected to GitHub');
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    return response.json();
  }

  /**
   * Transforms GitHub repository data into security-ready format
   * 
   * Converts raw GitHub API data into a structure suitable for security
   * scanning and dashboard display. Initial security values are placeholders
   * that will be updated after vulnerability scanning.
   * 
   * @param repos - Array of GitHub repositories to transform
   * @returns Array of RepositorySecurityData objects
   * 
   * @example
   * ```typescript
   * const repos = await githubApiServer.getUserRepositories();
   * const securityData = githubApiServer.transformToSecurityData(repos);
   * // Now ready for security scanning
   * ```
   */
  transformToSecurityData(repos: GitHubRepository[]): RepositorySecurityData[] {
    return repos.map((repo) => {
      // Initialize with default security values
      // These will be updated after running security scans
      return {
        status: 'Healthy' as const,
        repo: repo.name,
        language: repo.language || 'Unknown',
        risk: '0%', // Updated after scan
        lastScan: 'Never scanned',
        vulnerabilities: 0, // Updated after scan
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

/** Singleton instance of GitHubApiServerService for use throughout the app */
export const githubApiServer = new GitHubApiServerService();