// --- CANVA-STYLE LETTER EDITOR (MODERN SINGLE PAGE) ---
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config/config";
import { useLetter } from "../../../context/LetterContext";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
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
  const { receiverDetails } = useReceiverForLetter();
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
  const [submitting, setSubmitting] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Canva-style editor states
  const [fontFamily, setFontFamily] = useState("'Playfair Display', serif");
  const [fontSize, setFontSize] = useState(18);
  const [textColor, setTextColor] = useState("#ffffff");
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [openSection, setOpenSection] = useState('background'); // Track which accordion section is open, default to background

  // Restore letter data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('izhaarLetterPreview');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.generatedLetter) {
          setGeneratedLetter(parsed.generatedLetter);
          setLetter(parsed.generatedLetter);
          setShowPreview(true);
        }
        if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
        if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.textColor) setTextColor(parsed.textColor);
        if (parsed.formData) setFormData(parsed.formData);
      } catch (err) {
        console.error('Failed to restore letter data:', err);
      }
    }
  }, [setLetter]);

  // Handle browser back button when in preview mode
  useEffect(() => {
    if (showPreview) {
      // Push a new history state when entering preview
      window.history.pushState({ previewMode: true }, '');

      const handlePopState = (event) => {
        if (showPreview) {
          // Prevent navigation and clear preview instead
          setShowPreview(false);
          setGeneratedLetter(null);
          localStorage.removeItem('izhaarLetterPreview');
          // Push state again to prevent actual navigation
          window.history.pushState({ previewMode: false }, '');
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showPreview]);

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

      // Save to localStorage for persistence
      localStorage.setItem('izhaarLetterPreview', JSON.stringify({
        generatedLetter: data.finalLetter,
        selectedTemplate,
        fontFamily,
        fontSize,
        textColor,
        formData
      }));
    } catch (err) {
      alert("Failed to generate letter.");
      setLoading(false);
    }
  };

  const handleSubmitLetter = async () => {
    try {
      setSubmitting(true);
      const sender_id = receiverDetails?.sender_id || "USER123";
      const receiver = receiverDetails?.receiver || receiverDetails || {};
      const izhaar_code = receiverDetails?.izhaar_code || "IZHAAR123";
      
      // Send all styling data to backend for storage
      const payload = {
        izhaar_code,
        sender_id,
        type: "LETTER",
        message: generatedLetter,
        receiver,
        template_id: selectedTemplate,
        font_family: fontFamily,
        font_size: fontSize,
        text_color: textColor,
      };
      
      console.log('Submitting letter with styling:', payload);
      await api.post("/izhaar/submit", payload);

      // After successful letter submission, get latest payment and mark as USED
      try {
        const paymentRes = await api.get("/razorpay/payment-status", {
          params: { userId: sender_id, service: 'letter' }
        });
        const payment = paymentRes.data;
        if (payment && payment.payment_reference) {
          await api.post("/razorpay/mark-used", {
            userId: sender_id,
            paymentReference: payment.payment_reference
          });
          console.log("Payment marked as USED");
        } else {
          console.warn("No valid payment found to mark as USED");
        }
      } catch (err) {
        console.error("Failed to mark payment as USED", err);
      }

      // Clear localStorage after successful submission
      localStorage.removeItem('izhaarLetterPreview');
      toast.success("Success ❤️ Letter sent beautifully");
      navigate("/user/dashboard");
    } catch (err) {
      toast.error("Error: " + (err.message || "Failed to send letter"));
    } finally {
      setSubmitting(false);
    }
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
          
          /* Smooth scrolling for mobile drawer */
          .overflow-y-auto {
            -webkit-overflow-scrolling: touch;
          }
        `}</style>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)' }}>
          
          {/* Header with Back Button */}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setGeneratedLetter(null);
                  localStorage.removeItem('izhaarLetterPreview');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#2D1B4E] hover:text-pink-600 transition-all shadow-md hover:shadow-lg text-sm md:text-base font-semibold"
              >
                <span className="text-md">←</span>
                <span>Back to Edit</span>
              </button>
            </div>
          </div>

          {/* Header Row - Title and buttons */}
          <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto w-full mb-3 sm:mb-4">
            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent text-center mb-4">
              Your Letter ✨
            </h2>
            
            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Send Button - Prominent & Modern */}
              <button
                onClick={handleSubmitLetter}
                disabled={submitting}
                className={`group relative overflow-hidden px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold text-white shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-3 ${
                  submitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #3B82F6 100%)',
                  minWidth: '200px'
                }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-2xl relative z-10">💌</span>
                <span className="text-base sm:text-lg relative z-10">{submitting ? 'Sending...' : 'Send Letter'}</span>
              </button>
              
              {/* Customize Button - Mobile Only */}
              <button
                onClick={() => setShowMobileDrawer(true)}
                className="lg:hidden px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-semibold text-[#E91E63] bg-white border-2 border-[#E91E63] hover:bg-[#E91E63] hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                <span>✨</span>
                <span>Customize Style</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-4 flex-1 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
            
            {/* LETTER PREVIEW - Full width on mobile, flexible on desktop */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* Letter Card with Shadow */}
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-3 md:p-3 lg:p-4 shadow-2xl border border-white/60">
                {/* Letter on template background */}
                <div
                  className="rounded-2xl shadow-xl overflow-hidden relative min-h-[450px] md:min-h-[500px] lg:min-h-[580px]"
                  style={{
                    backgroundImage: `url(${currentTemplate.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative h-full overflow-y-auto">
                    <div className="p-6 md:p-6 lg:p-8 min-h-full flex items-start">
                      <p
                        className="leading-relaxed whitespace-pre-line w-full"
                        style={{ 
                          fontFamily: fontFamily,
                          fontSize: `${fontSize}px`,
                          color: textColor,
                          textShadow: textColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                        }}
                      >
                        {generatedLetter}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DESKTOP SIDEBAR - Canva-style vertical icon sidebar */}
            <div className="hidden lg:flex w-auto flex-col">
              <div className="sticky top-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-3">
                {/* Vertical Icon Navigation */}
                <div className="flex flex-col gap-2">
                  
                 

                  <div className="h-px bg-gray-200 my-2" />

                  {/* Font Style Button */}
                  <button
                    onClick={() => setOpenSection(openSection === 'font' ? null : 'font')}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all ${
                      openSection === 'font' 
                        ? 'bg-gradient-to-br from-[#E91E63] to-[#9C27B0] text-white shadow-lg' 
                        : 'bg-gray-50 text-[#2D1B4E] hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">✍️</span>
                    <span className="text-xs font-semibold">Font</span>
                  </button>

                  {/* Font Size Button */}
                  <button
                    onClick={() => setOpenSection(openSection === 'size' ? null : 'size')}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all ${
                      openSection === 'size' 
                        ? 'bg-gradient-to-br from-[#E91E63] to-[#9C27B0] text-white shadow-lg' 
                        : 'bg-gray-50 text-[#2D1B4E] hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">📏</span>
                    <span className="text-xs font-semibold">Size</span>
                  </button>

                  {/* Color Button */}
                  <button
                    onClick={() => setOpenSection(openSection === 'color' ? null : 'color')}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all ${
                      openSection === 'color' 
                        ? 'bg-gradient-to-br from-[#E91E63] to-[#9C27B0] text-white shadow-lg' 
                        : 'bg-gray-50 text-[#2D1B4E] hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">🎨</span>
                    <span className="text-xs font-semibold">Color</span>
                  </button>

                  {/* Background Button */}
                  <button
                    onClick={() => setOpenSection(openSection === 'background' ? null : 'background')}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all ${
                      openSection === 'background' 
                        ? 'bg-gradient-to-br from-[#E91E63] to-[#9C27B0] text-white shadow-lg' 
                        : 'bg-gray-50 text-[#2D1B4E] hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">🖼️</span>
                    <span className="text-xs font-semibold">Style</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DESKTOP CONTROL PANEL - Shows when sidebar button is clicked */}
            {openSection && (
              <div className="hidden lg:block w-80 ml-4">
                <div className="sticky top-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-5">
                  
              {openSection === 'font' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">✍️</span>
                    <h4 className="text-lg font-bold text-[#2D1B4E]">Font Style</h4>
                  </div>
                  <select
                    value={fontFamily}
                    onChange={(e) => {
                      const newFont = e.target.value;
                      setFontFamily(newFont);
                      const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                      localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, fontFamily: newFont }));
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E91E63] outline-none transition-all text-[#2D1B4E] bg-white shadow-sm cursor-pointer"
                  >
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Dancing Script', cursive">Dancing Script</option>
                    <option value="'Great Vibes', cursive">Great Vibes</option>
                    <option value="'Pacifico', cursive">Pacifico</option>
                    <option value="'Caveat', cursive">Caveat</option>
                    <option value="'Sacramento', cursive">Sacramento</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Arial', sans-serif">Arial</option>
                    <option value="'Verdana', sans-serif">Verdana</option>
                  </select>
                </div>
              )}

              {openSection === 'size' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📏</span>
                      <h4 className="text-lg font-bold text-[#2D1B4E]">Font Size</h4>
                    </div>
                    <span className="text-sm font-bold text-[#E91E63] bg-[#E91E63]/10 px-3 py-1 rounded-lg">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="32"
                    value={fontSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      setFontSize(newSize);
                      const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                      localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, fontSize: newSize }));
                    }}
                    className="w-full h-3 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[#6B5B8E] mt-3 font-medium">
                    <span>12px Small</span>
                    <span>32px Large</span>
                  </div>
                </div>
              )}

              {openSection === 'color' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🎨</span>
                    <h4 className="text-lg font-bold text-[#2D1B4E]">Text Color</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {['#ffffff', '#000000', '#E91E63', '#9C27B0', '#3B82F6', '#FFD700', '#FF5722', '#4CAF50'].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setTextColor(color);
                          const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                          localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, textColor: color }));
                        }}
                        className={`w-full h-12 rounded-xl transition-all shadow-md hover:scale-110 ${
                          textColor === color ? 'ring-4 ring-[#E91E63] scale-110' : 'ring-2 ring-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <label className="block text-sm font-semibold text-[#6B5B8E] mb-2">Custom Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setTextColor(newColor);
                      const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                      localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, textColor: newColor }));
                    }}
                    className="w-full h-14 rounded-xl cursor-pointer border-2 border-gray-200"
                  />
                </div>
              )}

              {openSection === 'background' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🖼️</span>
                    <h4 className="text-lg font-bold text-[#2D1B4E]">Background Style</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                          localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, selectedTemplate: template.id }));
                        }}
                        className={`p-2 rounded-xl transition-all ${
                          selectedTemplate === template.id
                            ? 'ring-4 ring-[#E91E63] bg-[#E91E63]/5'
                            : 'ring-2 ring-gray-200 hover:ring-[#E91E63]/50 bg-white'
                        }`}
                      >
                        <div className="relative overflow-hidden rounded-lg mb-2">
                          <img
                            src={template.bg}
                            alt={template.title}
                            className="w-full h-24 object-cover"
                          />
                          {selectedTemplate === template.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#E91E63]/20">
                              <span className="text-2xl">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-bold text-[#2D1B4E] text-center">
                          {template.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
            )}
          </div>

          {/* MOBILE BOTTOM DRAWER */}
          <div className={`lg:hidden fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out ${
            showMobileDrawer ? 'translate-y-0' : 'translate-y-full'
          }`}>
            {/* Backdrop */}
            {showMobileDrawer && (
              <div 
                className="fixed inset-0 bg-black/50 -z-10"
                onClick={() => setShowMobileDrawer(false)}
              />
            )}
            
            {/* Drawer Content */}
            <div className="bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
              {/* Drawer Handle */}
              <div className="flex items-center justify-center py-3 border-b border-gray-200">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
                  Customize Your Letter
                </h3>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              {/* Drawer Controls */}
              <div className="p-5 space-y-4">
                {/* Font Style */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">✍️</span>
                    <h4 className="text-lg font-bold text-[#2D1B4E]">Font Style</h4>
                  </div>
                  <select
                    value={fontFamily}
                    onChange={(e) => {
                      const newFont = e.target.value;
                      setFontFamily(newFont);
                      const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                      localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, fontFamily: newFont }));
                    }}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-purple-200 focus:border-[#E91E63] outline-none transition-all text-[#2D1B4E] text-base bg-white shadow-sm"
                  >
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Dancing Script', cursive">Dancing Script</option>
                    <option value="'Great Vibes', cursive">Great Vibes</option>
                    <option value="'Pacifico', cursive">Pacifico</option>
                    <option value="'Caveat', cursive">Caveat</option>
                    <option value="'Sacramento', cursive">Sacramento</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Arial', sans-serif">Arial</option>
                    <option value="'Verdana', sans-serif">Verdana</option>
                  </select>
                </div>

                {/* Font Size */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📏</span>
                      <h4 className="text-lg font-bold text-[#2D1B4E]">Font Size</h4>
                    </div>
                    <span className="text-base font-bold text-[#E91E63] bg-[#E91E63]/10 px-3 py-1 rounded-lg">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="32"
                    value={fontSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      setFontSize(newSize);
                      const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                      localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, fontSize: newSize }));
                    }}
                    className="w-full h-3 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-[#6B5B8E] mt-2 font-medium">
                    <span>12px</span>
                    <span>22px</span>
                    <span>32px</span>
                  </div>
                </div>

                {/* Text Color */}
                <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-4 border border-pink-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎨</span>
                    <h4 className="text-lg font-bold text-[#2D1B4E]">Text Color</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {['#ffffff', '#000000', '#E91E63', '#9C27B0', '#3B82F6', '#FFD700', '#FF5722', '#4CAF50'].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setTextColor(color);
                          const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                          localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, textColor: color }));
                        }}
                        className={`aspect-square rounded-xl transition-all shadow-md active:scale-95 ${
                          textColor === color ? 'ring-4 ring-[#E91E63] scale-110' : 'ring-2 ring-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <label className="block text-sm font-semibold text-[#6B5B8E] mb-2">Custom Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setTextColor(newColor);
                      const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                      localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, textColor: newColor }));
                    }}
                    className="w-full h-14 rounded-xl cursor-pointer border-2 border-gray-200"
                  />
                </div>

                {/* Background Templates */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🖼️</span>
                    <h4 className="text-lg font-bold text-[#2D1B4E]">Background Style</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                          localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, selectedTemplate: template.id }));
                        }}
                        className={`p-2 rounded-xl transition-all active:scale-95 ${
                          selectedTemplate === template.id
                            ? 'ring-4 ring-[#E91E63] bg-[#E91E63]/10'
                            : 'ring-2 ring-gray-200 bg-white'
                        }`}
                      >
                        <div className="relative overflow-hidden rounded-lg mb-2">
                          <img
                            src={template.bg}
                            alt={template.title}
                            className="w-full h-24 object-cover"
                          />
                          {selectedTemplate === template.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#E91E63]/20">
                              <span className="text-3xl">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-bold text-[#2D1B4E] text-center">
                          {template.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send Button */}
                <button
                  onClick={() => {
                    setShowMobileDrawer(false);
                    handleSubmitLetter();
                  }}
                  disabled={submitting}
                  className={`w-full rounded-2xl px-6 py-5 font-bold text-white text-xl relative overflow-hidden group shadow-2xl ${
                    submitting ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)'
                  }}
                >
                  <div className="relative flex items-center justify-center gap-2">
                    <span>{submitting ? 'Sending Letter...' : 'Send Letter'}</span>
                    <span className="text-2xl">💌</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@400;700&family=Sacramento&display=swap" rel="stylesheet" />
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
        
        {/* Mobile Back Button */}
        <div className="w-full max-w-2xl relative z-10 pt-2 md:pt-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#2D1B4E] hover:text-pink-600 transition text-sm md:text-base font-medium md:hidden"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
        </div>

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
