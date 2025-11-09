/**
 * RaijinGuard - Utility Functions
 * 
 * Common utility functions used across the application.
 * Provides helpers for formatting, validation, and data transformation.
 * 
 * @module Utils
 */

/**
 * Formats a date into a human-readable "time ago" string
 * 
 * @param date - Date to format (string or Date object)
 * @returns Human-readable time ago string (e.g., "2 hours ago", "3 days ago")
 * 
 * @example
 * ```typescript
 * formatTimeAgo('2024-01-01T10:00:00Z') // "2 days ago"
 * formatTimeAgo(new Date()) // "Just now"
 * ```
 */
export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - past.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Formats a number with thousands separators
 * 
 * @param num - Number to format
 * @returns Formatted number string with commas
 * 
 * @example
 * ```typescript
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(42) // "42"
 * ```
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Calculates risk score based on vulnerability counts
 * 
 * @param critical - Number of critical vulnerabilities
 * @param high - Number of high severity vulnerabilities
 * @param medium - Number of medium severity vulnerabilities
 * @param low - Number of low severity vulnerabilities
 * @returns Risk score from 0-100
 * 
 * @example
 * ```typescript
 * calculateRiskScore(2, 5, 3, 1) // 82 (high risk)
 * calculateRiskScore(0, 0, 0, 0) // 0 (no risk)
 * ```
 */
export function calculateRiskScore(
  critical: number,
  high: number,
  medium: number,
  low: number
): number {
  return Math.min(100, 
    (critical * 25) + 
    (high * 15) + 
    (medium * 8) + 
    (low * 3)
  );
}

/**
 * Determines security status based on vulnerability severity
 * 
 * @param critical - Number of critical vulnerabilities
 * @param high - Number of high severity vulnerabilities
 * @param medium - Number of medium severity vulnerabilities
 * @returns Security status string
 * 
 * @example
 * ```typescript
 * getSecurityStatus(1, 0, 0) // "Critical"
 * getSecurityStatus(0, 2, 3) // "Warning"
 * getSecurityStatus(0, 0, 0) // "Healthy"
 * ```
 */
export function getSecurityStatus(
  critical: number,
  high: number,
  medium: number
): 'Critical' | 'Warning' | 'Healthy' {
  if (critical > 0) return 'Critical';
  if (high > 0) return 'Warning';
  if (medium > 0) return 'Warning';
  return 'Healthy';
}

/**
 * Truncates text to a specified length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * ```typescript
 * truncateText("This is a long description", 10) // "This is a..."
 * truncateText("Short", 10) // "Short"
 * ```
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Debounces a function call
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```typescript
 * const search = debounce((query) => console.log(query), 300);
 * search('test'); // Only logs after 300ms of no calls
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Validates if a string is a valid email address
 * 
 * @param email - Email string to validate
 * @returns True if valid email format
 * 
 * @example
 * ```typescript
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Gets the appropriate color class based on risk score
 * 
 * @param risk - Risk score or percentage string
 * @returns Tailwind CSS color class
 * 
 * @example
 * ```typescript
 * getRiskColor(85) // "text-red-400"
 * getRiskColor("45%") // "text-yellow-400"
 * getRiskColor(10) // "text-green-400"
 * ```
 */
export function getRiskColor(risk: number | string): string {
  const score = typeof risk === 'string' ? parseFloat(risk) : risk;
  
  if (score >= 70) return 'text-red-400';
  if (score >= 40) return 'text-yellow-400';
  if (score >= 20) return 'text-orange-400';
  return 'text-green-400';
}

/**
 * Parses error messages from various error types
 * 
 * @param error - Error object of unknown type
 * @returns User-friendly error message string
 * 
 * @example
 * ```typescript
 * parseErrorMessage(new Error('Failed')) // "Failed"
 * parseErrorMessage({ message: 'API Error' }) // "API Error"
 * parseErrorMessage('String error') // "String error"
 * ```
 */
export function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

