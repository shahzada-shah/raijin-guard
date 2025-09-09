import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(2); // Third item open by default

  const faqItems: FAQItem[] = [
    {
      question: "What is SecureCode, and who is it for?",
      answer: "SecureCode is a comprehensive security platform designed for developers, security teams, and organizations who want to ensure their code repositories are secure and compliant with industry standards."
    },
    {
      question: "How does SecureCode improve development efficiency?",
      answer: "SecureCode automates security scanning and vulnerability detection, reducing manual review time and allowing developers to focus on building features while maintaining security best practices."
    },
    {
      question: "Can I integrate SecureCode with tools I already use?",
      answer: "SecureCode is a SaaS platform built for development teams, providing them with an all-in-one ecosystem to manage repositories, collaborate with teams, and streamline security operations."
    },
    {
      question: "Is SecureCode designed for teams of all sizes?",
      answer: "Yes, SecureCode scales from individual developers to enterprise teams, offering flexible pricing plans and features that grow with your organization's security needs."
    },
    {
      question: "How does SecureCode handle repository data?",
      answer: "SecureCode uses enterprise-grade encryption and follows strict data privacy protocols. Your code never leaves your environment during scanning, and all reports are securely stored with bank-level security."
    },
    {
      question: "What kind of support does SecureCode provide?",
      answer: "We offer comprehensive support including documentation, video tutorials, live chat support, and dedicated account managers for enterprise customers to ensure successful implementation."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative z-10 py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Header */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-8 h-0.5 bg-white mr-4"></div>
              <span className="text-sm text-gray-300 uppercase tracking-wider font-medium">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              FREQUENTLY ASKED QUESTIONS
              <br />
              ABOUT SECURECODE
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index}
                className="border-b border-gray-700/50 last:border-b-0"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-6 text-left hover:text-white transition-colors duration-200"
                >
                  <span className="text-white font-medium text-lg pr-4">
                    {item.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="pb-6 pr-8">
                    <p className="text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}