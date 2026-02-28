import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack, IoChevronDown, IoMusicalNotes, IoSparkles, IoMale, IoFemale, IoInfinite } from "react-icons/io5";
import { FiChevronLeft } from "react-icons/fi";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import { toast } from "react-toastify";

import SongStepProgress from "./SongStepProgress";

// Import Custom Icons
import ProposalIcon from "../../../assets/song/Proposal.png";
import BirthdayIcon from "../../../assets/song/Birthday.png";
import AnniversaryIcon from "../../../assets/song/Anniversary.png";
import ApologyIcon from "../../../assets/song/Apology.png";
import OthersIcon from "../../../assets/song/Others.png";

// Configuration for selections
const occasions = [
  { id: "Proposal", label: "Proposal", icon: ProposalIcon, color: "bg-purple-500/20", iconColor: "text-purple-400" },
  { id: "Birthday", label: "Birthday", icon: BirthdayIcon, color: "bg-pink-500/20", iconColor: "text-pink-400" },
  { id: "Anniversary", label: "Anniversary", icon: AnniversaryIcon, color: "bg-red-500/20", iconColor: "text-red-400" },
  { id: "Apology", label: "Apology", icon: ApologyIcon, color: "bg-blue-500/20", iconColor: "text-blue-400" },
  { id: "Others", label: "Others", icon: OthersIcon, color: "bg-yellow-500/20", iconColor: "text-yellow-400" },
];

const genres = [
  { id: "Cinematic Orchestral", label: "Cinematic Orchestral", icon: "🎻" },
  { id: "Studio Produced", label: "Studio Produced", icon: "🎧" },
];

const vibes = [
  { id: "Romantic", label: "Romantic", icon: "💖" },
  { id: "Emotional", label: "Emotional", icon: "💔" },
  { id: "Passionate", label: "Passionate", icon: "🔥" },
];

const voiceTypes = [
  { id: "Random", label: "Random", icon: <IoInfinite size={16} /> },
  { id: "Male", label: "Male", icon: <IoMale size={16} /> },
  { id: "Female", label: "Female", icon: <IoFemale size={16} /> },
];

const languages = [
  "English", "Hindi", "Telugu", "Marathi", "Urdu"
];

const durations = [
  { id: 120000, label: "1 min" },
  { id: 180000, label: "2 min" },
  { id: 240000, label: "4 min" },
];

