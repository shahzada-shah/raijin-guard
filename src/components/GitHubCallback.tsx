import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { githubAuthServer } from '../services/githubAuthServer';

export default function GitHubCallback() {
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const p = new URLSearchParams(window.location.search);
      const code = p.get('code');
      const state = p.get('state');
      if (!code || !state) { setErr('Missing code/state'); return; }
      try {
        await githubAuthServer.handleCallback(code, state);
        navigate('/user-dashboard', { replace: true });
      } catch (e: any) {
        setErr(e?.message || 'OAuth failed');
      }
    })();
  }, [navigate]);

  return (
    <div style={{ color: '#fff', padding: 16 }}>
      Completing sign-in... {err && <span style={{ color: '#f66' }}>OAuth callback failed: {err}</span>}
    </div>
  );
}