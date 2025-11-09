/**
 * RaijinGuard - GitHub Authentication Service (Server-Side)
 * 
 * Handles GitHub OAuth 2.0 authentication flow with the backend API server.
 * Manages user authentication state, token handling, and logout operations.
 * 
 * @module GitHubAuthServer
 * @see {@link https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps | GitHub OAuth Documentation}
 */

/**
 * GitHubAuthServerService Class
 * 
 * Provides methods for initiating OAuth flow, handling callbacks,
 * checking authentication status, and logging out users.
 */
export class GitHubAuthServerService {
  /** Base URL for the backend API server */
  private readonly apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  /**
   * Initiates the GitHub OAuth authentication flow
   * Redirects user to the backend OAuth endpoint which then redirects to GitHub
   * 
   * @example
   * ```typescript
   * githubAuthServer.initiateAuth();
   * // User is redirected to GitHub OAuth consent page
   * ```
   */
  initiateAuth(): void {
    window.location.href = `${this.apiBase}/api/auth/github/login`;
  }

  /**
   * Handles the OAuth callback after GitHub authentication
   * Exchanges the authorization code for an access token via the backend
   * 
   * @param code - Authorization code from GitHub OAuth
   * @param state - CSRF protection state parameter
   * @throws {Error} When the callback fails or authentication is rejected
   * 
   * @example
   * ```typescript
   * await githubAuthServer.handleCallback(code, state);
   * ```
   */
  async handleCallback(code: string, state: string): Promise<void> {
    const response = await fetch(`${this.apiBase}/api/auth/github/callback`, {
      method: 'POST',
      credentials: 'include', // Include cookies for session management
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error || response.statusText);
    }
  }

  /**
   * Checks the current authentication status
   * Retrieves whether the user is connected and their GitHub login
   * 
   * @returns Promise resolving to authentication status with login information
   * 
   * @example
   * ```typescript
   * const { connected, login } = await githubAuthServer.status();
   * if (connected) {
   *   console.log(`Logged in as: ${login}`);
   * }
   * ```
   */
  async status(): Promise<{ connected: boolean; login: string | null }> {
    const response = await fetch(`${this.apiBase}/api/auth/status`, { 
      credentials: 'include' 
    });
    return response.json();
  }

  /**
   * Logs out the current user
   * Clears the authentication session on the backend
   * 
   * @example
   * ```typescript
   * await githubAuthServer.logout();
   * // User is logged out, session cleared
   * ```
   */
  async logout(): Promise<void> {
    await fetch(`${this.apiBase}/api/auth/logout`, { 
      method: 'POST', 
      credentials: 'include' 
    });
  }
}

/** Singleton instance of GitHubAuthServerService for use throughout the app */
export const githubAuthServer = new GitHubAuthServerService();