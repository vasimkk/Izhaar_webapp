import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
  const navigate = useNavigate();

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
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide">Contact Us</h1>
              <p className="text-xs text-white/60">Get in touch with Izhaar Love</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-12 space-y-12">

          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-4">
              We'd love to hear from you
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Have a question, feedback, or need assistance? Reach out to us through any of the channels below.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-pink-500/30 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(236,72,153,0.2)] group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300 mb-4 group-hover:scale-110 transition-transform">
                <FaEnvelope size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Email Support</h3>
              <p className="text-sm text-white/50 mb-3">Our team is here to help.</p>
              <a href="mailto:support@izhaarlove.com" className="text-pink-300 font-medium hover:text-pink-200 transition break-all">
                support@izhaarlove.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)] group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                <FaPhoneAlt size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Phone</h3>
              <p className="text-sm text-white/50 mb-3">Mon-Sat from 9am to 8pm.</p>
              <a href="tel:7075871167" className="text-purple-300 font-medium hover:text-purple-200 transition">
                +91 7075871167
              </a>
            </div>

            {/* Location Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 mb-4 group-hover:scale-110 transition-transform">
                <FaMapMarkerAlt size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Office</h3>
              <p className="text-sm text-white/50 mb-3">Come say hello at our HQ.</p>
              <p className="text-blue-300 font-medium">
                Hyderabad, India
              </p>
            </div>
          </div>

          {/* FAQ Teaser or Extra Info */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Imint Financial Solutions</h3>
            <p className="text-white/60 text-sm max-w-lg mx-auto">
              Operating Izhaar Love with a commitment to connecting hearts securely and beautifully.
            </p>
          </div>

          {/* Footer */}
          <section className="border-t border-white/10 pt-8 pb-4">
            <p className="text-center text-white/50 text-sm">
              © 2025 Izhaar Love · Operated by <strong className="text-white/80">Imint Financial Solutions</strong>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default ContactUs;