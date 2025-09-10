import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, Eye, EyeOff, Github, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupStage, setSignupStage] = useState<'email' | 'password'>('email');
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const navigate = useNavigate();

  // Password validation rules
  const passwordRules = [
    { text: 'At least 8 characters', valid: password.length >= 8 },
    { text: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
    { text: 'Contains lowercase letter', valid: /[a-z]/.test(password) },
    { text: 'Contains number', valid: /\d/.test(password) },
    { text: 'Contains special character', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  const isPasswordValid = passwordRules.every(rule => rule.valid);
  const passwordsMatch = password === confirmPassword;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && isSignUp) {
      setSignupStage('password');
    }
    // For login, we don't need to change stage - both fields are shown
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (isPasswordValid && passwordsMatch) {
        // Mock sign up process - show success message
        alert('Account created successfully! Welcome to RaijinGuard.');
        resetForm();
      }
    } else {
      // Route to user dashboard for login
      navigate('/user-dashboard');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Route to user dashboard for login
      navigate('/user-dashboard');
    }
  };

  const handleGitHubAuth = () => {
    setIsGitHubLoading(true);
    // Redirect to GitHub OAuth
    window.location.href = 'http://localhost:3001/api/auth/github';
  };

  const resetForm = () => {
    setIsSignUp(false);
    setSignupStage('email');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleBackToEmail = () => {
    setSignupStage('email');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setSignupStage('email');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-start items-center p-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <div className="w-4 h-4 bg-zinc-900 rounded-sm"></div>
          </div>
          <span className="text-white text-xl font-bold">raijinguard</span>
        </div>
      </div>

      {/* Left Column - Form (40% width) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Get started' : 'Welcome back'}
            </h1>
            <p className="text-zinc-400">
              {isSignUp ? 'Create a new account' : 'Sign in to your account'}
            </p>
          </div>

          {/* GitHub Auth Button */}
          <button
            onClick={handleGitHubAuth}
            disabled={isGitHubLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors mb-4"
          >
            {isGitHubLoading ? (
              <>
                <div className="w-5 h-5 mr-3 border-2 border-zinc-400 border-t-white rounded-full animate-spin"></div>
                Connecting to GitHub...
              </>
            ) : (
              <>
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-950 text-zinc-400">or</span>
            </div>
          </div>

          {/* Email Stage - Only for Sign Up */}
          {signupStage === 'email' && isSignUp && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-zinc-900 py-3 px-4 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </button>
            </form>
          )}

          {/* Login Form - Shows both email and password */}
          {!isSignUp && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-zinc-900 py-3 px-4 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Password Stage - Only for Sign Up */}
          {signupStage === 'password' && isSignUp && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Back button */}
              <button
                type="button"
                onClick={handleBackToEmail}
                className="flex items-center text-zinc-400 hover:text-white transition-colors mb-4"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                <span className="text-sm">Back to email</span>
              </button>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  {isSignUp ? 'Create a password' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password validation rules - only show during signup */}
              {isSignUp && password && (
                <div className="space-y-2">
                  <div className="text-sm text-zinc-400">Password requirements:</div>
                  {passwordRules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        rule.valid ? 'bg-green-500' : 'bg-zinc-600'
                      }`}>
                        {rule.valid && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${rule.valid ? 'text-green-400' : 'text-zinc-400'}`}>
                        {rule.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm Password - only show during signup */}
              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className={`w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent pr-12 ${
                        confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-zinc-700'
                      }`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSignUp && (!isPasswordValid || !passwordsMatch)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isSignUp && (!isPasswordValid || !passwordsMatch)
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                    : 'bg-white text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Toggle Sign Up/Sign In - only show on email stage */}
          {signupStage === 'email' && (
            <div className="text-center mt-6">
              <p className="text-zinc-400">
                {isSignUp ? 'Have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="text-white hover:underline"
                >
                  {isSignUp ? 'Sign In Now' : 'Sign Up Now'}
                </button>
              </p>
            </div>
          )}

          {/* Legal Text */}
          <p className="text-xs text-zinc-500 text-center mt-8">
            By continuing, you agree to RaijinGuard's{' '}
            <a href="#" className="text-white hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-white hover:underline">Privacy Policy</a>, and to receive periodic emails with updates.
          </p>
        </div>
      </div>

      {/* Right Column - Testimonial (60% width) */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-zinc-900 to-zinc-800 items-center justify-center p-16">
        <div className="max-w-lg">
          {/* Large Quote Mark */}
          <div className="text-8xl text-zinc-600 mb-8">"</div>
          
          {/* Testimonial */}
          <blockquote className="text-white text-xl leading-relaxed mb-8">
            RaijinGuard is just 🔥. Now I see why a lot of developers love using it for their security audits. 
            I am really impressed with how easy it is to set up automated scanning and then just focus on building. 
            The AI-powered vulnerability detection is incredible! #security #devtools
          </blockquote>
          
          {/* Author */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">JD</span>
            </div>
            <div>
              <div className="text-white font-medium">@johndoe</div>
              <div className="text-zinc-400 text-sm">Senior Developer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}