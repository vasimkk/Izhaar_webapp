// --- CANVA-STYLE LETTER EDITOR (MODERN SINGLE PAGE) ---
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/config";
import { useLetter } from "../../../context/LetterContext";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.jpeg';
import bg4 from '../../../assets/temp/letter_04.jpeg';

const TEMPLATES = [
  { id: "1", title: "Romantic Pink", bg: bg1, border: "border-[#ffb6b9]" },
  { id: "2", title: "Rose Love", bg: bg2, border: "border-[#e75480]" },
  { id: "3", title: "Cute Couple", bg: bg3, border: "border-[#a3d8f4]" },
  { id: "4", title: "Classic Letter", bg: bg4, border: "border-[#deb887]" },
];

export default function WritePromptScreen() {
  const { setLetter } = useLetter();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    tone: "Love letter ❤️",
    attributes: "",
    moment: ""
  });

  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.receiverName.trim()) {
      alert("Please enter receiver's name");
      return;
    }

    setLoading(true);

    try {
      const fullPrompt = `
Write a ${formData.tone} letter.

Language rules:
- Use ONLY ONE language
- If the user's input is English, write fully in English
- If the input contains Hinglish/Hindi, write fully in Hinglish
- Do NOT mix languages

Sender: ${formData.senderName || "Anonymous"}
Receiver: ${formData.receiverName}

What I love about them:
${formData.attributes}

Special memory:
${formData.moment}

Writing rules:
- Maximum 120 words
- Sound like a real human, not a poem or AI
- Avoid dramatic openings like "My Dearest"
- No forced poetry, shayari, or jokes
- Emotion should feel natural and personal
- Emojis are optional (max 2) only if they feel natural
- Flow like a handwritten letter or WhatsApp message
- Simple, warm, emotionally honest language

The letter must feel genuine, personal, and real.
`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: fullPrompt }],
          },
        ],
      };

      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.finalLetter) {
        alert("AI could not generate a letter.");
        setLoading(false);
        return;
      }

      setGeneratedLetter(data.finalLetter);
      setLetter(data.finalLetter);
      setShowPreview(true);
      setLoading(false);
    } catch (err) {
      alert("Failed to generate letter.");
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(`/user/LetterIzhaar/final?templateId=${selectedTemplate}&letter=${encodeURIComponent(generatedLetter || "")}`);
  };

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

  // PREVIEW SCREEN
  if (showPreview && generatedLetter) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {[...Array(30)].map((_, i) => {
            const colors = ['#E91E63', '#9C27B0', '#3B82F6', '#FF5722', '#EC407A'];
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 4 + 3;
            const delay = Math.random() * 2;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: colors[Math.floor(Math.random() * colors.length)],
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  boxShadow: `0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]}`,
                  animation: `floatParticle ${duration}s linear infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
        </div>

        <style jsx>{`
          @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
            25% { transform: translate(10px, -20px) scale(1.2); opacity: 1; }
            50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.6; }
            75% { transform: translate(15px, -25px) scale(1.1); opacity: 0.9; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-stretch gap-6 p-4 sm:p-6 lg:p-8" style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)' }}>
          
          {/* LEFT SIDE - LETTER PREVIEW */}
          <div className="w-full lg:w-2/3 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center lg:text-left italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
              Your Letter ✨
            </h2>

            {/* Letter on template background */}
            <div
              className="rounded-2xl shadow-2xl overflow-hidden relative min-h-[500px]"
              style={{
                backgroundImage: `url(${currentTemplate.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative m-6 md:m-8   rounded-2xl p-6 md:p-8">
                <p
                  className="text-white text-base md:text-lg leading-relaxed whitespace-pre-line"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {generatedLetter}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - TEMPLATE SELECTOR & ACTIONS */}
          <div className="w-full lg:w-1/3 flex flex-col justify-center gap-6">
            {/* Template Selector */}
            <div className="bg-white/95 rounded-2xl p-6 shadow-2xl border-2 border-[#E91E63]/20">
              <h4 className="text-lg md:text-xl font-bold mb-4 text-center italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
                Pick a Style
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-[#E91E63] bg-[#E91E63]/10 shadow-lg scale-105'
                        : 'border-[#9C27B0]/30 hover:border-[#9C27B0]/60 bg-white/80'
                    }`}
                  >
                    <img
                      src={template.bg}
                      alt={template.title}
                      className="w-full h-24 object-cover rounded-md mb-2"
                    />
                    <div className="text-xs md:text-sm font-semibold text-[#2D1B4E] text-center truncate">
                      {template.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleContinue}
                className="w-full rounded-xl px-6 py-4 font-bold text-white transition-all hover:shadow-lg hover:scale-105 text-lg"
                style={{
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                  boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)'
                }}
              >
                Send Letter 💌
              </button>
              
             
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN EDITOR SCREEN
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background with Gradient */}
      <div style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)' }} className="fixed inset-0" />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => {
          const colors = ['#E91E63', '#9C27B0', '#3B82F6', '#FF5722', '#EC407A'];
          const size = Math.random() * 8 + 4;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 4 + 3;
          const delay = Math.random() * 2;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                background: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: '50%',
                pointerEvents: 'none',
                boxShadow: `0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]}`,
                animation: `floatParticle ${duration}s linear infinite`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          25% { transform: translate(10px, -20px) scale(1.2); opacity: 1; }
          50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.6; }
          75% { transform: translate(15px, -25px) scale(1.1); opacity: 0.9; }
        }
        @keyframes fadeInLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        {/* FORM INPUTS ONLY (template selection happens after generation) */}
        <div className="w-full max-w-2xl" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3 italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
                Craft Your Letter ✨
              </h2>
              <p className="text-lg text-[#6B5B8E]">Every word should come from your heart</p>
            </div>

            {/* Form Container with enhanced styling */}
            <div className="space-y-5">
              {/* Sender Name - Card Style */}
              <div className="group bg-gradient-to-br from-white/95 to-[#F5F3FF]/95 rounded-2xl p-6 border-2 border-[#E91E63]/20 hover:border-[#E91E63]/40 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">👤</div>
                  <label className="text-sm font-bold text-[#2D1B4E] uppercase tracking-wider">
                    Your Name <span className="text-xs text-[#9C27B0] font-normal">(Optional)</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Your name or stay Anonymous 🎭"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-[#E91E63]/20 focus:border-[#E91E63] focus:bg-white/99 focus:shadow-lg focus:scale-105 outline-none transition-all text-[#2D1B4E] placeholder-[#9C27B0]/50 font-medium"
                />
              </div>

              {/* Receiver Name - Card Style */}
              <div className="group bg-gradient-to-br from-white/95 to-[#FFE8F5]/95 rounded-2xl p-6 border-2 border-[#E91E63]/20 hover:border-[#E91E63]/40 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">💕</div>
                  <label className="text-sm font-bold text-[#2D1B4E] uppercase tracking-wider">
                    Their Name <span className="text-xs text-red-500 font-normal">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Sarah, Alex, My Love..."
                  value={formData.receiverName}
                  onChange={(e) => handleInputChange('receiverName', e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-[#E91E63]/20 focus:border-[#E91E63] focus:bg-white/99 focus:shadow-lg focus:scale-105 outline-none transition-all text-[#2D1B4E] placeholder-[#9C27B0]/50 font-medium"
                />
              </div>

              {/* Tone Selection - Enhanced Dropdown */}
              <div className="group bg-gradient-to-br from-white/95 to-[#E8F5FF]/95 rounded-2xl p-6 border-2 border-[#3B82F6]/20 hover:border-[#3B82F6]/40 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🎭</div>
                  <label className="text-sm font-bold text-[#2D1B4E] uppercase tracking-wider">
                    Letter Tone
                  </label>
                </div>
                <select
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-[#3B82F6]/20 focus:border-[#3B82F6] focus:bg-white/99 focus:shadow-lg outline-none transition-all text-[#2D1B4E] bg-white font-medium appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239C27B0' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option>❤️ Love letter</option>
                  <option>😂 Funny letter</option>
                  <option>😉 Flirty letter</option>
                  <option>🙏 Sorry letter</option>
                </select>
              </div>

              {/* Attributes - Textarea Card */}
              <div className="group bg-gradient-to-br from-white/95 to-[#FFE8F0]/95 rounded-2xl p-6 border-2 border-[#EC407A]/20 hover:border-[#EC407A]/40 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">⭐</div>
                  <label className="text-sm font-bold text-[#2D1B4E] uppercase tracking-wider">
                    What do you love about them?
                  </label>
                </div>
                <textarea
                  placeholder="Their beautiful smile, kindness, the way they laugh... 💫"
                  value={formData.attributes}
                  onChange={(e) => handleInputChange('attributes', e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-[#EC407A]/20 focus:border-[#EC407A] focus:bg-white/99 focus:shadow-lg outline-none transition-all text-[#2D1B4E] placeholder-[#9C27B0]/50 min-h-24 resize-none font-medium"
                />
              </div>

              {/* Special Memory - Textarea Card */}
              <div className="group bg-gradient-to-br from-white/95 to-[#F0E8FF]/95 rounded-2xl p-6 border-2 border-[#9C27B0]/20 hover:border-[#9C27B0]/40 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">🌹</div>
                  <label className="text-sm font-bold text-[#2D1B4E] uppercase tracking-wider">
                    Special Memory to Include
                  </label>
                </div>
                <textarea
                  placeholder="Our first meeting at the coffee shop, late-night calls, that moment when... 🌙"
                  value={formData.moment}
                  onChange={(e) => handleInputChange('moment', e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-[#9C27B0]/20 focus:border-[#9C27B0] focus:bg-white/99 focus:shadow-lg outline-none transition-all text-[#2D1B4E] placeholder-[#9C27B0]/50 min-h-24 resize-none font-medium"
                />
              </div>
            </div>

            {/* Generate Button - Enhanced */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-10 rounded-2xl px-8 py-4 font-bold text-white text-lg transition-all hover:shadow-2xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #3B82F6 100%)',
                boxShadow: '0 8px 25px 0 rgba(233, 30, 99, 0.5)'
              }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">✨</span>
                    Writing Your Letter...
                  </>
                ) : (
                  <>
                    Generate Letter
                    <span className="inline-block group-hover:scale-125 transition-transform">✨</span>
                  </>
                )}
              </div>
            </button>

            {/* Fun hint */}
            <p className="text-center text-sm text-[#6B5B8E]/60 mt-6 italic">
              💡 Tip: The more details you share, the more personal your letter will be!
            </p>
          </div>
      </div>
    </div>
  );
}
