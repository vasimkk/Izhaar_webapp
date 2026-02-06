import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden text-white"
      style={{ background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)' }}>

      {/* Ambient Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
      </div>

      {/* Glass Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/user/profile')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition active:scale-95"
            >
              <FaArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide">Privacy Policy</h1>
              <p className="text-xs text-white/60">Last updated: 17-12-2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-12">

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">1. Introduction</h2>
            <p className="text-gray-200 leading-relaxed font-light text-lg">
              Izhaar love ("we", "our", "us"), operated by <strong className="text-white font-medium">Imint Financial Solutions</strong>, values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect user data when you use our website, mobile application, and services. By using Izhaar love, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6">2. Information We Collect</h2>
            <div className="grid gap-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Personal Information</h3>
                <p className="text-gray-300">Name, email, phone, billing details, delivery address (for physical letter delivery)</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Service-Related Information</h3>
                <p className="text-gray-300">Content for letters, songs, videos, digital creations; preferences; Safe Date booking details</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Payment Information</h3>
                <p className="text-gray-300">Processed via secure third-party gateways. Izhaar love does not store card, UPI, or bank details. Only transaction status and reference IDs are received.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Technical Information</h3>
                <p className="text-gray-300">Device/browser type, IP address, app usage/logs, cookies/tracking (website only)</p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">3. How We Use Your Information</h2>
            <ul className="space-y-4 text-gray-200 ml-2">
              {[
                "To provide and deliver services",
                "Process payments and transactions",
                "Deliver letters and schedule Safe Date experiences",
                "Communicate updates, notifications, and customer support",
                "Improve service quality and user experience",
                "Comply with legal and regulatory obligations"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-pink-400 font-bold mt-1 text-lg">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sharing of Information */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">4. Sharing of Information</h2>
            <p className="text-gray-200 mb-6">
              We <strong className="text-pink-300">do not sell or rent</strong> your personal data. Your information is shared only with:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Payment gateways (for transaction processing)",
                "Courier, delivery, and printing partners",
                "Safe Date venues and service providers",
                "Legal authorities when required by law"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-blue-900/20 rounded-xl border border-blue-500/20">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span className="text-gray-200">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-6 italic border-l-4 border-white/20 pl-4 py-2">
              All third parties are bound by confidentiality agreements and must maintain the same level of data protection.
            </p>
          </section>

          {/* Data Storage & Security */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">5. Data Storage & Security</h2>
            <p className="text-gray-200 leading-relaxed">
              We implement <strong className="text-white">reasonable technical and organizational security measures</strong> to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored securely with restricted access controls. However, <strong className="text-pink-300">no system is 100% secure</strong>, and we cannot guarantee absolute protection against all security threats.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">6. Data Retention</h2>
            <p className="text-gray-200 leading-relaxed">
              Personal data is retained only as long as required to provide services or comply with legal obligations. Transaction records are retained according to applicable laws and regulations.
            </p>
          </section>

          {/* User Rights */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">7. User Rights</h2>
            <p className="text-gray-200 mb-4">You have the right to:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Access your personal data",
                "Correct inaccurate or incomplete information",
                "Request deletion of your data",
                "Withdraw consent where applicable"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-pink-400">✓</span>
                  <span className="text-gray-200">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-pink-500/10 rounded-xl border border-pink-500/20 text-center">
              <p className="text-gray-200">
                To exercise any of these rights, please contact us at <a href="mailto:support@izhaarlove.com" className="text-pink-400 hover:text-pink-300 font-bold underline decoration-pink-500/30">support@izhaarlove.com</a>
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-200 leading-relaxed">
              Izhaar Love services are intended for users <strong className="text-white">18 years or older</strong>. We do not knowingly collect or solicit personal information from minors. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          {/* Cookies & Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">9. Cookies & Tracking</h2>
            <p className="text-gray-200 mb-4">
              We use cookies on our website to enhance user experience and improve our services. Cookies help us:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200 border border-white/10">Preferences</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200 border border-white/10">Analytics</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200 border border-white/10">Personalization</span>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              You may disable cookies in your browser settings at any time.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">10. Third-Party Links</h2>
            <p className="text-gray-200 leading-relaxed">
              Our website or application may contain links to third-party websites and services. Izhaar Love is <strong className="text-pink-300">not responsible</strong> for their privacy practices, content, or security. Please review their privacy policies independently before sharing information.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-200 leading-relaxed">
              Izhaar Love may update this Privacy Policy at any time. Changes are <strong className="text-white">effective immediately upon posting</strong>. We encourage you to review this policy periodically to stay informed about how we protect your data.
            </p>
          </section>

          {/* Footer */}
          <section className="border-t border-white/10 pt-8 mt-12 pb-8">
            <p className="text-center text-white/50 text-sm">
              © 2025 Izhaar Love · Operated by <strong className="text-white/80">Imint Financial Solutions</strong>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
