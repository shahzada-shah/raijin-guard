import React from 'react';
import { Linkedin, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 bg-zinc-950 py-16 border-t border-zinc-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          {/* Logo */}
          <div className="flex items-center mb-8 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300 ease-out">
              <div className="w-4 h-4 bg-zinc-900 rounded-sm"></div>
            </div>
                    <div className="text-white">
                      <div className="text-xl font-extrabold tracking-tight group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">RAIJIN</div>
                      <div className="text-xs text-zinc-400 -mt-1">GUARD</div>
                    </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 max-w-md leading-relaxed mb-8 text-sm">
            RaijinGuard provides enterprise-grade security monitoring and threat detection,
            empowering development teams to build with confidence and deploy with certainty.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-zinc-400 hover:text-white transition-all duration-300 ease-out flex items-center gap-2 group"
            >
              <Linkedin className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
              <span className="text-sm group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">LinkedIn</span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-zinc-400 hover:text-white transition-all duration-300 ease-out flex items-center gap-2 group"
            >
              <Twitter className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
              <span className="text-sm group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">X (Twitter)</span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-zinc-400 hover:text-white transition-all duration-300 ease-out flex items-center gap-2 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
              <span className="text-sm group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">Discord</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs">
              © 2025 · RaijinGuard · All rights reserved. Platform developed by{' '}
              <span className="text-white font-semibold hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out cursor-pointer">KAZI DIGITAL STUDIO</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}