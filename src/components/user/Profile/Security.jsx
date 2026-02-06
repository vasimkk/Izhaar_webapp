import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../../utils/api";

export default function Security() {
  const navigate = useNavigate();
  const [currentMobile, setCurrentMobile] = useState("");

  // Fetch current mobile number
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        const profile = res.data.profile || res.data;
        setCurrentMobile(profile.mobile || "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white"
      style={{ background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)' }}>

      {/* Ambient Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-pink-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
      </div>

      {/* Glass Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition active:scale-95"
            >
              <FaArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide">Security</h1>
              <p className="text-xs text-white/60">Protect your Izhaar Love account</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-12 space-y-8">

          {/* Security Overview Section */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">Account Security</h2>
            <p className="text-gray-200 leading-relaxed font-light text-lg">
              Keep your Izhaar Love account secure with strong security practices. Your account is protected with industry-standard security measures. Follow the guidelines below to ensure your account remains safe and secure.
            </p>
          </section>

          {/* Verified Status Section */}
          {currentMobile && (
            <section className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-1 flex items-center gap-2">
                    <span>✓</span> Account Verified
                  </h3>
                  <p className="text-gray-300">Your account security status is verified and protected</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <span className="text-2xl">🔒</span>
                </div>
              </div>
            </section>
          )}

          {/* Security Features Section */}
          <section className="bg-white/5 p-8 rounded-2xl border border-white/5">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">Security Features</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: "🔐", title: "Encrypted Data Storage", desc: "All your personal information is encrypted and stored securely" },
                { icon: "📱", title: "Mobile Verification", desc: "Your account is linked to a verified mobile number for additional security" },
                { icon: "🛡️", title: "Advanced Protection", desc: "We monitor suspicious activities and protect your account from unauthorized access" },
                { icon: "🚨", title: "Real-time Alerts", desc: "Receive instant notifications for any account activity and login attempts" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white/90 mb-1">{item.title}</h4>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Security Rules Section */}
          <section className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/20">
            <h3 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2">
              <span>🔒</span> Security Guidelines
            </h3>
            <div className="grid gap-4">
              {[
                { title: "Strong Password", desc: "Use a strong password with at least 8 characters including uppercase, lowercase, numbers, and special symbols" },
                { title: "Never Share OTP", desc: "Your OTP is confidential. Never share it with anyone, even Izhaar Love staff members" },
                { title: "Verify Contact Information", desc: "Keep your email and mobile number up to date for account recovery and important notifications" },
                { title: "Secure Connection", desc: "Always use Izhaar Love on secure, trusted networks. Avoid using public Wi-Fi for sensitive transactions" },
                { title: "Logout After Use", desc: "Always logout from your account when using shared devices or public computers" },
                { title: "Review Account Activity", desc: "Regularly check your account activity and report any suspicious login attempts immediately" },
                { title: "Update Regularly", desc: "Keep your app and device software up to date with the latest security patches" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-black/20 rounded-xl border-l-4 border-blue-500 backdrop-blur-sm hover:bg-black/30 transition">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-100 mb-1">{item.title}</h4>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Need Help Section */}
          <section className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6 rounded-2xl border border-pink-500/20">
            <h3 className="text-xl font-bold text-pink-300 mb-4">Need Help?</h3>
            <p className="text-gray-200 mb-4">If you notice any suspicious activity or have security concerns, please contact our support team immediately.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/50 uppercase">Email</p>
                <p className="text-white font-medium break-all">support@izhaarlove.com</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/50 uppercase">Phone</p>
                <p className="text-white font-medium">7075871167</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/50 uppercase">Available</p>
                <p className="text-white font-medium">Mon-Sat, 9AM-8PM</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t border-white/10 pt-8 mt-12 pb-4">
            <p className="text-center text-white/50 text-sm">
              © 2025 Izhaar Love · Operated by <strong className="text-white/80">Imint Financial Solutions</strong>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
