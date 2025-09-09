import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-session-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/auth/status', (req, res) => {
  res.json({
    connected: !!req.session.githubToken,
    login: req.session.githubUser?.login || null
  });
});

app.get('/api/auth/github/login', (req, res) => {
  const state = Math.random().toString(36).slice(2);
  req.session.oauthState = state;
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_REDIRECT_URI,
    scope: 'read:user user:email',
    state
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

app.post('/api/auth/github/callback', async (req, res) => {
  try {
    const { code, state } = req.body || {};
    if (!code || !state) return res.status(400).json({ error: 'Missing code/state' });
    if (!req.session.oauthState || state !== req.session.oauthState) {
      return res.status(400).json({ error: 'Invalid state' });
    }
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI
      })
    });
    const data = await r.json();
    if (!data.access_token) return res.status(400).json({ error: 'Token exchange failed' });
    req.session.githubToken = data.access_token;
    req.session.oauthState = null;

    const u = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${req.session.githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'RaijinGuard'
      }
    });
    if (u.ok) req.session.githubUser = await u.json();

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/github/user', async (req, res) => {
  if (!req.session.githubToken) return res.status(401).json({ error: 'Not authenticated' });
  const r = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${req.session.githubToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RaijinGuard'
    }
  });
  if (!r.ok) return res.status(500).json({ error: 'Failed to fetch user' });
  res.json(await r.json());
});

app.get('/api/github/repos', async (req, res) => {
  if (!req.session.githubToken) return res.status(401).json({ error: 'Not connected to GitHub' });

  if (!req.session.githubUser) {
    const u = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${req.session.githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'RaijinGuard'
      }
    });
    if (!u.ok) return res.status(500).json({ error: 'Failed to fetch user' });
    req.session.githubUser = await u.json();
  }

  const login = req.session.githubUser.login;
  const url = new URL(`https://api.github.com/users/${login}/repos`);
  url.searchParams.set('per_page', '100');
  url.searchParams.set('type', 'owner');
  url.searchParams.set('sort', 'updated');
  url.searchParams.set('direction', 'desc');

  const r = await fetch(url, {
    headers: {
      Authorization: `Bearer ${req.session.githubToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RaijinGuard'
    }
  });
  if (!r.ok) return res.status(500).json({ error: 'Failed to fetch public repos' });
  res.json(await r.json());
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.listen(PORT, () => {
  console.log(`OAuth server on http://localhost:${PORT}`);
});