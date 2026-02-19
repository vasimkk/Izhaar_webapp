import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { useUserId } from "../../../hooks/useUserId";
import { FaEnvelope, FaPlus, FaTimes, FaChevronLeft, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LetterIzhaarLanding() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [checkingDraft, setCheckingDraft] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [sentLetters, setSentLetters] = useState([]);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Rotate animation phase every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 2); // Only Phase 0 and 1 represent the main boutique cycle
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Check for existing draft and auto-redirect
  useEffect(() => {
    const checkForDraft = async () => {
      try {
        setCheckingDraft(true);
        // 1. Check Local Storage
        const localDraft = localStorage.getItem('izhaarLetterDraft');
        const localDrafts = localStorage.getItem('izhaarLetterDrafts');

        if (localDraft || localDrafts) {
          const parsed = JSON.parse(localDraft || localDrafts);
          const hasContent = Array.isArray(parsed) ? parsed.length > 0 : (parsed.senderName || parsed.receiverName || parsed.generatedLetter);

          if (hasContent) {
            navigate('/user/letter-izhaar/write-prompt', { replace: true });
            return;
          }
        }

        // 2. Check Backend Drafts
        try {
          const draftRes = await api.get('/letter/drafts');
          const allDrafts = Array.isArray(draftRes.data) ? draftRes.data : [];
          setDrafts(allDrafts);

          if (allDrafts.length > 0) {
            localStorage.setItem('izhaarLetterDraft', JSON.stringify(allDrafts[0]));
            navigate('/user/letter-izhaar/write-prompt', { replace: true });
            return;
          }
        } catch (err) {
          console.log('No backend drafts found');
        }

        // 3. Fetch Sent Letters (for display when no drafts)
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
        console.error('Error checking for draft:', err);
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
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))' }}
      >
        <div className="w-10 h-10 border-4 border-[#FF3F78] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full font-outfit text-white relative pb-10 overflow-x-hidden overflow-y-auto"
      style={{ background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))' }}
    >
      {/* Content integrated with background */}

      {/* Starry Background Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(40)].map((_, i) => (
          <div
            key={`bg-star-${i}`}
            className="sparkle-star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes floatHeart {
          0% { transform: translateY(10vh) translateX(0) rotate(0deg) scale(0); opacity: 0; }
          10% { opacity: 0.4; scale: 1; }
          100% { transform: translateY(-110vh) translateX(50px) rotate(360deg) scale(1.2); opacity: 0; }
        }
        .heart-particle {
          position: fixed;
          pointer-events: none;
          animation: floatHeart linear infinite;
          z-index: 1;
          color: rgba(255, 255, 255, 0.1);
        }
        .premium-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.3);
        }

        /* LUXURY BOUTIQUE ENVELOPE (Old Fashioned) */
        .envelope-scene {
          perspective: 2000px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 160px;
        }

        .boutique-envelope {
          width: 100px;
          height: 65px;
          background: linear-gradient(135deg, #720917 0%, #4D040E 100%);
          border: 1.5px solid #D4AF37;
          border-radius: 4px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          transform-style: preserve-3d;
        }

        .envelope-flap {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 40px;
          background: linear-gradient(to bottom, #9B1B30, #720917);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          transform-origin: top;
          z-index: 2;
          border: 1px solid #D4AF37;
          box-shadow: inset 0 -2px 5px rgba(0,0,0,0.2);
        }

        .luxury-wax-seal {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: radial-gradient(circle at center, #D4AF37 0%, #B8860B 100%);
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 3D Scroll */
        .scroll-rod {
          width: 120px;
          height: 10px;
          background: linear-gradient(to right, #B8860B, #D4AF37, #B8860B);
          border-radius: 5px;
          position: relative;
          z-index: 10;
        }

        .scroll-knob {
          position: absolute;
          width: 14px;
          height: 14px;
          background: radial-gradient(circle at center, #FFD700, #B8860B);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .scroll-paper-3d {
          width: 90px;
          background: linear-gradient(to bottom, #F4E4BC, #E2C08D);
          border-left: 1px solid rgba(0,0,0,0.1);
          border-right: 1px solid rgba(0,0,0,0.1);
          box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
        }

      

      
        .burst-heart {
          position: absolute;
          color: #9e0b0bff;
          pointer-events: none;
        }

        .sparkle-star {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 4px white;
          z-index: 0;
          pointer-events: none;
          animation: sparkle 3s infinite ease-in-out;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.1; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>

      {/* Romantic Particles */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(10)].map((_, i) => (
          <div key={`heart-${i}`} className="heart-particle flex items-center justify-center" style={{ left: `${Math.random() * 100}%`, bottom: `-10%`, fontSize: `${Math.random() * 20 + 10}px`, animationDuration: `${Math.random() * 12 + 10}s`, animationDelay: `${Math.random() * 5}s` }}>❤</div>
        ))}
      </div>

      {/* Top Header Controls */}
      <div className="relative z-50 p-6 w-full max-w-lg mx-auto flex justify-between items-center">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
        >
          <FaChevronLeft size={16} />
        </button>

        {/* Info Button (Top Right) */}
        <button
          onClick={() => setShowInfoModal(true)}
          className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 group shadow-[0_0_15px_rgba(183,32,153,0.5)] border border-white/20 overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #9333ea, #db2777)',
          }}
        >
          <div className="absolute inset-0 bg-pink-400/20 rounded-full animate-ping group-hover:animate-none opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40" />
          <span className="text-white text-xl font-serif italic font-bold relative z-10 select-none pb-0.5">i</span>
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-lg mx-auto pb-10">

        {/* Main Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif font-bold text-center mt-2 mb-4 bg-gradient-to-r from-[#FF3F78] via-[#B72099] to-[#9333EA] bg-clip-text text-transparent"
        >
          Write a letter
        </motion.h1>
        {/* Premium Boutique Animation Sequence */}
        <div className="envelope-scene scale-100 -mt-2 mb-4">
          <AnimatePresence mode="wait">
            {animationPhase === 0 && (
              <motion.div
                key="classic-opening"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="boutique-envelope flex items-center justify-center"
              >
                <motion.div
                  className="envelope-flap"
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: 180 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                />

                {/* Burst Hearts */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="burst-heart"
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1.2, 0],
                        x: (i - 2.5) * 30,
                        y: -80 - Math.random() * 40,
                        rotate: (i - 2.5) * 20
                      }}
                      transition={{ duration: 2, delay: 0.8 + i * 0.1, repeat: Infinity }}
                    >
                      <FaHeart size={12 + Math.random() * 8} />
                    </motion.div>
                  ))}
                </motion.div>

                <div className="luxury-wax-seal">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <FaHeart className="text-white text-[8px]" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {animationPhase === 1 && (
              <motion.div
                key="scroll-unroll"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="flex flex-col items-center"
              >
                <div className="scroll-rod">
                  <div className="scroll-knob -left-2" />
                  <div className="scroll-knob -right-2" />
                </div>
                <motion.div
                  className="scroll-paper-3d"
                  initial={{ height: 0 }}
                  animate={{ height: 110 }}
                  transition={{ duration: 1.5, ease: "anticipate" }}
                >
                  <div className="p-4 flex flex-col gap-3">
                    <div className="h-0.5 w-full bg-[#8B4513]/20" />
                    <div className="h-0.5 w-5/6 bg-[#8B4513]/20" />
                    <div className="h-0.5 w-full bg-[#8B4513]/20" />
                    <FaHeart className="text-[#8B4513]/30 self-center text-xl mt-2" />
                  </div>
                </motion.div>
                <div className="scroll-rod">
                  <div className="scroll-knob -left-2" />
                  <div className="scroll-knob -right-2" />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>



        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateNew}
          className="px-16 py-3 rounded-full border border-white/20 text-white font-bold bg-white/5 backdrop-blur-md transition-all mb-8 shadow-[0_0_20px_rgba(255,63,120,0.1)] text-sm tracking-wide"
        >
          Express your Feelings
        </motion.button>

        <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6" />

        {/* INNER SAMPLE CARD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
          onClick={handleSeeSample}
        >
          <div className="text-left">
            <p className="text-xs text-white/60 leading-tight group-hover:text-white transition-colors">Are you curious about <br /> the potential outcome?</p>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
            View Samples
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6" />


        {/* FEELINGS ON HOLD SECTION */}
        <div className="w-full space-y-3 mt-3">
          <h3 className="text-lg font-serif font-bold text-white px-2">
            Feelings on Hold
          </h3>

          <div className="w-full bg-[#0A0D2E]/60 backdrop-blur-md rounded-[2rem] p-12 border border-white/5 flex flex-col items-center justify-center">
            {drafts.length > 0 ? (
              <div className="w-full space-y-4">
                {drafts.map((draft, idx) => (
                  <div key={draft.id || idx} className="flex items-center justify-between w-full py-2 border-b border-white/5 last:border-0">
                    <div className="text-left">
                      <p className="text-white font-medium">{draft.receiverName || 'Your Love'}</p>
                      <p className="text-xs text-white/40">{draft.wordCount || 0} words</p>
                    </div>
                    <button onClick={handleUnlock} className="text-pink-400 text-sm font-bold">Edit</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40 font-medium">Not yet expressed your feelings</p>
            )}
          </div>
        </div>

        {/* YOUR LETTERS LIST (STILL AVAILABLE BELOW) */}
        {sentLetters.length > 0 && (
          <div className="w-full mt-10 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 px-2">
              <span className="text-[#FF3F78]">💌</span> Delivered Feelings
            </h3>
            <div className="space-y-4">
              {sentLetters.map((letter) => (
                <motion.div
                  key={letter.id}
                  whileHover={{ x: 4 }}
                  className="w-full bg-white/5 backdrop-blur-lg rounded-3xl p-5 border border-white/10 shadow-sm flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl border border-white/10">
                      📜
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white text-sm truncate w-[140px] sm:w-auto">
                        To: {letter.receiver_name || "Unknown"}
                      </h4>
                      <p className="text-[10px] text-white/40">{new Date(letter.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTrackLetter(letter)}
                    className="p-3 bg-white/5 rounded-xl text-white/40 hover:bg-[#FF3F78] hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

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
                    <p className="text-[10px] text-pink-300/80 italic bg-white/5 p-2 rounded-lg border border-pink-500/10">💡 Tip: Say what you feel, why you feel it, and what makes them special. More details = a more meaningful letter 💌</p>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Safe delivery:</h6>
                    <p className="text-sm text-white/70 leading-relaxed">Your letter is delivered securely while your identity stays private.</p>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Delivery updates:</h6>
                    <p className="text-sm text-white/70 leading-relaxed">You’ll receive real-time updates when your letter is delivered and viewed.</p>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Private view & response:</h6>
                    <p className="text-sm text-white/70 leading-relaxed">They read your letter at their own pace and can choose how to respond:</p>
                    <ul className="text-xs text-white/60 list-disc list-inside mt-2 ml-2 space-y-2">
                      <li><span className="text-white/90 font-medium">Curious to Know</span> – Start a safe, anonymous chat</li>
                      <li><span className="text-white/90 font-medium">Not Interested</span> – Close the request respectfully</li>
                    </ul>
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
