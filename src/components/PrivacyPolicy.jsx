import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>

      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10" style={{ background: '#000' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
          animation: 'float 20s ease-in-out infinite'
        }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition active:scale-95 border border-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Privacy Policy
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 custom-scrollbar overflow-y-auto">
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(236,72,153,0.2)] p-6 sm:p-12 relative overflow-hidden">
          {/* Soft Romantic Gradients */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full"></div>

          <div className="relative z-10 space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EC4891] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>1. Introduction</h2>
              <p className="text-[#D1D5DC] leading-relaxed font-medium">
                Izhaar love ("we", "our", "us"), operated by <strong className="text-white">Imint Financial Solutions</strong>, values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect user data when you use our website, mobile application, and services. By using Izhaar love, you agree to the terms of this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EC4891] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>2. Information We Collect</h2>
              <div className="grid gap-4">
                {[
                  { title: "Personal Information", content: "Name, email, phone, billing details, delivery address (for physical letter delivery)" },
                  { title: "Service-Related Information", content: "Content for letters, songs, videos, digital creations; preferences; Safe Date booking details" },
                  { title: "Payment Information", content: "Processed via secure third-party gateways. Izhaar love does not store card, UPI, or bank details. Only transaction status and reference IDs are received." },
                  { title: "Technical Information", content: "Device/browser type, IP address, app usage/logs, cookies/tracking (website only)" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-pink-500/30 transition-all">
                    <h3 className="text-lg font-bold text-pink-300 mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EC4891] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>3. How We Use Your Information</h2>
              <div className="space-y-3">
                {[
                  "To provide and deliver services",
                  "Process payments and transactions",
                  "Deliver letters and schedule Safe Date experiences",
                  "Communicate updates, notifications, and customer support",
                  "Improve service quality and user experience",
                  "Comply with legal and regulatory obligations"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[#EC4891] text-lg">✦</span>
                    <span className="text-gray-300 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Sharing of Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EC4891] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>4. Sharing of Information</h2>
              <p className="text-gray-300 mb-6 font-medium">
                We <strong className="text-pink-400">do not sell or rent</strong> your personal data. Your information is shared only with:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Payment gateways (for transaction processing)",
                  "Courier, delivery, and printing partners",
                  "Safe Date venues and service providers",
                  "Legal authorities when required by law"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-[#A928ED]/5 rounded-2xl border border-[#A928ED]/10">
                    <span className="text-[#A928ED]">•</span>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EC4891] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>7. User Rights</h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  "Access your personal data",
                  "Correct inaccurate information",
                  "Request deletion of data",
                  "Withdraw consent"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-500/20 text-center">
                <p className="text-gray-300 text-sm">
                  To exercise your rights: <a href="mailto:support@izhaarlove.com" className="text-pink-400 font-bold underline ml-1">support@izhaarlove.com</a>
                </p>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 Izhaar Love · Operated by <strong className="text-gray-400">Imint Financial Solutions</strong>
              </p>
            </footer>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 145, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

