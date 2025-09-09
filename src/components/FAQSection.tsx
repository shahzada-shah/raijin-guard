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
      question: "What is RaijinGuard, and who is it for?",
      answer: "RaijinGuard is a comprehensive security platform designed for developers, security teams, and organizations who want to ensure their code repositories are secure and compliant with industry standards."
    },
    {
      question: "How does RaijinGuard improve development efficiency?",
      answer: "RaijinGuard automates security scanning and vulnerability detection, reducing manual review time and allowing developers to focus on building features while maintaining security best practices."
    },
    {
      question: "Can I integrate RaijinGuard with tools I already use?",
      answer: "RaijinGuard is a SaaS platform built for development teams, providing them with an all-in-one ecosystem to manage repositories, collaborate with teams, and streamline security operations."
    },
    {
      question: "Is RaijinGuard designed for teams of all sizes?",
      answer: "Yes, RaijinGuard scales from individual developers to enterprise teams, offering flexible pricing plans and features that grow with your organization's security needs."
    },
    {
      question: "How does RaijinGuard handle repository data?",
      answer: "RaijinGuard uses enterprise-grade encryption and follows strict data privacy protocols. Your code never leaves your environment during scanning, and all reports are securely stored with bank-level security."
    },
    {
      question: "What kind of support does RaijinGuard provide?",
      answer: "We offer comprehensive support including documentation, video tutorials, live chat support, and dedicated account managers for enterprise customers to ensure successful implementation."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative z-10 py-20 bg-zinc-950 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Header */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-white rounded-full mr-4 animate-pulse"></div>
              <span className="text-sm text-zinc-400 uppercase tracking-wider font-medium">FAQ</span>
            </div>
            <h2 className="text-[40px] md:text-[56px] lg:text-[64px] font-extrabold text-white leading-[1.1] tracking-tight">
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
                className="border-b border-zinc-800/50 last:border-b-0 group"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-6 text-left hover:text-white transition-all duration-300 ease-out group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]"
                >
                  <span className="text-zinc-400 font-semibold text-lg pr-4 group-hover:text-white transition-all duration-300 ease-out">
                    {item.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
                    ) : (
                      <Plus className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] transition-all duration-300 ease-out" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="pb-6 pr-8 overflow-hidden">
                    <div className="animate-in slide-in-from-top-2 duration-300 ease-out">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
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