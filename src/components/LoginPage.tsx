import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Slideshow images
  const images = [
    {
      url: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "A secure development environment where code quality meets enterprise-grade protection, creating a foundation for reliable and trustworthy software."
    },
    {
      url: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "Advanced security monitoring and threat detection systems working around the clock to protect your valuable code repositories."
    },
    {
      url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "Collaborative security workflows that empower development teams to build faster while maintaining the highest security standards."
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !showPassword) {
      setShowPassword(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      if (isSignUp) {
        // Check if passwords match
        if (password !== confirmPassword) {
          alert('Passwords do not match. Please try again.');
          return;
        }
        // Mock sign up process - show success message
        alert('Account created successfully! Welcome to RaijinGuard.');
        setIsSignUp(false);
        setShowPassword(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        // Route to user dashboard for login
        navigate('/user-dashboard');
      }
    }
  };

  const handleBackClick = () => {
    if (showPassword) {
      setShowPassword(false);
      setPassword('');
      setConfirmPassword('');
    } else if (isSignUp) {
      setIsSignUp(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      navigate('/');
    }
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
    setShowPassword(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="group flex items-center text-zinc-400 hover:text-white transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">
              {showPassword ? 'Back to email' : isSignUp ? 'Back to login' : 'Back to home'}
            </span>
          </button>

          {/* Logo */}
          <div className="flex items-center mb-12 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300 ease-out">
              <div className="w-4 h-4 bg-zinc-900 rounded-sm"></div>
            </div>
            <div className="text-white">
              <div className="text-xl font-extrabold tracking-tight group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">RAIJIN</div>
              <div className="text-xs text-zinc-400 -mt-1">GUARD</div>
            </div>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignUp 
                ? 'Create your RaijinGuard account'
                : 'Access your RaijinGuard account'
              }
            </h2>
            <p className="text-zinc-400">
              {showPassword 
                ? (isSignUp 
                    ? 'Create a secure password for your account.'
                    : 'Enter your password to continue securely.'
                  )
                : (isSignUp 
                    ? 'Join thousands of developers securing their code with AI-powered audits.'
                    : 'Sign in to secure your repositories and keep building with confidence.'
                  )
              }
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={showPassword ? handlePasswordSubmit : handleEmailSubmit}>
            {!showPassword ? (
              // Email Input
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  {isSignUp ? 'Enter your email address' : 'Enter your email'}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-zinc-700 placeholder-zinc-500 text-white bg-zinc-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent focus:z-10 sm:text-sm"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                </div>
              </div>
            ) : (
              // Password Input
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                  {isSignUp ? 'Create a password' : 'Enter your password'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-zinc-700 placeholder-zinc-500 text-white bg-zinc-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent focus:z-10 sm:text-sm"
                    placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password Input - Only show during sign up */}
            {showPassword && isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                  Confirm your password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-zinc-700 placeholder-zinc-500 text-white bg-zinc-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent focus:z-10 sm:text-sm"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-white text-sm font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 ease-out"
              >
{showPassword ? (isSignUp ? 'Create Account' : 'Sign In') : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {!showPassword && !isSignUp && (
              <div className="text-center">
                <p className="text-sm text-zinc-400">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={handleSignUpClick}
                    className="font-medium text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              By logging in, you acknowledge and agree to our{' '}
              <a href="#" className="text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">Terms, Conditions</a>, and{' '}
              <a href="#" className="text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">Usage Policy</a>, which outline how we protect your data and provide our services.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Animated Slideshow */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-zinc-400/10"></div>
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={image.url}
              alt={`Security professional ${index + 1}`}
            />
            <div className="absolute inset-0 bg-zinc-900/40"></div>
            
            {/* Quote overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              {/* Progress indicators */}
              <div className="flex space-x-2 mb-4">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded transition-all duration-300 ${
                      i === currentImageIndex 
                        ? 'w-8 bg-white' 
                        : 'w-8 bg-zinc-600'
                    }`}
                  />
                ))}
              </div>
              <blockquote className="text-white text-lg font-medium leading-relaxed">
                "{image.quote}"
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}