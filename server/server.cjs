const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const nodePath = require('path');

dotenv.config({ path: nodePath.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Loaded envs:', {
  PORT: process.env.PORT,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? '(set)' : '(missing)',
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI || '(missing)',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '(set)' : '(missing)'
});

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
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;
  const params = new URLSearchParams({
    client_id: clientId || '',
    redirect_uri: redirectUri || '',
    scope: 'read:user user:email',
    state
  });
  const authorizeUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  console.log('Redirecting to GitHub:', authorizeUrl);
  res.redirect(authorizeUrl);
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
    if (!data.access_token) {
      console.error('Token exchange failed:', data);
      return res.status(400).json({ error: 'Token exchange failed' });
    }
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
    console.error('Callback error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET handler for GitHub OAuth callback (when GitHub redirects back)
app.get('/api/auth/github/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.status(400).send('Missing code/state');
    if (!req.session.oauthState || state !== req.session.oauthState) {
      return res.status(400).send('Invalid state');
    }

    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI
      })
    });

    const data = await tokenResp.json();
    if (!data.access_token) {
      console.error('Token exchange failed:', data);
      return res.status(400).send('Token exchange failed');
    }

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

    // Redirect back to frontend dashboard with success
    res.redirect('http://localhost:5173/user-dashboard?auth=success');
  } catch (e) {
    console.error('Callback error:', e);
    res.status(500).send('Server error');
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

app.get('/api/github/security-alerts/:owner/:repo', async (req, res) => {
  if (!req.session.githubToken) return res.status(401).json({ error: 'Not authenticated' });
  const { owner, repo } = req.params;
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/dependabot/alerts`, {
      headers: {
        Authorization: `Bearer ${req.session.githubToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'RaijinGuard'
      }
    });
    if (!r.ok) return res.status(500).json({ error: 'Failed to fetch security alerts' });
    res.json(await r.json());
  } catch (e) {
    console.error('Security alerts error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/github/secret-scanning/:owner/:repo', async (req, res) => {
  if (!req.session.githubToken) return res.status(401).json({ error: 'Not authenticated' });
  const { owner, repo } = req.params;
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/secret-scanning/alerts`, {
      headers: {
        Authorization: `Bearer ${req.session.githubToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'RaijinGuard'
      }
    });
    if (!r.ok) return res.status(500).json({ error: 'Failed to fetch secret scanning alerts' });
    res.json(await r.json());
  } catch (e) {
    console.error('Secret scanning error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/github/repos/:owner/:repo/contents', async (req, res) => {
  if (!req.session.githubToken) return res.status(401).json({ error: 'Not authenticated' });
  const { owner, repo } = req.params;
  const filePath = typeof req.query.path === 'string' ? req.query.path : '';
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${req.session.githubToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'RaijinGuard'
      }
    });
    if (!r.ok) return res.status(500).json({ error: 'Failed to fetch repository contents' });
    res.json(await r.json());
  } catch (e) {
    console.error('Repository contents error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/security/scan/:owner/:repo', async (req, res) => {
  if (!req.session.githubToken) return res.status(401).json({ error: 'Not authenticated' });
  const { owner, repo } = req.params;
  try {
    const [dependabotAlerts, secretAlerts] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repo}/dependabot/alerts`, {
        headers: {
          Authorization: `Bearer ${req.session.githubToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'RaijinGuard'
        }
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/secret-scanning/alerts`, {
        headers: {
          Authorization: `Bearer ${req.session.githubToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'RaijinGuard'
        }
      })
    ]);

    const vulnerabilities = [];
    let totalVulnerabilities = 0;
    let critical = 0, high = 0, medium = 0, low = 0, info = 0;

    if (dependabotAlerts.status === 'fulfilled' && dependabotAlerts.value.ok) {
      const alerts = await dependabotAlerts.value.json();
      alerts.forEach(alert => {
        const severity = alert.security_advisory?.severity || 'medium';
        const severityMap = { 'critical': 'Critical', 'high': 'High', 'moderate': 'Medium', 'low': 'Low' };
        const mappedSeverity = severityMap[severity.toLowerCase()] || 'Medium';
        vulnerabilities.push({
          id: `dependabot-${alert.number}`,
          severity: mappedSeverity,
          title: alert.security_advisory?.summary || 'Dependency vulnerability',
          description: alert.security_advisory?.description || 'Security vulnerability in dependency',
          cwe: alert.security_advisory?.cwe_ids?.[0]?.cwe_id,
          cvss_score: alert.security_advisory?.cvss?.score,
          file_path: alert.dependency?.manifest_path,
          rule_id: `dependabot-${alert.number}`,
          category: 'dependency',
          remediation: alert.security_advisory?.vulnerabilities?.[0]?.first_patched_version?.identifier,
          references: alert.security_advisory?.references?.map(ref => ref.url),
          detected_at: alert.created_at
        });
        totalVulnerabilities++;
        switch (mappedSeverity) {
          case 'Critical': critical++; break;
          case 'High': high++; break;
          case 'Medium': medium++; break;
          case 'Low': low++; break;
          default: info++; break;
        }
      });
    }

    if (secretAlerts.status === 'fulfilled' && secretAlerts.value.ok) {
      const secrets = await secretAlerts.value.json();
      secrets.forEach(secret => {
        vulnerabilities.push({
          id: `secret-${secret.number}`,
          severity: 'Critical',
          title: `Exposed secret: ${secret.secret_type}`,
          description: `Potential ${secret.secret_type} secret detected`,
          file_path: secret.location?.path,
          line_number: secret.location?.start_line,
          rule_id: `secret-${secret.secret_type}`,
          category: 'secret',
          remediation: 'Remove the exposed secret and rotate credentials',
          detected_at: secret.created_at
        });
        totalVulnerabilities++;
        critical++;
      });
    }

    let filesScanned = 0;
    let dependenciesScanned = 0;

    try {
      const getAllFiles = async (dirPath = '') => {
        const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`, {
          headers: {
            Authorization: `Bearer ${req.session.githubToken}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'RaijinGuard'
          }
        });
        if (!contentsResponse.ok) return [];
        const contents = await contentsResponse.json();
        const allFiles = [];
        for (const item of contents) {
          if (item.type === 'file') {
            allFiles.push(item);
          } else if (item.type === 'dir' && !item.name.startsWith('.') && item.name !== 'node_modules') {
            const subFiles = await getAllFiles(item.path);
            allFiles.push(...subFiles);
          }
        }
        return allFiles;
      };

      const allFiles = await getAllFiles();
      filesScanned = allFiles.length;

      const dependencyFiles = allFiles.filter(file =>
        file.name === 'package.json' ||
        file.name === 'requirements.txt' ||
        file.name === 'Pipfile' ||
        file.name === 'composer.json' ||
        file.name === 'Gemfile' ||
        file.name === 'go.mod' ||
        file.name === 'Cargo.toml'
      );

      for (const depFile of dependencyFiles) {
        try {
          const fileResponse = await fetch(depFile.download_url, {
            headers: {
              Authorization: `Bearer ${req.session.githubToken}`,
              Accept: 'application/vnd.github+json',
              'User-Agent': 'RaijinGuard'
            }
          });
          if (fileResponse.ok) {
            const fileContent = await fileResponse.text();
            if (depFile.name === 'package.json') {
              const packageJson = JSON.parse(fileContent);
              dependenciesScanned += Object.keys(packageJson.dependencies || {}).length;
              dependenciesScanned += Object.keys(packageJson.devDependencies || {}).length;
            } else if (depFile.name === 'requirements.txt') {
              dependenciesScanned += fileContent.split('\n').filter(line =>
                line.trim() && !line.startsWith('#') && !line.startsWith('-')
              ).length;
            }
          }
        } catch (e) {
          console.log(`Could not parse ${depFile.name}:`, e.message);
        }
      }
    } catch (e) {
      console.log('Could not fetch repository contents:', e.message);
    }

    let aiVulnerabilities = [];
    let aiFilesAnalyzed = 0;
    let aiRecommendationsToAdd = null;

    try {
      const getAllCodeFiles = async (dirPath = '') => {
        const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`, {
          headers: {
            Authorization: `Bearer ${req.session.githubToken}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'RaijinGuard'
          }
        });
        if (!contentsResponse.ok) return [];
        const contents = await contentsResponse.json();
        const codeFiles = [];
        for (const item of contents) {
          if (item.type === 'file' &&
            (item.name.endsWith('.js') ||
             item.name.endsWith('.ts') ||
             item.name.endsWith('.jsx') ||
             item.name.endsWith('.tsx') ||
             item.name.endsWith('.py') ||
             item.name.endsWith('.java') ||
             item.name.endsWith('.go') ||
             item.name.endsWith('.php') ||
             item.name.endsWith('.rb') ||
             item.name.endsWith('.cs') ||
             item.name.endsWith('.cpp') ||
             item.name.endsWith('.c'))) {
            codeFiles.push(item);
          } else if (item.type === 'dir' && !item.name.startsWith('.') && item.name !== 'node_modules') {
            const subFiles = await getAllCodeFiles(item.path);
            codeFiles.push(...subFiles);
          }
        }
        return codeFiles;
      };

      const codeFiles = await getAllCodeFiles();

      for (const file of codeFiles) {
        try {
          const fileResponse = await fetch(file.download_url, {
            headers: {
              Authorization: `Bearer ${req.session.githubToken}`,
              Accept: 'application/vnd.github+json',
              'User-Agent': 'RaijinGuard'
            }
          });
          if (fileResponse.ok) {
            const fileContent = await fileResponse.text();
            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  {
                    role: 'system',
                    content: `You are a security expert analyzing code for vulnerabilities. Analyze the provided code thoroughly and return a JSON array of security issues found. Each issue should have:
                      - severity: "Critical", "High", "Medium", "Low", or "Info"
                      - title: Brief description of the issue
                      - description: Detailed explanation
                      - category: "authentication", "authorization", "injection", "crypto", "secrets", "xss", "csrf", "other"
                      - line_number: Approximate line number if possible
                      - remediation: How to fix the issue
                      IMPORTANT: Return ONLY a valid JSON array with no markdown formatting, no code blocks, no additional text. If no issues found, return empty array [].`
                  },
                  {
                    role: 'user',
                    content: `Analyze this ${file.name} file for security vulnerabilities:\n\n${fileContent.substring(0, 4000)}`
                  }
                ],
                max_tokens: 1000,
                temperature: 0.1
              })
            });
            if (openaiResponse.ok) {
              const aiData = await openaiResponse.json();
              const aiContent = aiData.choices[0]?.message?.content;
              try {
                let cleanContent = aiContent.trim();
                if (cleanContent.startsWith('```json')) {
                  cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                } else if (cleanContent.startsWith('```')) {
                  cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
                }
                const fileVulnerabilities = JSON.parse(cleanContent);
                if (Array.isArray(fileVulnerabilities)) {
                  fileVulnerabilities.forEach(vuln => {
                    const aiVuln = {
                      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      severity: vuln.severity || 'Medium',
                      title: vuln.title || 'Security issue detected',
                      description: vuln.description || 'AI-detected security issue',
                      file_path: file.name,
                      line_number: vuln.line_number || null,
                      rule_id: `ai-${vuln.category || 'other'}`,
                      category: vuln.category || 'other',
                      remediation: vuln.remediation || 'Review and fix the identified issue',
                      detected_at: new Date().toISOString()
                    };
                    aiVulnerabilities.push(aiVuln);
                    vulnerabilities.push(aiVuln);
                    totalVulnerabilities++;
                    switch (aiVuln.severity) {
                      case 'Critical': critical++; break;
                      case 'High': high++; break;
                      case 'Medium': medium++; break;
                      case 'Low': low++; break;
                      case 'Info': info++; break;
                    }
                  });
                }
              } catch (parseError) {
                console.log(`Could not parse AI response for ${file.name}:`, parseError.message);
              }
            } else {
              const errorText = await openaiResponse.text();
              console.log(`OpenAI API error for ${file.name}:`, openaiResponse.status, errorText);
            }
            aiFilesAnalyzed++;
          }
        } catch (error) {
          console.log(`Error analyzing ${file.name}:`, error.message);
        }
      }

      if (aiVulnerabilities.length === 0 && aiFilesAnalyzed > 0) {
        try {
          const sampleFiles = (await getAllCodeFiles()).slice(0, Math.min(3, aiFilesAnalyzed));
          let fileContexts = '';
          for (const file of sampleFiles) {
            try {
              const fileResponse = await fetch(file.download_url, {
                headers: {
                  Authorization: `Bearer ${req.session.githubToken}`,
                  Accept: 'application/vnd.github+json',
                  'User-Agent': 'RaijinGuard'
                }
              });
              if (fileResponse.ok) {
                const fileContent = await fileResponse.text();
                fileContexts += `\n\nFile: ${file.name}\n${fileContent.substring(0, 1000)}...`;
              }
            } catch (e) {
              console.log(`Could not get context for ${file.name}:`, e.message);
            }
          }
          const recommendationsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `You are a security expert providing recommendations for a codebase. Based on the provided code samples, generate 5-7 specific, actionable security recommendations. Focus on:
1. Code-specific issues you can identify
2. Best practices for the technologies used
3. Security improvements relevant to the codebase structure
4. Practical next steps for the development team
Return a JSON array of recommendation objects, each with:
- title
- description
- priority: "High", "Medium", or "Low"
- category: "authentication", "authorization", "data-protection", "input-validation", "logging", "dependencies", "infrastructure"
IMPORTANT: Return ONLY a valid JSON array with no markdown formatting, no code blocks, no additional text.`
                },
                {
                  role: 'user',
                  content: `Based on these code files from the ${owner}/${repo} repository, provide specific security recommendations:\n\n${fileContexts}`
                }
              ],
              max_tokens: 800,
              temperature: 0.3
            })
          });
          if (recommendationsResponse.ok) {
            const recData = await recommendationsResponse.json();
            const recContent = recData.choices[0]?.message?.content;
            try {
              let cleanContent = recContent.trim();
              if (cleanContent.startsWith('```json')) {
                cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
              } else if (cleanContent.startsWith('```')) {
                cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
              }
              const aiRecommendations = JSON.parse(cleanContent);
              if (Array.isArray(aiRecommendations)) {
                aiRecommendationsToAdd = aiRecommendations;
              }
            } catch (parseError) {
              console.log('Could not parse AI recommendations:', parseError.message);
            }
          } else {
            console.log('Failed to get AI recommendations:', recommendationsResponse.status);
          }
        } catch (recError) {
          console.log('Error generating AI recommendations:', recError.message);
        }
      }
    } catch (aiError) {
      console.log('AI analysis failed:', aiError.message);
    }

    const riskScore = Math.min(100, (critical * 25) + (high * 15) + (medium * 8) + (low * 3) + (info * 1));

    const report = {
      repository: `${owner}/${repo}`,
      summary: {
        total_vulnerabilities: totalVulnerabilities,
        critical,
        high,
        medium,
        low,
        info,
        risk_score: riskScore,
        last_scan: new Date().toISOString(),
        scan_duration_ms: 2000
      },
      vulnerabilities,
      dependencies_scanned: dependenciesScanned,
      files_scanned: filesScanned,
      ai_files_analyzed: aiFilesAnalyzed,
      ai_vulnerabilities: aiVulnerabilities,
      scan_status: 'completed'
    };

    if (aiRecommendationsToAdd) {
      report.ai_recommendations = aiRecommendationsToAdd;
    }

    res.json(report);
  } catch (e) {
    console.error('Security scan error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/security/ai-scan/:owner/:repo', async (req, res) => {
  if (!req.session.githubToken) return res.status(401).json({ error: 'Not authenticated' });
  const { owner, repo } = req.params;
  try {
    const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: {
        Authorization: `Bearer ${req.session.githubToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'RaijinGuard'
      }
    });
    if (!contentsResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch repository contents' });
    }
    const contents = await contentsResponse.json();
    const codeFiles = contents.filter(file =>
      file.type === 'file' &&
      (file.name.endsWith('.js') ||
       file.name.endsWith('.ts') ||
       file.name.endsWith('.jsx') ||
       file.name.endsWith('.tsx') ||
       file.name.endsWith('.py') ||
       file.name.endsWith('.java') ||
       file.name.endsWith('.go') ||
       file.name.endsWith('.php') ||
       file.name.endsWith('.rb') ||
       file.name.endsWith('.cs') ||
       file.name.endsWith('.cpp') ||
       file.name.endsWith('.c'))
    );
    const aiResults = [];
    let filesAnalyzed = 0;
    for (const file of codeFiles) {
      try {
        const fileResponse = await fetch(file.download_url, {
          headers: {
            Authorization: `Bearer ${req.session.githubToken}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'RaijinGuard'
          }
        });
        if (fileResponse.ok) {
          const fileContent = await fileResponse.text();
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `You are a security expert analyzing code for vulnerabilities. Analyze the provided code and return a JSON array of security issues found. Each issue should have:
                  - severity: "Critical", "High", "Medium", "Low", or "Info"
                  - title: Brief description of the issue
                  - description: Detailed explanation
                  - category: "authentication", "authorization", "injection", "crypto", "secrets", "xss", "csrf", "other"
                  - line_number: Approximate line number if possible
                  - remediation: How to fix the issue
                  Return only valid JSON array, no other text. If no issues found, return empty array [].`
                },
                {
                  role: 'user',
                  content: `Analyze this ${file.name} file for security vulnerabilities:\n\n${fileContent.substring(0, 4000)}`
                }
              ],
              max_tokens: 1000,
              temperature: 0.1
            })
          });
          if (openaiResponse.ok) {
            const aiData = await openaiResponse.json();
            const aiContent = aiData.choices[0]?.message?.content;
            try {
              const vulnerabilities = JSON.parse(aiContent);
              if (Array.isArray(vulnerabilities)) {
                vulnerabilities.forEach(vuln => {
                  aiResults.push({
                    id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    severity: vuln.severity || 'Medium',
                    title: vuln.title || 'Security issue detected',
                    description: vuln.description || 'AI-detected security issue',
                    file_path: file.name,
                    line_number: vuln.line_number || null,
                    rule_id: `ai-${vuln.category || 'other'}`,
                    category: vuln.category || 'other',
                    remediation: vuln.remediation || 'Review and fix the identified issue',
                    detected_at: new Date().toISOString()
                  });
                });
              }
            } catch (parseError) {
              console.log(`Could not parse AI response for ${file.name}:`, parseError.message);
            }
          } else {
            console.log(`OpenAI API error for ${file.name}:`, openaiResponse.status);
          }
          filesAnalyzed++;
        }
      } catch (error) {
        console.log(`Error analyzing ${file.name}:`, error.message);
      }
    }
    res.json({
      repository: `${owner}/${repo}`,
      files_analyzed: filesAnalyzed,
      total_files: codeFiles.length,
      ai_vulnerabilities: aiResults,
      analysis_timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI scan error:', error);
    res.status(500).json({ error: 'AI scan failed' });
  }
});

app.listen(PORT, () => {
  console.log(`OAuth server on http://localhost:${PORT}`);
});
