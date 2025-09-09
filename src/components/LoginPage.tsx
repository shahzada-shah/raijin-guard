import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !showPassword) {
      setShowPassword(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Route to user dashboard
      navigate('/user-dashboard');
    }
  };

  const handleBackClick = () => {
    if (showPassword) {
      setShowPassword(false);
      setPassword('');
    } else {
      navigate('/');
    }
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
              {showPassword ? 'Back to email' : 'Back to home'}
            </span>
          </button>

          {/* Logo */}
          <div className="flex items-center mb-12">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-gray-900 rounded-sm"></div>
            </div>
            <div className="text-white">
              <div className="text-xl font-bold tracking-tight">SECURE</div>
              <div className="text-xs text-zinc-400 -mt-1">CODE</div>
            </div>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Access your SecureCode account
            </h2>
            <p className="text-zinc-400">
              {showPassword 
                ? 'Enter your password to continue securely.'
                : 'Sign in to secure your repositories and keep building with confidence.'
              }
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={showPassword ? handlePasswordSubmit : handleEmailSubmit}>
            {!showPassword ? (
              // Email Input
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Enter your email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-zinc-700 placeholder-zinc-500 text-white bg-zinc-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent focus:z-10 sm:text-sm"
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
                  Enter your password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-zinc-700 placeholder-zinc-500 text-white bg-zinc-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
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

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-gray-900 bg-lime-400 hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400 transition-colors duration-200"
              >
                {showPassword ? 'Sign In' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {!showPassword && (
              <>
                <div className="text-center">
                  <span className="text-zinc-500">Or</span>
                </div>

                <div>
                  <button
                    type="button"
                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-zinc-700 text-sm font-medium rounded-lg text-white bg-zinc-800/50 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-zinc-400">
                    Don't have an account?{' '}
                    <a href="#" className="font-medium text-lime-400 hover:text-lime-300">
                      Sign up
                    </a>
                  </p>
                </div>
              </>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              By logging in, you acknowledge and agree to our{' '}
              <a href="#" className="text-lime-400 hover:text-lime-300">Terms, Conditions</a>, and{' '}
              <a href="#" className="text-lime-400 hover:text-lime-300">Usage Policy</a>, which outline how we protect your data and provide our services.
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
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-green-600/20"></div>
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
                        ? 'w-8 bg-lime-400' 
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