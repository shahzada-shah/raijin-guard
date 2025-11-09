/**
 * RaijinGuard - Type Definitions
 * 
 * Central type definitions for the entire application.
 * Ensures type safety and consistency across components and services.
 * 
 * @module Types
 */

/**
 * Navigation Item Interface
 * Defines the structure for navigation menu items
 */
export interface NavItem {
  name: string;
  href: string;
  active?: boolean;
}

/**
 * Navigation Props Interface
 * Props for the Navigation component
 */
export interface NavigationProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

/**
 * FAQ Item Interface
 * Structure for frequently asked questions
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Security Status Type
 * Possible security status values for repositories
 */
export type SecurityStatus = 'Critical' | 'Warning' | 'Healthy' | 'Offline';

/**
 * Security Color Type
 * Visual indicators for security status
 */
export type SecurityColor = 'red' | 'yellow' | 'green' | 'gray';

/**
 * Security Row Interface
 * Complete data structure for repository security information
 */
export interface SecurityRow {
  status: SecurityStatus;
  repo: string;
  language: string;
  risk: string;
  lastScan: string;
  vulnerabilities: number;
  branch: string;
  color: SecurityColor;
  description: string;
  uptime: string;
  messages: string;
  incidents: string;
  securityScore: string;
  activeAlerts: number;
  successRate: string;
  full_name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  private: boolean;
}

/**
 * GitHub User Interface
 * User data from GitHub OAuth
 */
export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  html_url: string;
}

/**
 * Auth Status Interface
 * Current authentication state
 */
export interface AuthStatus {
  connected: boolean;
  token?: string;
  login?: string | null;
}

/**
 * GitHub Repository Interface
 * Complete repository data from GitHub API
 */
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  default_branch: string;
  updated_at: string;
  created_at: string;
  size: number;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  archived: boolean;
  disabled: boolean;
  topics?: string[];
}

