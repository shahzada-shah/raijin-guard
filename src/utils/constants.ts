/**
 * RaijinGuard - Application Constants
 * 
 * Centralized configuration and constant values used throughout the application.
 * Provides a single source of truth for app-wide settings.
 * 
 * @module Constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  /** Base URL for backend API (defaults to localhost:3001 in development) */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  
  /** Timeout for API requests in milliseconds */
  REQUEST_TIMEOUT: 30000,
  
  /** Maximum retries for failed requests */
  MAX_RETRIES: 3,
} as const;

/**
 * Security Scanner Configuration
 */
export const SCANNER_CONFIG = {
  /** Maximum number of repositories to scan in parallel */
  MAX_PARALLEL_SCANS: 5,
  
  /** File extensions considered as code files for AI analysis */
  CODE_FILE_EXTENSIONS: ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.php', '.rb', '.cs', '.cpp', '.c'],
  
  /** Scan timeout in milliseconds */
  SCAN_TIMEOUT: 120000, // 2 minutes
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  /** Number of recent scans to display in dashboard */
  RECENT_SCANS_LIMIT: 5,
  
  /** Animation duration in milliseconds */
  ANIMATION_DURATION: 300,
  
  /** Debounce delay for search input in milliseconds */
  SEARCH_DEBOUNCE: 300,
} as const;

/**
 * Risk Score Thresholds
 * Determines the severity level based on risk scores
 */
export const RISK_THRESHOLDS = {
  /** Scores above this are considered Critical */
  CRITICAL: 70,
  
  /** Scores above this (but below CRITICAL) are considered High */
  HIGH: 40,
  
  /** Scores above this (but below HIGH) are considered Medium */
  MEDIUM: 20,
  
  /** Scores below MEDIUM are considered Low */
  LOW: 0,
} as const;

/**
 * Status Color Mapping
 * Maps security status to visual color indicators
 */
export const STATUS_COLORS = {
  Critical: 'red',
  Warning: 'yellow',
  Healthy: 'green',
  Offline: 'gray',
} as const;

/**
 * GitHub OAuth Scopes
 * Required permissions for GitHub OAuth
 */
export const GITHUB_SCOPES = [
  'repo', // Full access to repositories
  'read:user', // Read user profile data
  'read:org', // Read organization data
] as const;

/**
 * Local Storage Keys
 * Centralized keys for localStorage operations
 */
export const STORAGE_KEYS = {
  /** Key for storing security scan results */
  SCAN_RESULTS: 'securityScanResults',
  
  /** Key for storing user preferences */
  USER_PREFERENCES: 'userPreferences',
  
  /** Key for storing cached repository data */
  REPO_CACHE: 'repositoryCache',
} as const;

/**
 * Route Paths
 * Application route constants
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login-auth',
  DASHBOARD: '/user-dashboard',
  CALLBACK: '/auth/github/callback',
} as const;

/**
 * Error Messages
 * Standardized error messages for user feedback
 */
export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Authentication failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SCAN_FAILED: 'Security scan failed. Please try again.',
  REPO_FETCH_FAILED: 'Failed to fetch repositories.',
  NOT_AUTHENTICATED: 'Please log in to access this feature.',
} as const;

