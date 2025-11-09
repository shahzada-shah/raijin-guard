import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { githubAuthServer } from '../services/githubAuthServer';

export default function GitHubCallback() {
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Completing sign-in...');

  useEffect(() => {
    (async () => {
      try {
        setStatus('Verifying authentication...');
        
        // Check if we're authenticated by checking the auth status
        const authStatus = await githubAuthServer.status();
        
        if (authStatus.connected) {
          setStatus('Authentication successful! Redirecting...');
          // Small delay to show success message
          setTimeout(() => {
            navigate('/user-dashboard', { replace: true });
          }, 1000);
        } else {
          setErr('Authentication failed - not connected');
        }
      } catch (e) {
        console.error('OAuth callback error:', e);
        const error = e as Error;
        setErr(error?.message || 'OAuth failed');
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-lg mb-4">{status}</div>
        {err && (
          <div className="text-red-400 mb-4">
            OAuth callback failed: {err}
          </div>
        )}
        <div className="text-zinc-400 text-sm">
          If you're not redirected automatically, 
          <button 
            onClick={() => navigate('/user-dashboard')} 
            className="text-blue-400 hover:text-blue-300 underline ml-1"
          >
            click here
          </button>
        </div>
      </div>
    </div>
  );
}