export default function SongCreateForm() {
  const navigate = useNavigate();
  const { receiverDetails } = useReceiverForLetter();

  // Form State
  const [formData, setFormData] = useState({
    yourName: "",
    partnersName: "",
    relationship: "",
    occasion: "Proposal",
    genre: "Cinematic Orchestral",
    vibe: "Romantic",
    story: "",
    voiceType: "Random",
    language: "English",
    duration: 180000,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitRequest = async () => {
    if (!formData.story.trim()) {
      setError("Please describe your story or feelings");
      return;
    }

    try {
      // Create the payload exactly as the backend expects
      const pendingPayload = {
        story: formData.story,
        mood: formData.occasion,
        language: formData.language,
        style: formData.genre,
        duration: formData.duration,
        voice_type: formData.voiceType,
        vibe: formData.vibe,
        your_name: formData.yourName,
        partner_name: formData.partnersName,
        relationship: formData.relationship,
        receiver: receiverDetails // From context
      };

      // Since the backend requires credit (402) to create a request,
      // we save the details in the navigation state and proceed to payment.
      toast.success("Song details saved. Proceeding to payment...");

      // Delay slightly for toast visibility
      setTimeout(() => {
        navigate("/user/song/payment-subscription", {
          state: {
            pendingSongData: pendingPayload,
            from: 'song-create-form'
          }
        });
      }, 800);

    } catch (err) {
      console.error("Form error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative selection:bg-pink-500/30 font-inter"
      style={{ background: 'var(--customize-song, linear-gradient(168deg, #090810 0%, #150D32 49.55%, #260D35 99.09%))' }}>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 py-4 flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/user/song")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md"
          >
            <FiChevronLeft size={24} />
          </motion.button>
        </div>

        {/* Progres Bar */}
        <div className="w-full">
          <SongStepProgress currentStep={1} />
        </div>
      </header>

      <main className="relative z-10 px-4 pb-24 max-w-2xl mx-auto">
        {/* Title Section */}
        <section className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-1"
          >
            Create Your Song
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-sm"
          >
            Let AI turn your emotions into music.
          </motion.p>
        </section>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/[0.02] backdrop-blur-3xl rounded-[32px] p-6 shadow-2xl space-y-8"
          style={{
            border: '1px solid transparent',
            background: `
              linear-gradient(#090810, #090810) padding-box, 
              linear-gradient(90deg, rgba(236, 72, 153, 0.5) 0%, rgba(168, 85, 247, 0.5) 100%) border-box
            `,
          }}
        >
          {/* Name Fields */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[15px] font-bold text-white/90">Your name</label>
              <input
                type="text"
                placeholder="Eg : Andrew"
                value={formData.yourName}
                onChange={(e) => updateField('yourName', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 outline-none focus:border-pink-500/50 transition-all text-[15px]"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[15px] font-bold text-white/90">Partners Name</label>
              <input
                type="text"
                placeholder="Eg : Angel"
                value={formData.partnersName}
                onChange={(e) => updateField('partnersName', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 outline-none focus:border-pink-500/50 transition-all text-[15px]"
              />
            </div>
          </div>

          {/* Relationship Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-white/90">Relationship</label>
            <div className="relative">
              <select
                value={formData.relationship}
                onChange={(e) => updateField('relationship', e.target.value)}
                className="w-full appearance-none bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-500/50 transition-all text-[15px]"
              >
                <option value="" disabled className="bg-[#150D32]">Select</option>
                <option value="Partner" className="bg-[#150D32]">Partner</option>
                <option value="Spouse" className="bg-[#150D32]">Spouse</option>
                <option value="Crush" className="bg-[#150D32]">Crush</option>
                <option value="Ex" className="bg-[#150D32]">Ex</option>
              </select>
              <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Occasion Grid */}
          <div className="space-y-4">
            <label className="text-[15px] font-bold text-white/90">Occasion</label>
            <div className="grid grid-cols-2 gap-4">
              {occasions.map((occ, idx) => (
                <button
                  key={occ.id}
                  onClick={() => updateField('occasion', occ.id)}
                  className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all duration-300 relative group overflow-hidden ${formData.occasion === occ.id
                    ? "bg-white/[0.04] border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                    : "bg-black/20 border-white/5 hover:border-white/20"
                    } ${idx === 4 ? "col-span-2 max-w-[calc(50%-8px)] mx-auto w-full" : ""}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform duration-500 ${occ.color} ${formData.occasion === occ.id ? "scale-110" : "opacity-60"}`}>
                    <img src={occ.icon} alt={occ.label} className="w-6 h-6 object-contain" />
                  </div>
                  <span className={`text-[13px] font-bold transition-colors ${formData.occasion === occ.id ? "text-white" : "text-white/40"}`}>
                    {occ.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Genre Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-white/90">Genre</label>
            <div className="flex flex-wrap gap-3">
              {genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() => updateField('genre', g.id)}
                  className={`px-4 py-2.5 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-all ${formData.genre === g.id
                    ? "bg-pink-500/10 border-pink-500/40 text-pink-400"
                    : "bg-black/20 border-white/10 text-white/40 hover:border-white/30"
                    }`}
                >
                  <span>{g.icon}</span> {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-white/90">Vibe</label>
            <div className="flex flex-wrap gap-3">
              {vibes.map((v) => (
                <button
                  key={v.id}
                  onClick={() => updateField('vibe', v.id)}
                  className={`px-4 py-2.5 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-all ${formData.vibe === v.id
                    ? "bg-pink-500/10 border-pink-500/40 text-pink-400"
                    : "bg-black/20 border-white/10 text-white/40 hover:border-white/30"
                    }`}
                >
                  <span>{v.icon}</span> {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Story Textarea */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-white/90">Tell us your story</label>
            <div className="relative">
              <textarea
                placeholder="How do you meet? What is the special moment...."
                value={formData.story}
                onChange={(e) => updateField('story', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-3xl px-5 py-5 text-white placeholder-white/20 outline-none focus:border-pink-500/50 transition-all text-sm min-h-[160px] resize-none"
              />
              <IoSparkles className="absolute bottom-5 left-5 text-purple-500/60" size={18} />
            </div>
          </div>

          {/* Voice Type Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-white/90">Voice Type</label>
            <div className="flex flex-wrap gap-3">
              {voiceTypes.map((v) => (
                <button
                  key={v.id}
                  onClick={() => updateField('voiceType', v.id)}
                  className={`px-5 py-2.5 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-all ${formData.voiceType === v.id
                    ? "bg-pink-500/10 border-pink-500/40 text-pink-400"
                    : "bg-black/20 border-white/10 text-white/40 hover:border-white/30"
                    }`}
                >
                  {v.icon} {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-white/90">Language</label>
            <div className="relative">
              <select
                value={formData.language}
                onChange={(e) => updateField('language', e.target.value)}
                className="w-full appearance-none bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-500/50 transition-all text-[15px]"
              >
                <option value="" disabled className="bg-[#150D32]">Select</option>
                {languages.map(lang => (
                  <option key={lang} value={lang} className="bg-[#150D32]">{lang}</option>
                ))}
              </select>
              <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-white/90">Duration</label>
            <div className="flex flex-wrap gap-3">
              {durations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => updateField('duration', d.id)}
                  className={`px-6 py-2.5 rounded-2xl border text-[13px] font-bold transition-all ${formData.duration === d.id
                    ? "bg-pink-500/10 border-pink-500/40 text-pink-400"
                    : "bg-black/20 border-white/10 text-white/40 hover:border-white/30"
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Button - Now in normal scroll flow */}
        <motion.div className="mt-12 mb-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={submitRequest}
            className="w-full max-w-xl relative h-[60px] rounded-full flex items-center justify-center font-bold text-white shadow-[0_4px_20px_rgba(236,72,153,0.3)]"
            style={{ background: 'linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)' }}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Send request"
            )}
          </motion.button>
        </motion.div>

        {/* Error Modal/Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}