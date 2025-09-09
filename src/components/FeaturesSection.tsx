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
    <section id="features" className="relative z-10 py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-center mb-6">
            <div className="w-8 h-0.5 bg-white mr-4"></div>
            <span className="text-sm text-gray-300 uppercase tracking-wider font-medium">Explore key features</span>
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
              <p className="text-gray-300 text-lg leading-relaxed">
                SecureCode is designed to eliminate the guesswork and inefficiencies of security 
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
                className="group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base mb-2 group-hover:text-gray-200 transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
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