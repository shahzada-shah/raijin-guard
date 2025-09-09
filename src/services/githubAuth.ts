const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  html_url: string;
}

export interface AuthStatus {
  connected: boolean;
  token?: string;
}

class GitHubAuthService {
  async getAuthStatus(): Promise<AuthStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        return await response.json();
      }
      return { connected: false };
    } catch (error) {
      console.error('Error checking auth status:', error);
      return { connected: false };
    }
  }

  async login(): Promise<void> {
    window.location.href = `${API_BASE_URL}/api/auth/github/login`;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async getUser(): Promise<GitHubUser | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/github/user`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
}

export const githubAuthService = new GitHubAuthService();
