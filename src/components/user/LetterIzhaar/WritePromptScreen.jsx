import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack, IoChevronDown, IoCheckmark, IoPencil, IoColorPaletteOutline, IoTextOutline, IoResizeOutline, IoClose, IoHeart, IoArrowBack } from 'react-icons/io5';
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
  { id: "1", name: "Romantic Pink", url: bg1 },
  { id: "2", name: "Rose Love", url: bg2 },
  { id: "3", name: "Cute Couple", url: bg3 },
  { id: "4", name: "Classic Letter", url: bg4 },
  { id: "5", name: "Vintage Garden", url: bg5 },
  { id: "6", name: "Moonlight", url: bg6 },
  { id: "7", name: "Dreamy Sky", url: bg7 },
  { id: "8", name: "Soft Peony", url: bg8 },
  { id: "9", name: "Floral Whisper", url: bg9 },
  { id: "10", name: "Golden Elegance", url: bg10 },
];

const COLORS = [
  { name: 'Classic Red', hex: '#FF0004' },
  { name: 'Soft Pink', hex: '#FF69B4' },
  { name: 'Royal Purple', hex: '#8A2BE2' },
  { name: 'Deep Blue', hex: '#4169E1' },
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Chocolate', hex: '#A52A2A' },
  { name: 'Forest Green', hex: '#2E8B57' },
  { name: 'Gold', hex: '#DAA520' },
  { name: 'Midnight', hex: '#1e1b4b' },
];

const FONTS = [
  { name: 'Poppins', family: 'Poppins' },
  { name: 'Serif Classic', family: 'Playfair Display' },
  { name: 'Handwritten', family: 'Dancing Script' },
  { name: 'Modern Sans', family: 'Montserrat' },
  { name: 'Elegant', family: 'Outfit' },
  { name: 'Cursive', family: 'Cursive' },
  { name: 'Serif', family: 'Serif' },
];

