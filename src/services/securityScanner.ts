export interface VulnerabilityScanResult {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  title: string;
  description: string;
  cwe?: string;
  cvss_score?: number;
  file_path?: string;
  line_number?: number;
  rule_id: string;
  category: 'dependency' | 'code' | 'secret' | 'configuration' | 'container';
  remediation?: string;
  references?: string[];
  detected_at: string;
}

export interface SecurityScanSummary {
  total_vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  risk_score: number; // 0-100
  last_scan: string;
  scan_duration_ms: number;
}

export interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'authentication' | 'authorization' | 'data-protection' | 'input-validation' | 'logging' | 'dependencies' | 'infrastructure';
}

export interface RepositorySecurityReport {
  repository: string;
  summary: SecurityScanSummary;
  vulnerabilities: VulnerabilityScanResult[];
  dependencies_scanned: number;
  files_scanned: number;
  ai_files_analyzed?: number;
  ai_vulnerabilities?: VulnerabilityScanResult[];
  ai_recommendations?: AIRecommendation[];
  scan_status: 'completed' | 'in_progress' | 'failed';
  scan_error?: string;
}

class SecurityScannerService {
  private readonly apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  /**
   * Scan a repository for vulnerabilities using the server endpoint
   */
  async scanRepository(owner: string, repo: string): Promise<RepositorySecurityReport> {
    console.log(`🚀 [Security Scanner] Starting comprehensive scan for ${owner}/${repo}`);
    console.log(`⏰ [Security Scanner] Scan started at: ${new Date().toLocaleString()}`);
    
    try {
      const response = await fetch(`${this.apiBase}/api/security/scan/${owner}/${repo}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to scan repository: ${response.statusText}`);
      }

      const report = await response.json();
      
      console.log(`✅ [Security Scanner] Scan completed for ${owner}/${repo}`);
      console.log(`📊 [Security Scanner] Scan Results Summary:`);
      console.log(`   📁 Files Scanned: ${report.files_scanned || 0}`);
      console.log(`   🤖 AI Files Analyzed: ${report.ai_files_analyzed || 0}`);
      console.log(`   📦 Dependencies Scanned: ${report.dependencies_scanned || 0}`);
      console.log(`   🚨 Total Vulnerabilities: ${report.summary.total_vulnerabilities}`);
      console.log(`   ⚠️  Critical: ${report.summary.critical}, High: ${report.summary.high}, Medium: ${report.summary.medium}, Low: ${report.summary.low}`);
      console.log(`   📈 Risk Score: ${report.summary.risk_score}/100`);
      console.log(`   ⏱️  Scan Duration: ${report.summary.scan_duration_ms}ms`);
      
      if (report.ai_vulnerabilities && report.ai_vulnerabilities.length > 0) {
        console.log(`🤖 [AI Scanner] AI Found ${report.ai_vulnerabilities.length} security issues:`);
        report.ai_vulnerabilities.forEach((vuln, index) => {
          console.log(`   ${index + 1}. [${vuln.severity}] ${vuln.title} in ${vuln.file_path}`);
          console.log(`      Category: ${vuln.category}`);
          console.log(`      Remediation: ${vuln.remediation}`);
        });
      } else if (report.ai_files_analyzed > 0) {
        console.log(`✅ [AI Scanner] No security vulnerabilities detected in ${report.ai_files_analyzed} analyzed files`);
      }
      
      return report;
    } catch (error) {
      console.error(`❌ [Security Scanner] Scan failed for ${owner}/${repo}:`, error);
      return {
        repository: `${owner}/${repo}`,
        summary: {
          total_vulnerabilities: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          info: 0,
          risk_score: 0,
          last_scan: new Date().toISOString(),
          scan_duration_ms: 0
        },
        vulnerabilities: [],
        dependencies_scanned: 0,
        files_scanned: 0,
        scan_status: 'failed',
        scan_error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Scan GitHub Security Advisories and Dependabot alerts
   */
  private async scanGitHubSecurityAlerts(owner: string, repo: string): Promise<VulnerabilityScanResult[]> {
    const response = await fetch(`${this.apiBase}/api/github/security-alerts/${owner}/${repo}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub security alerts: ${response.statusText}`);
    }

    const alerts = await response.json();
    
    return alerts.map((alert: { 
      id: number; 
      severity: string; 
      security_advisory?: {
        summary?: string;
        description?: string;
        cwe_ids?: Array<{ cwe_id: string }>;
        cvss?: { score: number };
        vulnerabilities?: Array<{ first_patched_version?: { identifier: string } }>;
        references?: Array<{ url: string }>;
      };
      dependency?: {
        package?: { name: string };
        manifest_path?: string;
      };
      created_at: string;
    }) => ({
      id: `github-${alert.id}`,
      severity: this.mapGitHubSeverity(alert.severity),
      title: alert.security_advisory?.summary || alert.dependency?.package?.name || 'Security Alert',
      description: alert.security_advisory?.description || 'GitHub security alert',
      cwe: alert.security_advisory?.cwe_ids?.[0]?.cwe_id,
      cvss_score: alert.security_advisory?.cvss?.score,
      file_path: alert.dependency?.manifest_path,
      rule_id: `github-${alert.id}`,
      category: 'dependency' as const,
      remediation: alert.security_advisory?.vulnerabilities?.[0]?.first_patched_version?.identifier,
      references: alert.security_advisory?.references?.map((ref: { url: string }) => ref.url),
      detected_at: alert.created_at
    }));
  }

  /**
   * Scan dependencies using Snyk or similar service
   * Currently returns mock data - integrate with actual Snyk API in production
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async scanDependencies(_owner: string, _repo: string): Promise<VulnerabilityScanResult[]> {
    // This would integrate with Snyk API or similar
    // For now, return mock data - replace with actual Snyk integration
    return [
      {
        id: 'snyk-001',
        severity: 'High',
        title: 'Vulnerable dependency: lodash',
        description: 'Prototype pollution vulnerability in lodash',
        cwe: 'CWE-1321',
        cvss_score: 7.2,
        file_path: 'package.json',
        rule_id: 'snyk-lodash-prototype-pollution',
        category: 'dependency',
        remediation: 'Update lodash to version 4.17.21 or later',
        references: ['https://snyk.io/vuln/SNYK-JS-LODASH-567746'],
        detected_at: new Date().toISOString()
      }
    ];
  }

  /**
   * AI-powered code analysis for security vulnerabilities
   */
  private async scanCodeWithAI(owner: string, repo: string): Promise<VulnerabilityScanResult[]> {
    // Get repository files for analysis
    const files = await this.getRepositoryFiles(owner, repo);
    const vulnerabilities: VulnerabilityScanResult[] = [];

    console.log(`🔍 [AI Scanner] Starting analysis for ${owner}/${repo}`);
    console.log(`📁 [AI Scanner] Found ${files.length} total files in repository`);

    const codeFiles = files.filter(file => this.isCodeFile(file.name));
    console.log(`💻 [AI Scanner] Found ${codeFiles.length} code files to analyze:`);
    codeFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.name} (${file.type})`);
    });

    // Analyze each file with AI - analyze all code files found
    for (let i = 0; i < codeFiles.length; i++) {
      const file = codeFiles[i];
      console.log(`🤖 [AI Scanner] Analyzing file ${i + 1}/${codeFiles.length}: ${file.name}`);
      
      try {
        const content = await this.getFileContent(owner, repo, file.path);
        console.log(`📄 [AI Scanner] Retrieved content for ${file.name} (${content.length} characters)`);
        
        const aiAnalysis = await this.analyzeCodeWithAI(content, file.name);
        console.log(`🔍 [AI Scanner] AI analysis of ${file.name} found ${aiAnalysis.length} potential issues`);
        
        if (aiAnalysis.length > 0) {
          aiAnalysis.forEach((vuln, index) => {
            console.log(`   🚨 Issue ${index + 1}: [${vuln.severity}] ${vuln.title}`);
            console.log(`      File: ${vuln.file_path}${vuln.line_number ? `:${vuln.line_number}` : ''}`);
            console.log(`      Category: ${vuln.category}`);
            console.log(`      Description: ${vuln.description}`);
          });
        } else {
          console.log(`   ✅ No security issues found in ${file.name}`);
        }
        
        vulnerabilities.push(...aiAnalysis);
      } catch (error) {
        console.error(`❌ [AI Scanner] Error analyzing ${file.name}:`, error);
      }
    }

    console.log(`✅ [AI Scanner] Analysis complete for ${owner}/${repo}`);
    console.log(`📊 [AI Scanner] Total vulnerabilities found: ${vulnerabilities.length}`);
    console.log(`📈 [AI Scanner] Files analyzed: ${codeFiles.length}/${files.length} total files`);

    return vulnerabilities;
  }

  /**
   * Scan for exposed secrets and credentials
   */
  private async scanForSecrets(owner: string, repo: string): Promise<VulnerabilityScanResult[]> {
    const response = await fetch(`${this.apiBase}/api/github/secret-scanning/${owner}/${repo}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      return []; // Secret scanning might not be available
    }

