// --- ELEMENTOR-STYLE LETTER EDITOR (PANEL + CANVAS LAYOUT) ---
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config/config";
import { useLetter } from "../../../context/LetterContext";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.png';
import bg3 from '../../../assets/temp/letter_03.png';
import bg4 from '../../../assets/temp/letter_04.png';
import bg5 from '../../../assets/temp/letter_05.png';
import bg6 from '../../../assets/temp/letter_06.jpeg';
import bg7 from '../../../assets/temp/letter_07.png';

import VintageScrollPreview from './VintageScrollPreview';

const TEMPLATES = [
  { id: "1", title: "Romantic Pink", bg: bg1 },
  { id: "2", title: "Rose Love", bg: bg2 },
  { id: "3", title: "Cute Couple", bg: bg3 },
  { id: "4", title: "Classic Letter", bg: bg4 },
  { id: "5", title: "Vintage Garden", bg: bg5 },
  { id: "6", title: "Moonlight", bg: bg6 },
  { id: "7", title: "Dreamy Sky", bg: bg7 },
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
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Editor states
  const [fontFamily, setFontFamily] = useState("'Playfair Display', serif");
  const [fontSize, setFontSize] = useState(18);
  const [textColor, setTextColor] = useState("#ffffff");
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [activePanel, setActivePanel] = useState('elements'); // elements | style
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [showEnvelopeAnimation, setShowEnvelopeAnimation] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

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
      window.history.pushState({ previewMode: true }, '');

      const handlePopState = (event) => {
        if (showPreview) {
          setShowPreview(false);
          setGeneratedLetter(null);
          localStorage.removeItem('izhaarLetterPreview');
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

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

  // ========== PREVIEW SCREEN (ELEMENTOR-STYLE PANEL + CANVAS) ==========
  if (showPreview && generatedLetter) {
    return (
      <div className="h-screen w-full flex flex-col bg-[#f5f5f5] overflow-hidden">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@400;700&family=Sacramento&display=swap');
          
          .panel-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .panel-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .panel-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
          .panel-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
          }

          /* Envelope Animation Styles */
          @keyframes envelopeFadeIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes flapOpen {
            0% {
              transform: rotateX(0deg);
            }
            100% {
              transform: rotateX(-180deg);
            }
          }

          @keyframes letterSlideUp {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-100%);
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(233, 30, 99, 0.5);
            }
            50% {
              box-shadow: 0 0 40px rgba(233, 30, 99, 0.8);
            }
          }

          .envelope-container {
            animation: envelopeFadeIn 0.6s ease-out;
          }

          .envelope-flap {
            transform-origin: top;
            transition: transform 1s ease-in-out;
          }

          .envelope-flap.open {
            animation: flapOpen 1s ease-in-out forwards;
          }

          .letter-paper {
            transition: transform 1.2s ease-in-out 0.8s;
          }

          .letter-paper.slide-up {
            animation: letterSlideUp 1.2s ease-in-out 0.8s forwards;
          }

          .envelope-body {
            animation: pulseGlow 2s ease-in-out infinite;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>

        {/* TOP HEADER BAR */}
        <header className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-600 shadow-md z-30">
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Left - Logo/Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setGeneratedLetter(null);
                    localStorage.removeItem('izhaarLetterPreview');
                  }}
                  className="p-2 bg-white/80 hover:bg-white rounded-lg transition-colors"
                  title="Back to Editor"
                >
                  <svg className="w-5 h-5 text-[#2D1B4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              {/* Center - Mobile Actions */}
              <div className="lg:hidden flex items-center gap-2 flex-wrap justify-end">
                <button
                  onClick={() => setShowMobilePanel(!showMobilePanel)}
                  className="px-3 py-2 bg-white/90 text-[#2D1B4E] rounded-lg text-xs font-semibold hover:bg-white transition-colors"
                >
                  {showMobilePanel ? 'Continue' : 'Edit Style'}
                </button>
                 <button
                  onClick={() => setIsEditingLetter(!isEditingLetter)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isEditingLetter
                    ? 'bg-white text-[#2D1B4E]'
                    : 'bg-white/90 text-[#2D1B4E] hover:bg-white'
                    }`}
                >
                  {isEditingLetter ? '✓ Done Editing' : 'Edit Text'}
                </button>
                <button
                  onClick={() => {
                    setShowEnvelopeAnimation(true);
                    setEnvelopeOpened(false);
                  }}
                  className="px-3 py-2 bg-white/20 text-white rounded-lg text-xs font-semibold hover:bg-white/30 transition-colors"
                  title="Preview letter scroll with ribbon"
                >
                  📜 Preview & Continue ➜
                </button>
               
              </div>
            </div>

            
          </div>

          {/* Right - Actions */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-3">
            <button
              onClick={() => {
                setShowEnvelopeAnimation(true);
                setEnvelopeOpened(false);
              }}
              className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
              title="Preview letter scroll with ribbon"
            >
              📜 Preview && Continue ➜
            </button>
            <button
              onClick={() => setIsEditingLetter(!isEditingLetter)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isEditingLetter
                ? 'bg-white text-[#2D1B4E]'
                : 'bg-white/90 text-[#2D1B4E] hover:bg-white'
                }`}
            >
              {isEditingLetter ? '✓ Done Editing' : '✏️ Edit Text'}
            </button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT PANEL (Desktop) / Mobile Drawer */}
          <aside className={`
            ${showMobilePanel ? 'fixed inset-0 z-40' : 'hidden'}
            lg:block lg:relative lg:z-0
            w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col
          `}>
            {/* Mobile Overlay */}
            {showMobilePanel && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-30"
                onClick={() => setShowMobilePanel(false)}
              />
            )}

            {/* Panel Content */}
            <div className="relative z-40 bg-white h-full flex flex-col lg:z-0">
              {/* Panel Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Customize</h2>
                  <button
                    onClick={() => setShowMobilePanel(false)}
                    className="lg:hidden p-1 hover:bg-gray-100 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tab Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActivePanel('elements')}
                    className={`py-2 px-3 rounded-md text-sm font-semibold transition-all ${activePanel === 'elements'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    <span className="mr-1">📝</span> Elements
                  </button>
                  <button
                    onClick={() => setActivePanel('style')}
                    className={`py-2 px-3 rounded-md text-sm font-semibold transition-all ${activePanel === 'style'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    <span className="mr-1">🎨</span> Style
                  </button>
                </div>
              </div>

              {/* Panel Content - Scrollable */}
              <div className="flex-1 overflow-y-auto panel-scrollbar p-4 space-y-4">

                {/* ELEMENTS TAB */}
                {activePanel === 'elements' && (
                  <>
                    {/* Background Templates Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Background</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {TEMPLATES.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                              localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, selectedTemplate: template.id }));
                            }}
                            className={`relative overflow-hidden rounded-lg transition-all ${selectedTemplate === template.id
                              ? 'ring-2 ring-pink-600 shadow-lg scale-105'
                              : 'ring-1 ring-gray-200 hover:ring-pink-400 hover:scale-105'
                              }`}
                          >
                            <div className="aspect-[3/4]">
                              <img
                                src={template.bg}
                                alt={template.title}
                                className="w-full h-full object-cover"
                              />
                              {selectedTemplate === template.id && (
                                <div className="absolute inset-0 bg-pink-600/20 flex items-center justify-center">
                                  <div className="bg-white rounded-full p-1">
                                    <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-xs font-semibold text-white">{template.title}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 my-4" />

                    {/* Letter Content Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Letter Text</span>
                          <button
                            onClick={() => setIsEditingLetter(!isEditingLetter)}
                            className="text-xs font-semibold text-pink-600 hover:text-pink-700"
                          >
                            {isEditingLetter ? 'Done' : 'Edit'}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {isEditingLetter ? 'Click on the letter to edit text' : 'Click Edit to modify your letter'}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* STYLE TAB */}
                {activePanel === 'style' && (
                  <>
                    {/* Font Family */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Typography</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Font Family</label>
                        <select
                          value={fontFamily}
                          onChange={(e) => {
                            const newFont = e.target.value;
                            setFontFamily(newFont);
                            const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                            localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, fontFamily: newFont }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
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
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 my-4" />

                    {/* Font Size */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Font Size</label>
                        <span className="text-sm font-semibold text-pink-600">{fontSize}px</span>
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>12px</span>
                        <span>32px</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 my-4" />

                    {/* Text Color */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Text Color</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['#ffffff', '#000000', '#E91E63', '#9C27B0', '#3B82F6', '#FFD700', '#FF5722', '#4CAF50'].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              setTextColor(color);
                              const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                              localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, textColor: color }));
                            }}
                            className={`w-full aspect-square rounded-lg transition-all ${textColor === color
                              ? 'ring-2 ring-pink-600 scale-110'
                              : 'ring-1 ring-gray-300 hover:scale-110'
                              }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Custom Color</label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            setTextColor(newColor);
                            const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                            localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, textColor: newColor }));
                          }}
                          className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </aside>

          {/* MAIN CANVAS AREA */}
          <main className="flex-1 overflow-auto bg-[#f5f5f5] p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Canvas Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Preview</h2>
                {isEditingLetter && (
                  <span className="text-sm text-pink-600 font-medium animate-pulse">
                    ✏️ Editing Mode
                  </span>
                )}
              </div>

              {/* Letter Preview Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div
                  className="relative min-h-[600px]"
                  style={{
                    backgroundImage: `url(${currentTemplate.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative p-8 lg:p-12">
                    {isEditingLetter ? (
                      <textarea
                        value={generatedLetter}
                        onChange={(e) => {
                          setGeneratedLetter(e.target.value);
                          const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                          localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, generatedLetter: e.target.value }));
                        }}
                        className="w-full min-h-[500px] bg-transparent border-2 border-dashed border-white/50 rounded-lg p-6 leading-relaxed resize-none focus:border-white focus:outline-none"
                        style={{
                          fontFamily: fontFamily,
                          fontSize: `${fontSize}px`,
                          color: textColor,
                          textShadow: textColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                        }}
                        placeholder="Type your letter here..."
                      />
                    ) : (
                      <p
                        className="leading-relaxed whitespace-pre-line"
                        style={{
                          fontFamily: fontFamily,
                          fontSize: `${fontSize}px`,
                          color: textColor,
                          textShadow: textColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                        }}
                      >
                        {generatedLetter}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* VINTAGE SCROLL PREVIEW */}
          <VintageScrollPreview
            isOpen={showEnvelopeAnimation}
            onClose={() => {
              setShowEnvelopeAnimation(false);
              setEnvelopeOpened(false);
            }}
            generatedLetter={generatedLetter}
            fontFamily={fontFamily}
            fontSize={fontSize}
            textColor={textColor}
            backgroundImage={currentTemplate.bg}
            selectedTemplate={selectedTemplate}
          />

          {/* OLD ENVELOPE OPENING ANIMATION OVERLAY - DISABLED */}
          {false && showEnvelopeAnimation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 animate-fadeIn">
              <div className="relative w-full max-w-2xl px-4">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowEnvelopeAnimation(false);
                    setEnvelopeOpened(false);
                  }}
                  className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Instruction Text */}
                {!envelopeOpened && (
                  <div className="text-center mb-8 animate-pulse">
                    <p className="text-2xl font-bold text-pink-600 mb-2">💌 You've Got a Letter!</p>
                    <p className="text-gray-600">Click the envelope to open it</p>
                  </div>
                )}

                {/* Envelope Container */}
                <div
                  className="envelope-container relative mx-auto cursor-pointer"
                  style={{
                    width: '400px',
                    height: '280px',
                    perspective: '1000px'
                  }}
                  onClick={() => {
                    if (!envelopeOpened) {
                      setEnvelopeOpened(true);
                      // Auto-close envelope animation after letter is revealed
                      setTimeout(() => {
                        setShowEnvelopeAnimation(false);
                        setEnvelopeOpened(false);
                      }, 3000);
                    }
                  }}
                >
                  {/* Envelope Body */}
                  <div
                    className="envelope-body absolute bottom-0 left-0 right-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg shadow-2xl"
                    style={{
                      height: '200px',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Envelope Front Decoration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-2">💝</div>
                        <p className="text-sm font-semibold opacity-80">For You</p>
                      </div>
                    </div>

                    {/* Envelope Bottom Flap (decorative lines) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-700/30" />
                  </div>

                  {/* Letter Paper Inside */}
                  <div
                    className={`letter-paper absolute left-1/2 -translate-x-1/2 bg-white rounded-t-lg shadow-xl overflow-hidden ${envelopeOpened ? 'slide-up' : ''}`}
                    style={{
                      width: '360px',
                      height: '240px',
                      bottom: '20px',
                      zIndex: 5
                    }}
                  >
                    <div className="p-6 h-full overflow-hidden">
                      <div className="text-center mb-3">
                        <p className="text-sm font-semibold text-pink-600">Your Letter Preview</p>
                      </div>
                      <div
                        className="text-sm leading-relaxed overflow-hidden"
                        style={{
                          fontFamily: fontFamily,
                          fontSize: '14px',
                          color: '#333',
                          maxHeight: '180px'
                        }}
                      >
                        {generatedLetter.substring(0, 200)}...
                      </div>
                    </div>
                  </div>

                  {/* Envelope Top Flap */}
                  <div
                    className={`envelope-flap absolute top-0 left-0 right-0 ${envelopeOpened ? 'open' : ''}`}
                    style={{
                      height: '120px',
                      transformStyle: 'preserve-3d',
                      zIndex: 10
                    }}
                  >
                    {/* Triangle Flap */}
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-pink-500 to-pink-600"
                      style={{
                        clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}
                    >
                      {/* Flap Seal */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl">💕</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After Opening Message */}
                {envelopeOpened && (
                  <div className="text-center mt-8 animate-fadeIn">
                    <p className="text-xl font-bold text-purple-600">✨ Opening your letter...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== FORM SCREEN (GENERATE LETTER) ==========
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
      <button
        onClick={() => navigate("/")}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(212, 197, 232, 0.3)',
          boxShadow: '0 4px 12px rgba(45, 27, 78, 0.15)'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2.5} 
          stroke="currentColor" 
          className="w-5 h-5 text-[#2D1B4E]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
       
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