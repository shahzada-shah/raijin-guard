import React from 'react';
import { Eye, Database, MessageCircle, BarChart3, User, TrendingUp } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Eye,
      title: "Manage your activity",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: Database,
      title: "Import/Export data",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: MessageCircle,
      title: "Inquiries",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: BarChart3,
      title: "Agency dashboard",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: BarChart3,
      title: "Agency dashboard",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: TrendingUp,
      title: "Advanced analytics",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: User,
      title: "Influencer profiles",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: Database,
      title: "Data automatization",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: Eye,
      title: "Manage your activity",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: Database,
      title: "Import/Export data",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: MessageCircle,
      title: "Inquiries",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: BarChart3,
      title: "Agency dashboard",
      description: "RaijinGuard is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    }
  ];

  return (
    <section id="features" className="relative z-10 py-20 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-center mb-6">
            <div className="w-2 h-2 bg-white rounded-full mr-4 animate-pulse"></div>
            <span className="text-sm text-zinc-400 uppercase tracking-wider font-medium">Explore key features</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[40px] md:text-[56px] lg:text-[64px] font-extrabold text-white leading-[1.1] tracking-tight mb-8">
                A PLATFORM DEDICATED
                <br />
                FOR STREAMLINED OPERATIONS
              </h2>
            </div>
            <div>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                RaijinGuard is designed to eliminate the guesswork and inefficiencies of security 
                management, giving you more time to focus on growing your business.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ease-out group-hover:bg-zinc-900/20">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <IconComponent className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-zinc-400 font-semibold text-base mb-2 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300 ease-out">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}