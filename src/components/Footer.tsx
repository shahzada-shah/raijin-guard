import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 bg-zinc-950 py-16 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-gray-900 rounded-sm"></div>
            </div>
            <div className="text-white">
              <div className="text-xl font-bold tracking-tight">SECURE</div>
              <div className="text-xs text-zinc-400 -mt-1">CODE</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-zinc-400 max-w-md leading-relaxed mb-8">
            SecureCode is designed to eliminate the guesswork and inefficiencies of security 
            management, giving you more time to focus on growing your business.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a 
              href="#" 
              className="text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <Twitter className="w-5 h-5" />
              <span className="text-sm">X (Twitter)</span>
            </a>
            <a 
              href="#" 
              className="text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-zinc-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">D</span>
              </div>
              <span className="text-sm">Discord</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">
              © 2025 · SecureCode · All rights reserved. Platform developed by{' '}
              <span className="text-white font-medium">SECUREBYTE</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}