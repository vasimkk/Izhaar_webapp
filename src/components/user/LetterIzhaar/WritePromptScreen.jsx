// --- ELEMENTOR-STYLE LETTER EDITOR (PANEL + CANVAS LAYOUT) ---
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config/config";
import { useLetter } from "../../../context/LetterContext";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import bg1 from '../../../assets/temp/letter_01.png';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.png';
import bg4 from '../../../assets/temp/letter_04.png';
import bg5 from '../../../assets/temp/letter_05.png';
import bg6 from '../../../assets/temp/letter_06.jpeg';
import bg7 from '../../../assets/temp/letter_07.png';
import bg8 from '../../../assets/temp/letter_08.png';
import bg9 from '../../../assets/temp/letter_09.png';
import bg10 from '../../../assets/temp/letter_10.png';

import VintageScrollPreview from './VintageScrollPreview';


const TEMPLATES = [
  { id: "1", title: "Romantic Pink", bg: bg1 },
  { id: "2", title: "Rose Love", bg: bg2 },
  { id: "3", title: "Cute Couple", bg: bg3 },
  { id: "4", title: "Classic Letter", bg: bg4 },
  { id: "5", title: "Vintage Garden", bg: bg5 },
  { id: "6", title: "Moonlight", bg: bg6 },
  { id: "7", title: "Dreamy Sky", bg: bg7 },
  { id: "8", title: "Soft Peony", bg: bg8 },
  { id: "9", title: "Floral Whisper", bg: bg9 },
  { id: "10", title: "Golden Elegance", bg: bg10 },
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

  const [selectedTemplate, setSelectedTemplate] = useState("2");
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Editor states
  const [fontFamily, setFontFamily] = useState("'Playfair Display', serif");
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [activePanel, setActivePanel] = useState('elements'); // elements | style
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [showEnvelopeAnimation, setShowEnvelopeAnimation] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  // Save letter as draft
  const saveDraft = async () => {
    if (!formData.senderName.trim()) {
      toast.warning('Please enter your name to save draft');
      return false;
    }

    try {
      const draftData = {
        senderName: formData.senderName,
        receiverName: formData.receiverName,
        tone: formData.tone,
        attributes: formData.attributes,
        moment: formData.moment,
        selectedTemplate,
        fontFamily,
        fontSize,
        textColor,
        generatedLetter,
        status: 'draft'
      };

      // Save to localStorage
      localStorage.setItem('izhaarLetterDraft', JSON.stringify(draftData));

      // toast.success('Letter saved as draft!');
      return true;
    } catch (err) {
      console.error('Failed to save draft:', err);
      toast.error('Failed to save draft');
      return false;
    }
  };

  // Handle back with confirmation
  const handleBackClick = () => {
    console.log('Back button clicked', {
      showPreview,
      hasData: formData.senderName.trim() || formData.receiverName.trim() || formData.attributes.trim() || formData.moment.trim()
    });

    // If in preview mode, show confirmation
    if (showPreview) {
      setShowBackConfirm(true);
      return;
    }

    // If in form mode with data, show confirmation
    if (formData.senderName.trim() || formData.receiverName.trim() || formData.attributes.trim() || formData.moment.trim()) {
      console.log('Showing confirmation modal');
      setShowBackConfirm(true);
    } else {
      console.log('No data, going back directly');
      navigate('/user/letter-izhaar');
    }
  };

  // Pre-fill receiver details from context if available
  useEffect(() => {
    if (receiverDetails && receiverDetails.name) {
      setFormData(prev => ({
        ...prev,
        receiverName: receiverDetails.name
      }));
    }
  }, [receiverDetails]);

  // Load draft data on mount
  useEffect(() => {
    const loadDraft = () => {
      try {
        // Check for draft in localStorage
        const draftData = localStorage.getItem('izhaarLetterDraft');
        if (draftData) {
          const parsed = JSON.parse(draftData);
          console.log('Loading draft data:', parsed);

          // Restore form data
          if (parsed.senderName || parsed.receiverName || parsed.tone || parsed.attributes || parsed.moment) {
            setFormData({
              senderName: parsed.senderName || '',
              receiverName: parsed.receiverName || '',
              tone: parsed.tone || 'Love letter ❤️',
              attributes: parsed.attributes || '',
              moment: parsed.moment || ''
            });
          }

          // Restore generated letter and preview mode if available
          if (parsed.generatedLetter) {
            setGeneratedLetter(parsed.generatedLetter);
            setLetter(parsed.generatedLetter);
            setShowPreview(true);
          }

          // Restore customization settings
          if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
          if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
          if (parsed.fontSize) setFontSize(parsed.fontSize);
          if (parsed.textColor) setTextColor(parsed.textColor);
        }
      } catch (err) {
        console.error('Failed to load draft:', err);
      }
    };

    loadDraft();
  }, [setLetter]);

  // Keep existing preview restoration logic for backward compatibility
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
      <div className="h-screen w-full flex flex-col overflow-hidden relative" style={{
        background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)'
      }}>
        {/* Ambient Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
        </div>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@400;700&family=Sacramento&display=swap');
          
          .panel-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .panel-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }
          .panel-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          .panel-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
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
        <header className="sticky top-0 z-30 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg relative">
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Left - Logo/Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBackConfirm(true)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors text-white"
                  title="Back to Editor"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-white font-bold ml-2">Letter Editor</span>
              </div>

              {/* Center - Mobile Actions */}
              <div className="lg:hidden flex items-center gap-2 flex-wrap justify-end">
                <button
                  onClick={() => setShowMobilePanel(!showMobilePanel)}
                  className="px-3 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors"
                >
                  {showMobilePanel ? 'Continue' : 'Edit Style'}
                </button>
                <button
                  onClick={() => setIsEditingLetter(!isEditingLetter)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors border border-white/10 ${isEditingLetter
                    ? 'bg-pink-600 text-white border-pink-500'
                    : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                  {isEditingLetter ? '✓ Done' : 'Edit Text'}
                </button>
                <button
                  onClick={() => {
                    setShowEnvelopeAnimation(true);
                    setEnvelopeOpened(false);
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all border border-white/10"
                >
                  Continue ➜
                </button>

              </div>
            </div>


          </div>

          {/* Right - Actions */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-[6px] absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setIsEditingLetter(!isEditingLetter)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${isEditingLetter
                ? 'bg-pink-600 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                }`}
            >
              {isEditingLetter ? '✓ Done Editing' : '✏️ Edit Text'}
            </button>
            <button
              onClick={() => {
                setShowEnvelopeAnimation(true);
                setEnvelopeOpened(false);
              }}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all border border-white/10 hover:scale-105"
            >
              Preview Envelope 💌
            </button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT PANEL (Desktop) / Mobile Drawer */}
          <aside className={`
            ${showMobilePanel ? 'fixed inset-0 z-40' : 'hidden'}
            lg:block lg:relative lg:z-0
            w-full lg:w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col
          `}>
            {/* Mobile Overlay */}
            {showMobilePanel && (
              <div
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                onClick={() => setShowMobilePanel(false)}
              />
            )}

            {/* Panel Content */}
            <div className="relative z-40 bg-[rgba(15,7,32,0.6)] backdrop-blur-xl h-full flex flex-col lg:z-0 border-r border-white/10">
              {/* Panel Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-white/90 uppercase tracking-wide">Customize</h2>
                  <button
                    onClick={() => setShowMobilePanel(false)}
                    className="lg:hidden p-1 hover:bg-white/10 rounded text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tab Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setActivePanel('elements')}
                    className={`py-2 px-3 rounded-md text-sm font-semibold transition-all ${activePanel === 'elements'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span className="mr-1">📝</span> Elements
                  </button>
                  <button
                    onClick={() => setActivePanel('style')}
                    className={`py-2 px-3 rounded-md text-sm font-semibold transition-all ${activePanel === 'style'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
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
                      <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Background</h3>
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
                              ? 'ring-2 ring-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)] scale-105'
                              : 'ring-1 ring-white/10 hover:ring-pink-400 hover:scale-105'
                              }`}
                          >
                            <div className="aspect-[3/4]">
                              <img
                                src={template.bg}
                                alt={template.title}
                                className="w-full h-full object-cover"
                              />
                              {selectedTemplate === template.id && (
                                <div className="absolute inset-0 bg-pink-600/30 flex items-center justify-center backdrop-blur-[1px]">
                                  <div className="bg-white rounded-full p-1 shadow-lg">
                                    <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                              <p className="text-xs font-semibold text-white">{template.title}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/10 my-4" />

                    {/* Letter Content Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Content</h3>
                      <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white/90">Letter Text</span>
                          <button
                            onClick={() => setIsEditingLetter(!isEditingLetter)}
                            className="text-xs font-semibold text-pink-400 hover:text-pink-300"
                          >
                            {isEditingLetter ? 'Done' : 'Edit'}
                          </button>
                        </div>
                        <p className="text-xs text-white/50">
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
                      <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Typography</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Font Family</label>
                        <select
                          value={fontFamily}
                          onChange={(e) => {
                            const newFont = e.target.value;
                            setFontFamily(newFont);
                            const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                            localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, fontFamily: newFont }));
                          }}
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none cursor-pointer"
                        >
                          <option value="'Playfair Display', serif" className="bg-gray-900">Playfair Display</option>
                          <option value="'Dancing Script', cursive" className="bg-gray-900">Dancing Script</option>
                          <option value="'Great Vibes', cursive" className="bg-gray-900">Great Vibes</option>
                          <option value="'Pacifico', cursive" className="bg-gray-900">Pacifico</option>
                          <option value="'Caveat', cursive" className="bg-gray-900">Caveat</option>
                          <option value="'Sacramento', cursive" className="bg-gray-900">Sacramento</option>
                          <option value="'Georgia', serif" className="bg-gray-900">Georgia</option>
                          <option value="'Times New Roman', serif" className="bg-gray-900">Times New Roman</option>
                          <option value="'Arial', sans-serif" className="bg-gray-900">Arial</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-white/10 my-4" />

                    {/* Font Size */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-white/80">Font Size</label>
                        <span className="text-sm font-semibold text-pink-400">{fontSize}px</span>
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
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                      <div className="flex justify-between text-xs text-white/40">
                        <span>12px</span>
                        <span>32px</span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 my-4" />

                    {/* Text Color */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white/80">Text Color</label>
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
                              ? 'ring-2 ring-pink-500 scale-110 shadow-lg'
                              : 'ring-1 ring-white/20 hover:scale-110'
                              }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-white/60 mb-2">Custom Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => {
                              const newColor = e.target.value;
                              setTextColor(newColor);
                              const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                              localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, textColor: newColor }));
                            }}
                            className="w-full h-10 rounded-lg cursor-pointer border border-white/20 bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </aside>

          {/* MAIN CANVAS AREA */}
          {/* MAIN CANVAS AREA */}
          {/* MAIN CANVAS AREA */}
          <main className="flex-1 overflow-auto p-4 lg:p-8 relative z-10 flex justify-center">
            <div className="w-full max-w-[380px] mx-auto my-auto">
              {/* Canvas Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white/90">Continue</h2>
                {isEditingLetter && (
                  <span className="text-sm text-pink-400 font-medium animate-pulse flex items-center gap-1">
                    ✏️ Editing Mode
                  </span>
                )}
              </div>

              {/* Letter Preview Card */}
              <div
                className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/10"
                style={{
                  transform: isEditingLetter ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div
                  className="relative min-h-[600px] transition-all"
                  style={{
                    backgroundImage: `url(${currentTemplate.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="relative p-8 lg:p-12">
                    {isEditingLetter ? (
                      <textarea
                        value={generatedLetter}
                        onChange={(e) => {
                          setGeneratedLetter(e.target.value);
                          const saved = JSON.parse(localStorage.getItem('izhaarLetterPreview') || '{}');
                          localStorage.setItem('izhaarLetterPreview', JSON.stringify({ ...saved, generatedLetter: e.target.value }));
                        }}
                        className="w-full min-h-[500px] bg-white/20 backdrop-blur-sm border-2 border-dashed border-pink-400/50 rounded-lg p-6 leading-relaxed resize-none focus:border-pink-500 focus:outline-none focus:bg-white/30 transition-all text-shadow"
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

        {/* Back Confirmation Modal for Preview Screen */}
        {showBackConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowBackConfirm(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                title="Close"
              >
                <svg className="w-6 h-6 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-2xl font-bold text-[#2D1B4E] mb-3">Save Your Letter?</h3>
              <p className="text-[#6B5B8E] mb-6">Would you like to save this letter as a draft before leaving?</p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Clear all localStorage data
                    localStorage.removeItem('izhaarLetterDraft');
                    localStorage.removeItem('izhaarLetterPreview');
                    setShowBackConfirm(false);
                    navigate('/user/letter-izhaar');
                  }}
                  className="flex-1 px-4 py-3 rounded-full border-2 border-red-300/50 text-red-500 font-semibold hover:bg-red-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const saved = await saveDraft();
                    if (saved) {
                      setShowBackConfirm(false);
                      navigate('/user/dashboard');
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white font-semibold hover:shadow-lg transition-all"
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== FORM SCREEN (GENERATE LETTER) ==========
  // MAIN EDITOR SCREEN
  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      backgroundAttachment: 'fixed'
    }}>

      {/* Ambient Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Back Confirmation Modal - MOVED TO TOP LEVEL */}
      {showBackConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                console.log('Close button clicked');
                setShowBackConfirm(false);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10 text-white/70 hover:text-white"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-white mb-3">Unsaved Changes</h3>
            <p className="text-white/70 mb-6">You have unsaved details. What would you like to do?</p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  console.log('Discard clicked');
                  setShowBackConfirm(false);
                  navigate('/user/dashboard');
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-red-500/50 text-red-400 font-semibold hover:bg-red-500/10 transition-all"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  console.log('Cancel clicked - clearing localStorage');
                  // Clear all localStorage data
                  localStorage.removeItem('izhaarLetterDraft');
                  localStorage.removeItem('izhaarLetterPreview');
                  setShowBackConfirm(false);
                  navigate('/user/letter-izhaar');
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => {
          const colors = ['rgba(233, 30, 99, 0.6)', 'rgba(156, 39, 176, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(255, 255, 255, 0.4)'];
          const size = Math.random() * 6 + 2;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 6 + 4;
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
                boxShadow: `0 0 ${size * 3}px ${colors[Math.floor(Math.random() * colors.length)]}`,
                animation: `floatParticle ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                filter: 'blur(1px)'
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          25% { transform: translate(10px, -20px) scale(1.2); opacity: 0.8; }
          50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.3; }
          75% { transform: translate(15px, -25px) scale(1.1); opacity: 0.6; }
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
          onClick={handleBackClick}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* FORM INPUTS ONLY (template selection happens after generation) */}
        <div className="w-full max-w-2xl" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3 italic text-white drop-shadow-[0_0_15px_rgba(233,30,99,0.5)]">
              Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Letter</span> ✨
            </h2>
            <p className="text-lg text-white/60">Every word should come from your heart</p>
          </div>

          {/* Form Container with enhanced styling */}
          <div className="space-y-5">
            {/* Sender Name - Card Style */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(233,30,99,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">👤</div>
                <label className="text-sm font-bold text-white/90 uppercase tracking-wider">
                  Your Name <span className="text-xs text-white/50 font-normal">(Optional)</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="Your name or stay Anonymous 🎭"
                value={formData.senderName}
                onChange={(e) => handleInputChange('senderName', e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-pink-500 focus:bg-black/40 focus:shadow-lg focus:scale-[1.01] outline-none transition-all text-white placeholder-white/30 font-medium"
              />
            </div>

            {/* Receiver Name - Card Style */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(233,30,99,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">💕</div>
                <label className="text-sm font-bold text-white/90 uppercase tracking-wider">
                  Their Name <span className="text-xs text-pink-400 font-normal">*</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="e.g. Sarah, Alex, My Love..."
                value={formData.receiverName}
                onChange={(e) => handleInputChange('receiverName', e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-pink-500 focus:bg-black/40 focus:shadow-lg focus:scale-[1.01] outline-none transition-all text-white placeholder-white/30 font-medium"
              />
            </div>

            {/* Tone Selection - Enhanced Dropdown */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(233,30,99,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">🎭</div>
                <label className="text-sm font-bold text-white/90 uppercase tracking-wider">
                  Letter Tone
                </label>
              </div>
              <select
                value={formData.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-pink-500 focus:bg-black/40 focus:shadow-lg outline-none transition-all text-white font-medium appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem'
                }}
              >
                <option className="bg-gray-900 text-white">❤️ Love letter</option>
                <option className="bg-gray-900 text-white">😂 Funny letter</option>
                <option className="bg-gray-900 text-white">😉 Flirty letter</option>
                <option className="bg-gray-900 text-white">🙏 Sorry letter</option>
              </select>
            </div>

            {/* Attributes - Textarea Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(233,30,99,0.2)] transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">⭐</div>
                <label className="text-sm font-bold text-white/90 uppercase tracking-wider">
                  What do you love about them?
                </label>
              </div>
              <textarea
                placeholder="Their beautiful smile, kindness, the way they laugh... 💫"
                value={formData.attributes}
                onChange={(e) => handleInputChange('attributes', e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-pink-500 focus:bg-black/40 focus:shadow-lg outline-none transition-all text-white placeholder-white/30 min-h-24 resize-none font-medium"
              />
            </div>

            {/* Special Memory - Textarea Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(233,30,99,0.2)] transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">🌹</div>
                <label className="text-sm font-bold text-white/90 uppercase tracking-wider">
                  Special Memory to Include
                </label>
              </div>
              <textarea
                placeholder="Our first meeting at the coffee shop, late-night calls, that moment when... 🌙"
                value={formData.moment}
                onChange={(e) => handleInputChange('moment', e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-pink-500 focus:bg-black/40 focus:shadow-lg outline-none transition-all text-white placeholder-white/30 min-h-24 resize-none font-medium"
              />
            </div>
          </div>

          {/* Generate Button - Enhanced */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-10 rounded-2xl px-8 py-4 font-bold text-white text-lg transition-all hover:shadow-[0_0_30px_rgba(233,30,99,0.6)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden border border-white/10"
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
          <p className="text-center text-sm text-white/40 mt-6 italic">
            💡 Tip: The more details you share, the more personal your letter will be!
          </p>
        </div>
      </div>
    </div>
  );
}