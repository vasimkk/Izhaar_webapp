import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function Security() {
  const navigate = useNavigate();
  const [currentMobile, setCurrentMobile] = useState("");

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
            Security
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 custom-scrollbar overflow-y-auto">
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(236,72,153,0.2)] p-6 sm:p-12 relative overflow-hidden space-y-12">
          {/* Soft Romantic Gradients */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full"></div>

          <div className="relative z-10 space-y-12">
            {/* Account Security Overview */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EC4891] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Account Security</h2>
              <p className="text-[#D1D5DC] leading-relaxed font-medium">
                Keep your Izhaar Love account secure with strong security practices. Your account is protected with industry-standard security measures. Follow the guidelines below to ensure your account remains safe and secure.
              </p>
            </section>

            {/* Verified Status */}
            {currentMobile && (
              <section className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-md flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-1 flex items-center gap-2">
                    <span>✓</span> Account Verified
                  </h3>
                  <p className="text-gray-400 text-sm">Your mobile number {currentMobile} is successfully linked.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <span className="text-xl">🔒</span>
                </div>
              </section>
            )}

            {/* Security Features */}
            <section>
              <h3 className="text-xl font-bold text-pink-300 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Security Features</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: "🔐", title: "Encrypted Data", desc: "Your personal information is encrypted and stored securely." },
                  { icon: "📱", title: "Verified Access", desc: "Account is linked to a verified mobile number for security." },
                  { icon: "🛡️", title: "Monitoring", desc: "We monitor suspicious activities and protect against unauthorized access." },
                  { icon: "🚨", title: "Real-time Alerts", desc: "Instant notifications for account activity and login attempts." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-pink-500/30 transition-all flex flex-col gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Security Guidelines */}
            <section className="p-8 rounded-3xl bg-gradient-to-br from-[#1a103c]/40 to-[#2e022d]/40 border border-white/10">
              <h3 className="text-xl font-bold text-[#EC4891] mb-6 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span>🔒</span> Security Guidelines
              </h3>
              <div className="grid gap-4">
                {[
                  { title: "Strong Password", desc: "Use at least 8 characters with numbers and symbols." },
                  { title: "Never Share OTP", desc: "Your OTP is strictly confidential. Never share it." },
                  { title: "Secure Connection", desc: "Avoid public Wi-Fi for sensitive transactions." },
                  { title: "Logout After Use", desc: "Always logout when using shared devices." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/20 p-4 rounded-2xl border-l-4 border-pink-500 backdrop-blur-sm">
                    <h4 className="font-bold text-gray-100 mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
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

