import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { useUserId } from "../../../hooks/useUserId";
import { FaEnvelope, FaPlus, FaTimes, FaChevronLeft, FaHeart, FaRegHeart, FaEnvelopeOpenText } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import letterIcon from "../../../assets/services/letter.png";

export default function LetterIzhaarLanding() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [checkingDraft, setCheckingDraft] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [sentLetters, setSentLetters] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeListModal, setActiveListModal] = useState(null); // 'drafts' or 'sent'
  const [searchTerm, setSearchTerm] = useState("");

  // Check for existing draft
  useEffect(() => {
    const checkForDraft = async () => {
      try {
        setCheckingDraft(true);
        // 1. Check Local Storage
        const localDraft = localStorage.getItem('izhaarLetterDraft');
        if (localDraft) {
          try {
            const parsed = JSON.parse(localDraft);
            const hasContent = parsed.senderName || parsed.receiverName || parsed.generatedLetter;
            if (hasContent) {
              setDrafts([parsed]);
            }
          } catch (e) {
            console.error("Error parsing local draft", e);
          }
        }

        // 2. Fetch Sent Letters (for display)
        try {
          const izhaarRes = await api.get("/izhaar/all");
          const allIzhaars = Array.isArray(izhaarRes.data?.izhaar) ? izhaarRes.data.izhaar : [];
          const letters = allIzhaars.filter(item => item.type === 'LETTER');
          setSentLetters(letters);
        } catch (err) {
          console.error("Sent letters error", err);
        }

        setCheckingDraft(false);
      } catch (err) {
        console.error('Error in checkForDraft:', err);
        setCheckingDraft(false);
      }
    };

    checkForDraft();
  }, [navigate]);

  const handleGenerate = async () => {
    try {
      const res = await api.get("/razorpay/payment-status", {
        params: { userId, service: 'letter' }
      });

      if (!res.data) {
        navigate('/user/letter/payment-subscription', { replace: true });
        return;
      }

      const hasPayment = !!res.data.payment_amount;
      const paymentAmountNumber = Number(res.data.payment_amount);
      const creditStatus = res.data.credit_status;

      if (hasPayment && paymentAmountNumber >= 99 && creditStatus === 'SUCCESS') {
        navigate('/user/receiver', { replace: true });
      } else {
        navigate('/user/letter/payment-subscription', { replace: true });
      }
    } catch (err) {
      console.error("Payment status error:", err);
      // Fallback for demo or if API fails
      navigate('/user/letter-izhaar/write-prompt');
    }
  };

  const handleUnlock = () => {
    navigate('/user/letter-izhaar/write-prompt');
  };

  const handleCreateNew = handleGenerate;

  const handleTrackLetter = (letter) => {
    navigate('/user/notifictions/IzhaarNotificationDetail', {
      state: { izhaar: letter, from: window.location.pathname, isSender: true }
    });
  };

  const handleSeeSample = () => {
    toast.info("Sample preview is coming soon! ✨", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      className: "rounded-2xl font-bold text-sm bg-black/80 backdrop-blur-md",
    });
  };

  if (checkingDraft) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c]"
      >
        <div className="w-10 h-10 border-4 border-[#B72099] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full font-outfit text-white relative pb-10 overflow-x-hidden overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #000 100%)' }}
    >
      {/* Content integrated with background */}

      {/* Ambient Background Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#B72099]/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <style jsx>{`
        .premium-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(183, 32, 153, 0.3);
          border-radius: 10px;
        }
      `}</style>

      {/* Top Header Controls */}
      <div className="relative z-50 p-6 w-full max-w-lg mx-auto flex justify-between items-center">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
        >
          <FaChevronLeft size={16} />
        </button>

        {/* Info Button (Top Right) */}
        <button
          onClick={() => setShowInfoModal(true)}
          className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 group shadow-[0_0_20px_rgba(183,32,153,0.3)] border border-white/20 overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #9333ea, #db2777)',
          }}
        >
          <div className="absolute inset-0 bg-pink-400/20 rounded-full animate-pulse group-hover:animate-none opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40" />
          <span className="text-white text-xl font-serif italic font-bold relative z-10 select-none pb-0.5">i</span>
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-lg mx-auto pb-10">

        {/* Main Header */}
        <div className="flex flex-col items-center mb-10 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-24 h-24 bg-gradient-to-br from-[#B72099]/30 to-[#312E81]/60 rounded-[2rem] flex items-center justify-center border-2 border-pink-500/40 shadow-[0_0_30px_rgba(183,32,153,0.3)] mb-6 overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img src={letterIcon} alt="Letter Icon" className="w-12 h-12 object-contain brightness-0 invert opacity-90 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-serif font-bold text-center bg-gradient-to-r from-pink-100 via-pink-300 to-white bg-clip-text text-transparent"
          >
            Write a letter
          </motion.h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] mt-2">Premium Digital Delivery</p>
        </div>

        <div className="relative group mb-8">
          {/* Pulsing Ambient Glow */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-pink-600 via-[#B72099] to-purple-600 blur-2xl rounded-full -z-10"
          />

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(183,32,153,0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNew}
            className="relative overflow-hidden px-10 py-3.5 rounded-full text-white font-black bg-gradient-to-r from-pink-600 via-[#B72099] to-purple-600 shadow-2xl text-[11px] tracking-[0.2em] uppercase border border-white/20 active:shadow-inner transition-all"
          >
            {/* Shimmer/Sheen Effect */}
            <motion.div
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
                repeatDelay: 2
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
            />

            <span className="relative z-10 flex items-center gap-2">
              Express your Feelings <span className="animate-pulse">✨</span>
            </span>
          </motion.button>
        </div>

        <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6" />

        {/* INNER SAMPLE CARD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-5 flex items-center justify-between rounded-3xl bg-white/5 border border-white/10 transition-all cursor-pointer group hover:bg-white/10"
          onClick={handleSeeSample}
        >
          <div className="text-left">
            <p className="text-xs text-white/80 leading-tight group-hover:text-white transition-colors">Are you curious about <br /> the potential outcome?</p>
          </div>
          <div className="flex items-center gap-2 text-pink-400 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
            View Samples
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6" />


        {/* FEELINGS ON HOLD SECTION */}
        <div className="w-full space-y-4 mt-8">
          <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3 px-2">
            <FaRegHeart className="text-pink-400 text-xl opacity-80" /> Feelings on Hold
          </h3>

          <div className="w-full">
            {drafts.length > 0 ? (
              <div className="space-y-3">
                {drafts.map((draft, idx) => (
                  <motion.div
                    key={draft.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between w-full p-4 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 hover:border-pink-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center border border-pink-500/20">
                        <img src={letterIcon} className="w-6 h-6 brightness-0 invert opacity-40" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-bold">{draft.receiverName || 'Your Love'}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">{draft.wordCount || 0} words preserved</p>
                      </div>
                    </div>
                    <button
                      onClick={handleUnlock}
                      className="px-4 py-2 bg-gradient-to-r from-pink-600 to-[#B72099] rounded-xl text-white text-[10px] font-black shadow-lg shadow-pink-500/10 active:scale-95 transition-all"
                    >
                      FINISH
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white/[0.02] border border-dashed border-white/5 rounded-[2.5rem]">
                <FaRegHeart className="text-4xl text-pink-400/20 mb-1" />
                <p className="text-xs text-white/30 italic">Your heart has stories yet to be told...</p>
                <p className="text-[8px] text-white/10 uppercase tracking-widest">No drafts saved yet</p>
              </div>
            )}
          </div>
        </div>

        {/* DELIVERED FEELINGS SECTION */}
        <div className="w-full space-y-5 mt-12 pb-10">
          <div className="flex flex-col gap-4 px-2">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3">
              <FaEnvelopeOpenText className="text-[#B72099] text-xl opacity-80" /> Delivered Feelings
            </h3>

            {/* SEARCH / FILTER BAR */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-white/20 group-focus-within:text-[#B72099] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-[#B72099]/40 focus:bg-white/[0.06] transition-all tracking-wider"
              />
            </div>
          </div>

          {sentLetters.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {sentLetters
                .filter(letter => {
                  if (!searchTerm) return true;
                  const searchLower = searchTerm.toLowerCase();
                  const nameMatch = (letter.receiver_name || "").toLowerCase().includes(searchLower);
                  const dateMatch = new Date(letter.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toLowerCase().includes(searchLower);
                  return nameMatch || dateMatch;
                })
                .map((letter) => (
                  <motion.div
                    key={letter.id}
                    whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onClick={() => handleTrackLetter(letter)}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/10 shadow-lg flex flex-col items-center text-center cursor-pointer transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-[#B72099]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    <div className="w-14 h-14 bg-gradient-to-br from-[#B72099]/20 to-[#312E81]/40 rounded-2xl flex items-center justify-center border border-pink-500/20 shadow-inner mb-4 group-hover:scale-110 transition-transform duration-500">
                      <img src={letterIcon} className="w-8 h-8 brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-xs truncate max-w-[120px]">
                        To: {letter.receiver_name || "Unknown"}
                      </h4>
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                        {new Date(letter.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 mx-auto">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-tight">Delivered</span>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white/[0.02] border border-dashed border-white/5 rounded-[2.5rem]">
              <FaEnvelopeOpenText className="text-4xl text-[#B72099]/20 mb-1" />
              <p className="text-xs text-white/30 italic">No feelings expressed yet...</p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4 text-white"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-[#0A0D2E] via-[#1a1c3d] to-[#0A0D2E] w-full max-w-lg rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent italic font-serif">How It Works</h3>
                  <button onClick={() => setShowInfoModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400 flex items-center gap-2">Share your feelings:</h6>
                    <p className="text-sm text-white/70 leading-relaxed">Write your message in your own words — don’t worry about being perfect. The more honestly you share your feelings, the more beautifully Izhaar can shape your letter.</p>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Safe delivery:</h6>
                    <p className="text-sm text-white/70 leading-relaxed">Your letter is delivered securely while your identity stays private.</p>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Delivery updates:</h6>
                    <p className="text-sm text-white/70 leading-relaxed">You’ll receive real-time updates when your letter is delivered and viewed.</p>
                  </div>
                  <div className="space-y-1 pb-4">
                    <h6 className="font-bold text-pink-400">Connect safely:</h6>
                    <p className="text-sm text-white/70 leading-relaxed">If mutual interest is felt, you may choose to reveal your identity and take the next step — calmly and safely.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInfoModal(false)}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(219,39,119,0.3)] transition-all active:scale-95"
                >
                  Start My Journey 💌
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
