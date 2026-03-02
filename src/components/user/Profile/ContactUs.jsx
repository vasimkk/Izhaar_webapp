import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
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
            Contact Us
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
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                We'd love to hear from you
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                Have a question, feedback, or need assistance? Reach out to us through any of the channels below.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "✉️",
                  title: "Email Support",
                  sub: "Our team is here to help.",
                  val: "support@izhaarlove.com",
                  link: "mailto:support@izhaarlove.com",
                  color: "from-pink-500/20"
                },
                {
                  icon: "📞",
                  title: "Phone",
                  sub: "Mon-Sat, 9am - 8pm.",
                  val: "+91 7075871167",
                  link: "tel:7075871167",
                  color: "from-purple-500/20"
                },
                {
                  icon: "📍",
                  title: "Office",
                  sub: "Come say hello at our HQ.",
                  val: "Hyderabad, India",
                  link: "#",
                  color: "from-blue-500/20"
                }
              ].map((item, idx) => (
                <div key={idx} className={`p-8 rounded-3xl bg-gradient-to-br ${item.color} to-transparent border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 group flex flex-col items-center text-center shadow-lg`}>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{item.sub}</p>
                  <a href={item.link} className="text-pink-400 font-bold hover:text-pink-300 transition break-all text-sm">
                    {item.val}
                  </a>
                </div>
              ))}
            </div>

            {/* Company Info */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-bold text-white mb-2 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>Imint Financial Solutions</h3>
              <p className="text-gray-400 text-sm max-w-lg mx-auto relative z-10 font-medium">
                Operating Izhaar Love with a commitment to connecting hearts securely and beautifully.
              </p>
            </div>

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
};

export default ContactUs;