const ENVELOPES = [
  { id: 1, name: 'Crimson Passion', color: '#991b1b', decoration: 'bow_hearts', tag: 'Intense' },
  { id: 2, name: 'Blossom Pink', color: '#f72ecbff', decoration: 'wax_seal', tag: 'Vibrant' },
  { id: 3, name: 'Royal Violet', color: '#5b21b6', decoration: 'kisses_stars', tag: 'Mystic' },
  { id: 4, name: 'Vintage Ember', color: '#92400e', decoration: 'string_heart', tag: 'Timeless' }
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

  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[1]);
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Editor states
  const [fontFamily, setFontFamily] = useState(FONTS[1]);
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState(COLORS[4]);
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'color', 'font', or null
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [showEnvelopeAnimation, setShowEnvelopeAnimation] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState(ENVELOPES[2]);
  const [previewStep, setPreviewStep] = useState('letter'); // 'letter' | 'envelope'

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

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
      return true;
    } catch (err) {
      console.error('Failed to save draft:', err);
      toast.error('Failed to save draft');
      return false;
    }
  };

  // Handle back with confirmation
  const handleBackClick = () => {
    if (showPreview || formData.senderName.trim() || formData.receiverName.trim() || formData.attributes.trim() || formData.moment.trim()) {
      setShowBackConfirm(true);
    } else {
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
        const draftData = localStorage.getItem('izhaarLetterDraft');
        if (draftData) {
          const parsed = JSON.parse(draftData);
          if (parsed.senderName || parsed.receiverName || parsed.tone || parsed.attributes || parsed.moment) {
            setFormData({
              senderName: parsed.senderName || '',
              receiverName: parsed.receiverName || '',
              tone: parsed.tone || 'Love letter ❤️',
              attributes: parsed.attributes || '',
              moment: parsed.moment || ''
            });
          }
          if (parsed.generatedLetter) {
            setGeneratedLetter(parsed.generatedLetter);
            setLetter(parsed.generatedLetter);
            setShowPreview(true);
          }
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.receiverName.trim()) {
      toast.error("Please enter receiver's name");
      return;
    }

    setLoading(true);

    try {
      const fullPrompt = `
Write a ${formData.tone} letter.

Sender: ${formData.senderName || "Anonymous"}
Receiver: ${formData.receiverName}
What I love: ${formData.attributes}
Memory: ${formData.moment}

Max 120 words. Warm, real, human.
`;

      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
        }),
      });

      const data = await response.json();
      if (!data.finalLetter) {
        toast.error("Generation failed");
        setLoading(false);
        return;
      }

      setGeneratedLetter(data.finalLetter);
      setLetter(data.finalLetter);
      setShowPreview(true);
      setLoading(false);

      localStorage.setItem('izhaarLetterPreview', JSON.stringify({
        generatedLetter: data.finalLetter,
        selectedTemplate,
        fontFamily,
        fontSize,
        textColor,
        formData
      }));
    } catch (err) {
      toast.error("Generation error");
      setLoading(false);
    }
  };

  // ========== PREVIEW SCREEN ==========
  if (showPreview && generatedLetter) {
    return (
      <div className="min-h-screen text-white flex flex-col font-sans overflow-hidden select-none" style={{ background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))' }}>
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .mask-linear { mask-image: linear-gradient(to right, black 85%, transparent 100%); }
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@400;700&family=Sacramento&family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        `}</style>

        {/* Header */}
        <header className="p-6 flex items-center justify-between z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (previewStep === 'envelope') {
                  setPreviewStep('letter');
                } else {
                  setShowBackConfirm(true);
                }
              }}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <IoChevronBack size={18} />
            </button>
            <h1 className="text-xl font-['Playfair_Display'] font-bold tracking-tight">
              {previewStep === 'letter' ? 'Preview' : 'The Boutique'}
            </h1>
          </div>
          <button
            onClick={() => {
              if (previewStep === 'letter') {
                setPreviewStep('envelope');
              } else {
                setShowEnvelopeAnimation(true);
                setEnvelopeOpened(false);
              }
            }}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-sm font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
          >
            {previewStep === 'letter' ? 'Continue ➔' : 'Continue ➔'}
          </button>
        </header>

        {/* Toolbar Controls - Only show for Letter Preview */}
        {previewStep === 'letter' && (
          <div className="px-6 py-4 flex items-center justify-start sm:justify-center gap-3 z-40 relative overflow-x-auto no-scrollbar" ref={dropdownRef}>
            {/* Color Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                id="color-trigger"
                onClick={() => toggleDropdown('color')}
                className={`w-[110px] h-[52px] bg-white/5 backdrop-blur-xl border rounded-2xl flex flex-col gap-1 items-center justify-center transition-all ${activeDropdown === 'color' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/10'}`}
              >
                <span className="text-[7px] uppercase tracking-[2px] text-white/40 font-black">Color</span>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: textColor.hex }}></div>
                  <span className="text-[10px] font-bold text-white/80">{textColor.name.split(' ')[0]}</span>
                  <IoChevronDown size={10} className={`text-white/40 transition-transform ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {activeDropdown === 'color' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="fixed mt-3 min-w-[180px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 shadow-2xl z-[1000]"
                    style={{
                      top: document.getElementById('color-trigger')?.getBoundingClientRect().bottom + 'px',
                      left: Math.max(20, Math.min(window.innerWidth - 200, document.getElementById('color-trigger')?.getBoundingClientRect().left)) + 'px'
                    }}
                  >
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1.5">
                      {COLORS.map((c) => (
                        <div
                          key={c.hex}
                          onClick={() => { setTextColor(c); setActiveDropdown(null); }}
                          className={`flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer ${textColor.hex === c.hex ? 'bg-pink-500/20 text-pink-400' : 'text-white/70'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></div>
                            <span className="text-xs font-bold">{c.name}</span>
                          </div>
                          {textColor.hex === c.hex && <IoCheckmark className="text-pink-500" size={16} />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Font Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                id="font-trigger"
                onClick={() => toggleDropdown('font')}
                className={`w-[110px] h-[52px] bg-white/5 backdrop-blur-xl border rounded-2xl flex flex-col gap-1 items-center justify-center transition-all ${activeDropdown === 'font' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/10'}`}
              >
                <span className="text-[7px] uppercase tracking-[2px] text-white/40 font-black">Style</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/80 truncate max-w-[60px]" style={{ fontFamily: fontFamily.family }}>{fontFamily.name}</span>
                  <IoChevronDown size={10} className={`text-white/40 transition-transform ${activeDropdown === 'font' ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {activeDropdown === 'font' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="fixed mt-3 min-w-[180px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 shadow-2xl z-[1000]"
                    style={{
                      top: document.getElementById('font-trigger')?.getBoundingClientRect().bottom + 'px',
                      left: Math.max(20, Math.min(window.innerWidth - 200, document.getElementById('font-trigger')?.getBoundingClientRect().left)) + 'px'
                    }}
                  >
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1.5">
                      {FONTS.map((f) => (
                        <div
                          key={f.family}
                          onClick={() => { setFontFamily(f); setActiveDropdown(null); }}
                          className={`flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer ${fontFamily.family === f.family ? 'bg-pink-500/20 text-pink-400' : 'text-white/70'}`}
                        >
                          <span className="text-xs font-bold" style={{ fontFamily: f.family }}>{f.name}</span>
                          {fontFamily.family === f.family && <IoCheckmark className="text-pink-500" size={16} />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Size */}
            <div className="flex-shrink-0 w-[110px] h-[52px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-1 items-center justify-center">
              <span className="text-[7px] uppercase tracking-[2px] text-white/40 font-black">Size</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setFontSize(prev => Math.max(prev - 1, 8))} className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/5 text-pink-500">-</button>
                <span className="text-[11px] font-black text-white/90">{fontSize}</span>
                <button onClick={() => setFontSize(prev => Math.min(prev + 1, 30))} className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/5 text-pink-500">+</button>
              </div>
            </div>

            {/* Edit */}
            <button
              onClick={() => setIsEditingLetter(!isEditingLetter)}
              className={`flex-shrink-0 w-[110px] h-[52px] bg-white/5 backdrop-blur-xl border rounded-2xl flex flex-col gap-1 items-center justify-center transition-all ${isEditingLetter ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 hover:bg-white/10'}`}
            >
              <span className="text-[7px] uppercase tracking-[2px] text-white/40 font-black">{isEditingLetter ? 'Done' : 'Edit'}</span>
              <div className="flex items-center gap-2">
                <IoPencil size={12} className={isEditingLetter ? 'text-pink-400' : 'text-white/60'} />
                <span className="text-[10px] font-bold text-white/80">Text</span>
              </div>
            </button>
          </div>
        )}

        {/* 3D Canvas / Selection Step */}
        <div className="flex-1 flex items-center justify-center p-6 z-10 overflow-hidden relative" style={{ perspective: '1200px' }}>
          {previewStep === 'letter' ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTemplate.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                className="relative w-full aspect-[1/1.4] max-w-[380px] bg-white rounded-2xl overflow-hidden shadow-2xl transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img src={selectedTemplate.url} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 px-12 pt-24 pb-16 overflow-y-auto custom-scrollbar group z-0">
                  <div className="flex flex-col min-h-full justify-center">
                    {isEditingLetter ? (
                      <textarea
                        value={generatedLetter}
                        onChange={(e) => setGeneratedLetter(e.target.value)}
                        autoFocus
                        onBlur={() => setIsEditingLetter(false)}
                        className="w-full bg-transparent outline-none resize-none text-left overflow-hidden py-4"
                        style={{
                          color: textColor.hex,
                          fontFamily: fontFamily.family,
                          fontSize: `${fontSize}px`,
                          lineHeight: '1.7',
                          textShadow: textColor.hex === '#ffffff' ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                          minHeight: '200px',
                          height: 'auto'
                        }}
                      />
                    ) : (
                      <motion.div
                        layout
                        onClick={() => setIsEditingLetter(true)}
                        style={{
                          color: textColor.hex,
                          fontFamily: fontFamily.family,
                          fontSize: `${fontSize}px`,
                          lineHeight: '1.7',
                          textAlign: 'left',
                          whiteSpace: 'pre-wrap',
                          width: '100%',
                          cursor: 'text',
                          textShadow: textColor.hex === '#ffffff' ? '0 1px 4px rgba(0,0,0,0.2)' : 'none'
                        }}
                        className="transition-all duration-500 ease-in-out relative py-4"
                      >
                        {generatedLetter}
                        <div className="absolute top-0 -right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500/10 text-pink-500 p-2 rounded-full backdrop-blur-md border border-pink-500/20">
                          <IoPencil size={14} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Envelope Preview from EnvelopeCustomizer */
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              className="relative w-full max-w-[380px] aspect-[1.5/1]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[95%] h-16 bg-black/70 blur-[50px] rounded-full" />
              <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 rounded-sm shadow-2xl overflow-hidden" style={{ backgroundColor: selectedEnvelope.color }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
                  {selectedEnvelope.decoration === 'bow_hearts' && (
                    <div className="absolute inset-0 flex items-center justify-end p-8 opacity-40">
                      <div className="grid grid-cols-2 gap-4">
                        <IoHeart className="text-pink-400 text-3xl" />
                        <div className="w-8 h-8 border-2 border-pink-400 rounded-full" />
                        <div className="w-8 h-8 border-2 border-pink-400 rounded-full" />
                        <IoHeart className="text-pink-400 text-2xl" />
                      </div>
                    </div>
                  )}
                </div>
                {/* Pocket Construction */}
                <div className="absolute inset-0 z-10" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0" style={{ backgroundColor: selectedEnvelope.color, clipPath: 'polygon(0 0, 48% 50%, 0 100%)', filter: 'brightness(1.08)' }} />
                  <div className="absolute inset-0" style={{ backgroundColor: selectedEnvelope.color, clipPath: 'polygon(100% 0, 52% 50%, 100% 100%)', filter: 'brightness(1.08)' }} />
                  <div className="absolute inset-0" style={{ backgroundColor: selectedEnvelope.color, clipPath: 'polygon(0 100%, 100% 100%, 50% 48%)', filter: 'brightness(0.95)' }} />
                </div>
                {/* Flap */}
                <div className="absolute inset-x-0 top-0 h-1/2 origin-top z-40" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0" style={{ backgroundColor: selectedEnvelope.color, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', filter: 'brightness(1.15)' }} />
                </div>
                {/* Decorations */}
                <div className="absolute inset-0 z-20 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                  {selectedEnvelope.decoration === 'wax_seal' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-red-800 border-4 border-red-950 shadow-2xl flex items-center justify-center">
                        <IoHeart className="text-white text-2xl" />
                      </div>
                    </div>
                  )}
                  {selectedEnvelope.decoration === 'string_heart' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-1 bg-[#4a3728]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-800 rounded-full border-4 border-red-950 flex items-center justify-center text-2xl shadow-xl">❤️</div>
                    </div>
                  )}
                  {selectedEnvelope.decoration === 'kisses_stars' && (
                    <div className="absolute inset-0 flex items-center justify-center gap-4 text-4xl opacity-80">💋⭐💋</div>
                  )}
                  {selectedEnvelope.decoration === 'bow_hearts' && (
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-10 h-full bg-pink-600 ml-12 opacity-80" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Templates / Envelopes Drawer */}
        <div className="p-6 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-['Playfair_Display'] font-bold text-pink-100">
              {previewStep === 'letter' ? 'Templates' : 'Archetypes'}
            </h2>
            {previewStep === 'letter' && (
              <button onClick={() => setShowAllTemplates(true)} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-pink-400 text-[10px] font-black uppercase tracking-widest">
                View All
              </button>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {previewStep === 'letter' ? (
              TEMPLATES.map((tmpl) => (
                <motion.div
                  key={tmpl.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden cursor-pointer border-2 ${selectedTemplate.id === tmpl.id ? 'border-pink-500 shadow-lg' : 'border-white/5 opacity-50'}`}
                >
                  <img src={tmpl.url} className="w-full h-full object-cover" />
                </motion.div>
              ))
            ) : (
              ENVELOPES.map((env) => (
                <div key={env.id} className="flex flex-col items-center gap-2">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedEnvelope(env); }}
                    className={`relative flex-shrink-0 w-32 h-20 rounded-2xl cursor-pointer transition-all border-2 overflow-hidden ${selectedEnvelope.id === env.id
                      ? 'border-pink-500 shadow-[0_20px_40px_-10px_rgba(225,29,72,0.4)]'
                      : 'border-white/5 hover:border-white/10'
                      }`}
                    style={{ backgroundColor: env.color }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-20 pointer-events-none" />

                    {/* Mini Construction for Thumbnail */}
                    <div className="absolute inset-0 scale-[0.7] origin-center opacity-90 overflow-hidden rounded-lg pointer-events-none">
                      <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(0 0, 48% 50%, 0 100%)', filter: 'brightness(1.08)' }} />
                      <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(100% 0, 52% 50%, 100% 100%)', filter: 'brightness(1.08)' }} />
                      <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(0 100%, 100% 100%, 50% 48%)', filter: 'brightness(0.92)' }} />
                      <div className="absolute inset-x-0 top-0 h-1/2" style={{ backgroundColor: env.color, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', filter: 'brightness(1.15)' }} />

                      {/* Mini Decorator (Simplified) */}
                      <div className="absolute inset-0 z-20 flex items-center justify-center">
                        {env.decoration === 'wax_seal' && (
                          <div className="w-4 h-4 rounded-full bg-red-800 border-[1px] border-red-950 flex items-center justify-center">
                            <IoHeart className="text-white text-[6px]" />
                          </div>
                        )}
                        {env.decoration === 'string_heart' && (
                          <div className="flex items-center justify-center w-full">
                            <div className="w-full h-[1px] bg-[#4a3728]" />
                            <div className="absolute w-5 h-5 bg-red-800 rounded-full border border-red-950 flex items-center justify-center text-[8px]">❤️</div>
                          </div>
                        )}
                        {env.decoration === 'kisses_stars' && (
                          <div className="flex gap-1 text-[8px] opacity-60">💋⭐</div>
                        )}
                        {env.decoration === 'bow_hearts' && (
                          <div className="w-2 h-full bg-pink-500 ml-4 opacity-70" />
                        )}
                      </div>
                    </div>

                    {selectedEnvelope.id === env.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center shadow-lg z-50">
                        <IoCheckmark size={12} className="text-white" />
                      </div>
                    )}
                  </motion.div>
                  <span className={`text-[8px] font-black uppercase tracking-[2px] transition-colors ${selectedEnvelope.id === env.id ? 'text-pink-400' : 'text-white/20'}`}>
                    {env.name.split(' ')[0]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <AnimatePresence>
          {showAllTemplates && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="fixed inset-0 z-[200] bg-black/80 flex flex-col p-6 h-screen"
            >
              <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto w-full">
                <div>
                  <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white">All Templates</h2>
                  <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Select your favorite letter design</p>
                </div>
                <button
                  onClick={() => setShowAllTemplates(false)}
                  className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-12">
                  {TEMPLATES.map((tmpl) => (
                    <motion.div
                      key={tmpl.id}
                      whileHover={{ y: -10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedTemplate(tmpl);
                        setShowAllTemplates(false);
                      }}
                      className={`group relative aspect-[1/1.4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedTemplate.id === tmpl.id
                        ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <img src={tmpl.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                        <span className="text-xs font-medium text-white/90">{tmpl.name}</span>
                      </div>
                      {selectedTemplate.id === tmpl.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg">
                          <IoCheckmark size={14} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <VintageScrollPreview
          isOpen={showEnvelopeAnimation}
          onClose={() => { setShowEnvelopeAnimation(false); setEnvelopeOpened(false); }}
          generatedLetter={generatedLetter}
          fontFamily={fontFamily.family}
          fontSize={fontSize}
          textColor={textColor.hex}
          backgroundImage={selectedTemplate.url}
          selectedTemplate={selectedTemplate.id}
          envelopeColor={selectedEnvelope.color}
          envelopeDecoration={selectedEnvelope.decoration}
        />

        {showBackConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <div className="bg-[#0A0D2E] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold text-white mb-2">Discard Progress?</h3>
              <p className="text-sm text-white/40 mb-8 leading-relaxed">Your message will be lost if you leave now.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { localStorage.removeItem('izhaarLetterDraft'); localStorage.removeItem('izhaarLetterPreview'); navigate('/user/letter-izhaar'); }} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all">Discard</button>
                <button onClick={() => setShowBackConfirm(false)} className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Keep Writing</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== FORM SCREEN ==========
  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))' }}>
      {/* Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto p-6 pt-12">
        <header className="mb-10">
          <button onClick={() => navigate('/user/letter-izhaar')} className="mb-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"><IoChevronBack size={18} /></button>
          <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white mb-2">Write Your Letter</h1>
          <p className="text-white/40 text-sm">Tell us about your feelings, we'll craft the perfect words.</p>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Your Name</label>
            <input type="text" value={formData.senderName} onChange={(e) => handleInputChange('senderName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-pink-500 transition-all" placeholder="Enter your name" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Receiver's Name</label>
            <input type="text" value={formData.receiverName} onChange={(e) => handleInputChange('receiverName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-pink-500 transition-all" placeholder="Who is this for?" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">The Tone</label>
            <select value={formData.tone} onChange={(e) => handleInputChange('tone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none focus:outline-none focus:border-pink-500 transition-all">
              <option value="Love letter ❤️" className="bg-[#0A0D2E]">Love letter ❤️</option>
              <option value="Confession 🤫" className="bg-[#0A0D2E]">Confession 🤫</option>
              <option value="Apology 🥺" className="bg-[#0A0D2E]">Apology 🥺</option>
              <option value="Appreciation ✨" className="bg-[#0A0D2E]">Appreciation ✨</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">What you like about them</label>
            <textarea value={formData.attributes} onChange={(e) => handleInputChange('attributes', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-pink-500 transition-all h-32 resize-none" placeholder="E.g. Their smile, kindness, the way they talk..." />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">A special moment</label>
            <textarea value={formData.moment} onChange={(e) => handleInputChange('moment', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-pink-500 transition-all h-32 resize-none" placeholder="Describe a shared memory..." />
          </div>

          <button onClick={handleGenerate} disabled={loading} className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white font-bold text-lg shadow-xl shadow-pink-500/20 active:scale-95 transition-all disabled:opacity-50">
            {loading ? "Crafting Magic..." : "Generate Magic Letter ✨"}
          </button>
        </div>
      </div>

      {showBackConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#0A0D2E] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-white mb-2">Discard Changes?</h3>
            <p className="text-sm text-white/40 mb-8 leading-relaxed">You have unsaved changes. Are you sure you want to leave?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowBackConfirm(false); navigate('/user/letter-izhaar'); }} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all">Exit</button>
              <button onClick={() => setShowBackConfirm(false)} className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Stay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}