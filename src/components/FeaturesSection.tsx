import React from 'react';
import { Eye, Database, MessageCircle, BarChart3, User, TrendingUp } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Eye,
      title: "Manage your activity",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: Database,
      title: "Import/Export data",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: MessageCircle,
      title: "Inquiries",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: BarChart3,
      title: "Agency dashboard",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: BarChart3,
      title: "Agency dashboard",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: TrendingUp,
      title: "Advanced analytics",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: User,
      title: "Influencer profiles",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: Database,
      title: "Data automatization",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: Eye,
      title: "Manage your activity",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: Database,
      title: "Import/Export data",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: MessageCircle,
      title: "Inquiries",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    },
    {
      icon: BarChart3,
      title: "Agency dashboard",
      description: "SecureCode is designed to eliminate the guesswork and inefficiencies of security management, giving you more time to focus on growing your business."
    }
  ];

  return (
    <section id="features" className="relative z-10 py-20 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-center mb-6">
            <div className="w-8 h-0.5 bg-lime-400 mr-4"></div>
            <span className="text-sm text-gray-400 uppercase tracking-wider font-medium">Explore key features</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
                A PLATFORM DEDICATED
                <br />
                FOR STREAMLINED OPERATIONS
              </h2>
            </div>
            <div>
              <p className="text-gray-400 text-lg leading-relaxed">
                SecureCode is designed to eliminate the guesswork and inefficiencies of security 
                management, giving you more time to focus on growing your business.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6 hover:bg-gray-900/50 transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-4 h-4 text-gray-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}