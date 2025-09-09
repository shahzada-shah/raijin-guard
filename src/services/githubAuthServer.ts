export class GitHubAuthServerService {
  private readonly apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  initiateAuth(): void {
    window.location.href = `${this.apiBase}/api/auth/github/login`;
  }

  async handleCallback(code: string, state: string): Promise<void> {
    const r = await fetch(`${this.apiBase}/api/auth/github/callback`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state })
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e?.error || r.statusText);
    }
  }

  async status(): Promise<{ connected: boolean; login: string | null }> {
    const r = await fetch(`${this.apiBase}/api/auth/status`, { credentials: 'include' });
    return r.json();
  }

  async logout(): Promise<void> {
    await fetch(`${this.apiBase}/api/auth/logout`, { method: 'POST', credentials: 'include' });
  }
}

export const githubAuthServer = new GitHubAuthServerService();