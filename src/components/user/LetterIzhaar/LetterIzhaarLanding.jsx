import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { useUserId } from "../../../hooks/useUserId";
import { FaEnvelope, FaPlus, FaTimes, FaChevronLeft, FaHeart, FaRegHeart, FaEnvelopeOpenText, FaInbox, FaPaperPlane, FaPenNib } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LetterStepProgress from "./LetterStepProgress";
import { getCloudUrl } from "../../../cloudinaryUrls";

const letterIcon = getCloudUrl("Service/letter.webp");
const mainImage = getCloudUrl("Service/letter.webp");

export default function LetterIzhaarLanding() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [checkingDraft, setCheckingDraft] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [allLetters, setAllLetters] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState('all');

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

        // 2. Fetch All Letters
        try {
          const izhaarRes = await api.get("/izhaar/all");
          const allIzhaars = Array.isArray(izhaarRes.data?.izhaar) ? izhaarRes.data.izhaar : [];
          const letters = allIzhaars.filter(item => item.type === 'LETTER');
          setAllLetters(letters);
        } catch (err) {
          console.error("Fetch letters error", err);
        }

        setCheckingDraft(false);
      } catch (err) {
        console.error('Error in checkForDraft:', err);
        setCheckingDraft(false);
      }
    };

    checkForDraft();
  }, [navigate]);

  // Categorize letters
  const inboxLetters = allLetters.filter(l => String(l.receiver_id) === String(userId) || (String(l.sender_id) !== String(userId) && l.sender_name !== "You"));
  const sentLetters = allLetters.filter(l => String(l.sender_id) === String(userId) || l.isSender === true);

  const getFilteredList = () => {
    let list = [];
    if (activeTab === 'all') list = allLetters;
    else if (activeTab === 'inbox') list = inboxLetters;
    else if (activeTab === 'sent') list = sentLetters;
    else if (activeTab === 'drafts') list = drafts;

    if (!searchTerm) return list;

    const term = searchTerm.toLowerCase();
    return list.filter(item => {
      const name = (item.receiver_name || item.sender_name || item.receiver_mobile || "Unknown").toLowerCase();
      const date = item.created_at ? new Date(item.created_at).toLocaleDateString().toLowerCase() : "";
      return name.includes(term) || date.includes(term);
    });
  };

  const filteredList = getFilteredList();

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
    navigate('/user/letter-izhaar/samples');
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
      style={{ background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))' }}
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
      <div className="relative z-50 px-3 py-4 sm:py-6 sm:px-7 w-full max-w-xl mx-auto flex justify-between items-center">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
        >
          <FaChevronLeft size={16} />
        </button>

        {/* Info Button (Top Right) */}
        {/* <button
          onClick={() => setShowInfoModal(true)}
          className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 group shadow-[0_0_20px_rgba(183,32,153,0.3)] border border-white/20 overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #9333ea, #db2777)',
          }}
        >
          <div className="absolute inset-0 bg-pink-400/20 rounded-full animate-pulse group-hover:animate-none opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40" />
          <span className="text-white text-xl font-serif italic font-bold relative z-10 select-none pb-0.5">i</span>
        </button> */}
      </div>

      {/* Step Progress Visualizer */}
      <LetterStepProgress currentStep={0} />

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 w-full max-w-lg mx-auto pb-10 mt-5">

        {/* Main Header */}
        <div className="flex flex-col items-center mb-4 sm:mb-6 mt-1 sm:mt-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mb-3 sm:mb-6 overflow-hidden relative group rounded-2xl bg-white/5 border border-white/10 shadow-lg"
          >
            <motion.img
              src={mainImage}
              alt="Premium Delivery"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-[70%] h-[70%] object-contain relative z-0 drop-shadow-[0_5px_15px_rgba(236,72,153,0.3)] transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 border border-white/10 rounded-inherit z-20 pointer-events-none" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-serif font-bold text-center bg-gradient-to-r from-pink-100 via-pink-300 to-white bg-clip-text text-transparent"
          >
            Izhaar Love
          </motion.h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] mt-2">Premium Digital Delivery</p>
        </div>

        <div className="relative group mb-4">
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
            className="relative overflow-hidden px-8 py-3 sm:px-10 sm:py-3.5 rounded-full text-white font-black bg-gradient-to-r from-pink-600 via-[#B72099] to-purple-600 shadow-2xl text-[10px] sm:text-[11px] tracking-[0.2em] uppercase border border-white/20 active:shadow-inner transition-all"
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

        <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

        {/* INNER SAMPLE CARD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-4 sm:p-5 flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 transition-all cursor-pointer group hover:bg-white/10"
          onClick={handleSeeSample}
        >
          <div className="text-left">
            <p className="text-xs text-white/80 leading-tight group-hover:text-white transition-colors">Are you curious about <br /> the potential outcome?</p>
          </div>
          <div className="flex items-center gap-2 text-pink-400 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
            Try Now
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />


        {/* TABS SECTION */}
        <div className="w-full mt-4 sm:mt-6 mb-6">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
            {[
              { id: 'all', label: 'All', icon: FaEnvelope },
              { id: 'inbox', label: 'Inbox', icon: FaInbox },
              { id: 'sent', label: 'Sent', icon: FaPaperPlane },
              { id: 'drafts', label: 'Drafts', icon: FaPenNib },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-bold transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/60'
                  }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className={`text-xs ${activeTab === tab.id ? 'text-pink-400' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
                {tab.id === 'inbox' && inboxLetters.length > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH BAR (Contextual) */}
        <div className="w-full mb-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-white/20 group-focus-within:text-[#B72099] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-[#B72099]/40 focus:bg-white/[0.06] transition-all tracking-wider"
            />
          </div>
        </div>

        {/* CONTENT LIST */}
        <div className="w-full min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {filteredList.length > 0 ? (
                <div className="flex flex-col">
                  {filteredList.map((item, idx) => {
                    const isDraft = activeTab === 'drafts';
                    const isTrulySent = String(item.sender_id) === String(userId) || item.isSender === true;
                    const isTrulyInbox = !isTrulySent && !isDraft;

                    return (
                      <motion.div
                        key={item.id || idx}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        onClick={() => !isDraft && handleTrackLetter(item)}
                        className={`py-5 px-5 flex items-center gap-4 cursor-pointer transition-all group relative border-b border-white/20 ${idx === 0 ? 'border-t border-white/20' : ''
                          }`}
                      >
                        {/* Status bar accent */}
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r-full transition-all opacity-0 group-hover:opacity-100 ${isTrulySent ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-pink-500 shadow-[0_0_10px_#ec4899]'
                          }`} />

                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${isTrulySent ? 'bg-blue-500/10 border-blue-500/20' : 'bg-pink-500/10 border-pink-500/20'
                          }`}>
                          <img src={letterIcon} className="w-7 h-7 object-contain" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <p className={`text-[9px] uppercase tracking-[0.2em] font-black mb-0 ${isTrulySent ? 'text-blue-400/60' : 'text-pink-400/60'
                                }`}>
                                {isTrulyInbox ? 'From' : isTrulySent ? 'To' : 'Preserved for'}
                              </p>
                              <h4 className="font-bold text-white text-[14px] truncate leading-tight">
                                {isTrulyInbox ? (item.sender_name === "0" ? "Anonymous Lover" : item.sender_name || "Someone") :
                                  isTrulySent ? (item.receiver_name || "Unknown") :
                                    (item.receiverName || "Your Love")}
                              </h4>
                            </div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap pt-1">
                              {item.created_at ? new Date(item.created_at).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              }) : (isDraft ? 'Draft' : '')}
                            </p>
                          </div>

                          {!isDraft && (
                            <div className="mt-1 flex items-center gap-1.5">
                              {item.status === 'SEEN' || item.status === 'ACCEPTED' ? (
                                <div className="flex items-center gap-1.5 py-0.5">
                                  <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                  <span className="text-[8px] font-black text-green-400/80 uppercase tracking-widest">{item.status}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 py-0.5">
                                  <div className="w-1 h-1 bg-[#B72099] rounded-full animate-pulse shadow-[0_0_8px_rgba(183,32,153,0.5)]" />
                                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{item.status || 'Delivered'}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {isDraft && (
                          <button
                            onClick={handleUnlock}
                            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-[#B72099] rounded-xl text-white text-[10px] font-black shadow-lg shadow-pink-500/10 active:scale-95 transition-all relative z-10"
                          >
                            FINISH
                          </button>
                        )}

                        <div className="opacity-0 group-hover:opacity-40 transition-opacity ml-auto">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02] border border-dashed border-white/5 rounded-[2.5rem]">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    {activeTab === 'inbox' ? <FaInbox className="text-3xl text-white/10" /> :
                      activeTab === 'sent' ? <FaPaperPlane className="text-3xl text-white/10" /> :
                        <FaPenNib className="text-3xl text-white/10" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-white/40 font-bold">No {activeTab} yet</p>
                    <p className="text-[10px] text-white/20 italic">
                      {activeTab === 'inbox' ? "Your mailbox is waiting for a secret message..." :
                        activeTab === 'sent' ? "You haven't sent any feelings yet..." :
                          "Your heart has no unfinished stories..."}
                    </p>
                  </div>
                  {activeTab === 'sent' && (
                    <button
                      onClick={handleCreateNew}
                      className="text-[10px] font-black text-pink-400 uppercase tracking-widest hover:text-pink-300 transition-colors"
                    >
                      Send your first letter →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
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