    const secrets = await response.json();
    
    return secrets.map((secret: {
      id: number;
      secret_type: string;
      location?: {
        path?: string;
        start_line?: number;
      };
      created_at: string;
    }) => ({
      id: `secret-${secret.id}`,
      severity: 'Critical' as const,
      title: `Exposed secret: ${secret.secret_type}`,
      description: `Potential ${secret.secret_type} secret detected`,
      file_path: secret.location?.path,
      line_number: secret.location?.start_line,
      rule_id: `secret-${secret.secret_type}`,
      category: 'secret' as const,
      remediation: 'Remove the exposed secret and rotate credentials',
      detected_at: secret.created_at
    }));
  }

  /**
   * Analyze code content with AI for security issues
   */
  private async analyzeCodeWithAI(content: string, filename: string): Promise<VulnerabilityScanResult[]> {
    // This would integrate with OpenAI API or similar
    // For now, return mock analysis - replace with actual AI integration
    
    const vulnerabilities: VulnerabilityScanResult[] = [];
    
    // Simple pattern matching for demo (replace with AI analysis)
    if (content.includes('password') && content.includes('=')) {
      vulnerabilities.push({
        id: `ai-${Date.now()}-1`,
        severity: 'Medium',
        title: 'Potential hardcoded password',
        description: 'Password appears to be hardcoded in the source code',
        file_path: filename,
        line_number: this.findLineNumber(content, 'password'),
        rule_id: 'ai-hardcoded-password',
        category: 'code',
        remediation: 'Use environment variables or secure configuration management',
        detected_at: new Date().toISOString()
      });
    }

    if (content.includes('eval(') || content.includes('exec(')) {
      vulnerabilities.push({
        id: `ai-${Date.now()}-2`,
        severity: 'High',
        title: 'Dangerous code execution',
        description: 'Use of eval() or exec() can lead to code injection',
        file_path: filename,
        line_number: this.findLineNumber(content, 'eval'),
        rule_id: 'ai-code-injection',
        category: 'code',
        remediation: 'Avoid dynamic code execution, use safer alternatives',
        detected_at: new Date().toISOString()
      });
    }

    return vulnerabilities;
  }

  /**
   * Calculate security summary from vulnerabilities
   */
  private calculateSecuritySummary(vulnerabilities: VulnerabilityScanResult[], duration: number): SecurityScanSummary {
    const summary = {
      total_vulnerabilities: vulnerabilities.length,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      risk_score: 0,
      last_scan: new Date().toISOString(),
      scan_duration_ms: duration
    };

    // Count by severity
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'Critical': summary.critical++; break;
        case 'High': summary.high++; break;
        case 'Medium': summary.medium++; break;
        case 'Low': summary.low++; break;
        case 'Info': summary.info++; break;
      }
    });

    // Calculate risk score (0-100)
    summary.risk_score = Math.min(100, 
      (summary.critical * 25) + 
      (summary.high * 15) + 
      (summary.medium * 8) + 
      (summary.low * 3) + 
      (summary.info * 1)
    );

    return summary;
  }

  // Helper methods
  private mapGitHubSeverity(severity: string): 'Critical' | 'High' | 'Medium' | 'Low' | 'Info' {
    const mapping: Record<string, 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'> = {
      'critical': 'Critical',
      'high': 'High',
      'moderate': 'Medium',
      'medium': 'Medium',
      'low': 'Low',
      'info': 'Info'
    };
    return mapping[severity.toLowerCase()] || 'Medium';
  }

  private isCodeFile(filename: string): boolean {
    const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.php', '.rb', '.cs', '.cpp', '.c'];
    return codeExtensions.some(ext => filename.endsWith(ext));
  }

  private findLineNumber(content: string, searchTerm: string): number {
    const lines = content.split('\n');
    return lines.findIndex(line => line.includes(searchTerm)) + 1;
  }

  private async getRepositoryFiles(owner: string, repo: string): Promise<{ name: string; type: string; path: string }[]> {
    const response = await fetch(`${this.apiBase}/api/github/repos/${owner}/${repo}/contents`, {
      credentials: 'include'
    });
    return response.ok ? await response.json() : [];
  }

  private async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    const response = await fetch(`${this.apiBase}/api/github/repos/${owner}/${repo}/contents/${path}`, {
      credentials: 'include'
    });
    if (response.ok) {
      const file = await response.json();
      return atob(file.content); // Decode base64 content
    }
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async getDependencyCount(_owner: string, _repo: string): Promise<number> {
    // This would count actual dependencies from package.json, requirements.txt, etc.
    return Math.floor(Math.random() * 50) + 10; // Mock data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async getFileCount(_owner: string, _repo: string): Promise<number> {
    // This would count actual files in the repository
    return Math.floor(Math.random() * 200) + 50; // Mock data
  }
}

export const securityScanner = new SecurityScannerService();
