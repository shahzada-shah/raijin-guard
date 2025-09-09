const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  private: boolean;
  default_branch: string;
}

class GitHubApiService {
  async getRepositories(): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/github/repos`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const repos = await response.json();
        console.log('Repository names:', repos.map((repo: GitHubRepository) => repo.name));
        return repos;
      }
      return [];
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  }
}

export const githubApiService = new GitHubApiService();
