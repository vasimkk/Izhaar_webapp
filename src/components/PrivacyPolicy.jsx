import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/user/profile')}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <FaArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-sm opacity-90 mt-2">Izhaar Love · Last updated: 17-12-2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Izhaar love ("we", "our", "us"), operated by <strong>Imint Financial Solutions</strong>, values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect user data when you use our website, mobile application, and services. By using Izhaar love, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-pink-600 mb-2">Personal Information</h3>
                <p className="text-gray-700">Name, email, phone, billing details, delivery address (for physical letter delivery)</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-600 mb-2">Service-Related Information</h3>
                <p className="text-gray-700">Content for letters, songs, videos, digital creations; preferences; Safe Date booking details</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-600 mb-2">Payment Information</h3>
                <p className="text-gray-700">Processed via secure third-party gateways. Izhaar love does not store card, UPI, or bank details. Only transaction status and reference IDs are received.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-600 mb-2">Technical Information</h3>
                <p className="text-gray-700">Device/browser type, IP address, app usage/logs, cookies/tracking (website only)</p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">3. How We Use Your Information</h2>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>To provide and deliver services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Process payments and transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Deliver letters and schedule Safe Date experiences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Communicate updates, notifications, and customer support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Improve service quality and user experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Comply with legal and regulatory obligations</span>
              </li>
            </ul>
          </section>

          {/* Sharing of Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">4. Sharing of Information</h2>
            <p className="text-gray-700 mb-4">
              We <strong>do not sell or rent</strong> your personal data. Your information is shared only with:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Payment gateways (for transaction processing)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Courier, delivery, and printing partners</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Safe Date venues and service providers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Legal authorities when required by law</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              All third parties are bound by confidentiality agreements and must maintain the same level of data protection.
            </p>
          </section>

          {/* Data Storage & Security */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">5. Data Storage & Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement <strong>reasonable technical and organizational security measures</strong> to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored securely with restricted access controls. However, <strong>no system is 100% secure</strong>, and we cannot guarantee absolute protection against all security threats.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              Personal data is retained only as long as required to provide services or comply with legal obligations. Transaction records are retained according to applicable laws and regulations.
            </p>
          </section>

          {/* User Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">7. User Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Access your personal data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Correct inaccurate or incomplete information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Request deletion of your data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold mt-1">•</span>
                <span>Withdraw consent where applicable</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise any of these rights, please contact us at <strong>support@izhaarlove.com</strong>
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Izhaar Love services are intended for users <strong>18 years or older</strong>. We do not knowingly collect or solicit personal information from minors. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          {/* Cookies & Tracking */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">9. Cookies & Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies on our website to enhance user experience and improve our services. Cookies help us:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Remember your preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Track website analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Provide personalized content</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              You may disable cookies in your browser settings at any time.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">10. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website or application may contain links to third-party websites and services. Izhaar Love is <strong>not responsible</strong> for their privacy practices, content, or security. Please review their privacy policies independently before sharing information.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              Izhaar Love may update this Privacy Policy at any time. Changes are <strong>effective immediately upon posting</strong>. We encourage you to review this policy periodically to stay informed about how we protect your data.
            </p>
          </section>

      

          {/* Footer */}
          <section className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-center text-gray-600 text-sm">
              © 2025 Izhaar Love · Operated by <strong>Imint Financial Solutions</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
