import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function IzhaarTracker() {
  const [loading, setLoading] = useState(false);
  const [allCodes, setAllCodes] = useState([]);
  const [selectedIzhaar, setSelectedIzhaar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllIzhaar = async () => {
      try {
        setLoading(true);
        const res = await api.get("/izhaar/all");
        const izhaarList = Array.isArray(res.data?.izhaar) ? res.data.izhaar : [];
        setAllCodes(izhaarList);
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAllIzhaar();
  }, []);

  const handleViewIzhaarDetail = (item) => {
    navigate('/user/notifictions/IzhaarNotificationDetail', {
      state: {
        izhaar: item,
        from: window.location.pathname,
        isSender: true
      }
    });
  };

  /* Premium Dark Theme Styles applied */

  const renderCodeItem = (item) => (
    <div
      key={item.id}
      className="mb-3"
      onClick={() => {
        setSelectedIzhaar(item);
        if (window.innerWidth < 768) {
          // Mobile: detail view will take full screen
        }
      }}
    >
      <div
        className={`relative rounded-2xl px-4 py-4 transition-all cursor-pointer group overflow-hidden ${selectedIzhaar?.id === item.id
          ? 'bg-gradient-to-r from-pink-900/40 to-purple-900/40 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          } border backdrop-blur-md`}
      >
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner border border-white/10 ${item.status === 'SEEN' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' :
              item.status === 'ACCEPTED' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                item.status === 'REJECTED' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                  'bg-gradient-to-br from-pink-500 to-rose-600'
              }`}>
              {item.status === 'ACCEPTED' ? '🎉' : item.status === 'REJECTED' ? '💔' : '💌'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/50 uppercase tracking-wider font-medium">To</p>
              <p className="text-sm font-bold text-white truncate w-[140px] sm:w-[200px] leading-tight">
                {item.receiver_name || item.receiver_mobile || item.receiver_email || item.receiver_instagram || "Unknown"}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg border border-white/10 ${item.status === "SENT" ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
              item.status === "DELIVERED" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                item.status === "SEEN" ? "bg-gradient-to-r from-purple-500 to-violet-500" :
                  item.status === "ACCEPTED" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                    item.status === "REJECTED" ? "bg-gradient-to-r from-red-500 to-pink-600" : "bg-gray-500"
              }`}
          >
            {item.status || "-"}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 relative z-10">
          <p className="text-[10px] text-white/40 font-mono">
            {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
          </p>
          <p className="text-[11px] font-bold text-pink-300 tracking-widest font-mono">
            #{item.izhaar_code || item.code || "N/A"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden relative z-10">
          <div
            className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${item.status === "SENT" ? "w-1/4 bg-yellow-400" :
              item.status === "DELIVERED" ? "w-2/4 bg-blue-400" :
                item.status === "SEEN" ? "w-3/4 bg-purple-400" :
                  item.status === "ACCEPTED" ? "w-full bg-green-400" :
                    item.status === "REJECTED" ? "w-full bg-red-400" : "w-1/6 bg-gray-500"
              }`}
          />
        </div>
      </div>
    </div>
  );

  const getStatusSteps = (status) => {
    const allSteps = ['SENT', 'DELIVERED', 'SEEN', 'ACCEPTED'];
    const currentIndex = allSteps.indexOf(status);
    return allSteps.map((step, index) => ({
      label: step,
      completed: index <= currentIndex,
      isRejected: status === 'REJECTED' && step === 'ACCEPTED'
    }));
  };

  const renderDetailedView = () => {
    if (!selectedIzhaar) return null;

    const steps = getStatusSteps(selectedIzhaar.status);

    return (
      <div className="relative h-full">
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 h-full flex flex-col">
          {/* Close Button - Only on Mobile */}
          <button
            onClick={() => setSelectedIzhaar(null)}
            className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/70 hover:text-white z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(233,30,99,0.5)]">
            Tracking Details
          </h2>
          <p className="text-sm text-white/60 mb-6">Live status updates for your delivery</p>

          {/* Izhaar Details Card */}
          <div className="bg-black/20 rounded-2xl p-4 mb-6 border border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Izhaar Code</p>
                <p className="text-base font-mono font-bold text-pink-300">#{selectedIzhaar.izhaar_code || selectedIzhaar.code}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Receiver</p>
                <p className="text-sm font-bold text-white break-words leading-tight">
                  {selectedIzhaar.receiver_name || selectedIzhaar.receiver_mobile || selectedIzhaar.receiver_email || "Unknown"}
                </p>
              </div>
              <div className="col-span-2 pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Created At</p>
                <p className="text-xs text-white/80 font-mono">
                  {selectedIzhaar.created_at ? new Date(selectedIzhaar.created_at).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => handleViewIzhaarDetail(selectedIzhaar)}
              className="mt-4 w-full rounded-xl px-4 py-3 font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                boxShadow: '0 0 15px rgba(233, 30, 99, 0.4)'
              }}
            >
              <span>View Full Message</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Progress Tracker - Vertical Layout */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="relative py-2 pl-2">
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={step.label} className="flex items-start relative group">
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-16 transition-all duration-500 delay-100 ${step.completed ? 'bg-gradient-to-b from-green-400 to-green-600 shadow-[0_0_8px_#4ade80]' : 'bg-white/10'
                          }`}
                        style={{ zIndex: 0 }}
                      />
                    )}

                    {/* Icon Circle */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 border-2 ${step.isRejected
                        ? 'bg-red-500 border-red-300 shadow-[0_0_15px_#ef4444]'
                        : step.completed
                          ? 'bg-green-500 border-green-300 shadow-[0_0_15px_#22c55e]'
                          : 'bg-black/40 border-white/10'
                        }`}
                    >
                      {step.isRejected ? (
                        <span className="text-white font-bold">✕</span>
                      ) : step.completed ? (
                        <span className="text-white font-bold">✓</span>
                      ) : (
                        <div className="w-2 h-2 bg-white/20 rounded-full" />
                      )}
                    </div>

                    {/* Label and Description */}
                    <div className="ml-5 pt-1">
                      <p className={`text-sm font-bold tracking-wide ${step.isRejected
                        ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'
                        : step.completed
                          ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]'
                          : 'text-white/30'
                        }`}>
                        {step.isRejected ? 'REJECTED' : step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${step.completed || step.isRejected ? 'text-white/70' : 'text-white/20'}`}>
                        {step.label === 'SENT' && 'Your Izhaar has been sent successfully.'}
                        {step.label === 'DELIVERED' && 'Delivered to the receiver\'s device.'}
                        {step.label === 'SEEN' && 'The receiver has opened and viewed your Izhaar.'}
                        {step.label === 'ACCEPTED' && !step.isRejected && 'Great news! They accepted your proposal! 🎉'}
                        {step.isRejected && 'They have declined the proposal. 😔'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
        }
        .love-truck-container {
             background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%);
             backdrop-filter: blur(5px);
             border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>

      {/* Mobile Full Screen Detail View */}
      {selectedIzhaar && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto bg-[#1E3A8A]">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#581C87] to-[#1E3A8A] opacity-95" />

          <div className="relative min-h-screen p-4 pt-4">
            {/* Back Button for mobile view detail */}
            <button
              onClick={() => setSelectedIzhaar(null)}
              className="mb-4 flex items-center gap-2 text-white/80 hover:text-white"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </div>
              <span className="text-sm font-medium">Back to List</span>
            </button>
            {renderDetailedView()}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="min-h-screen w-full relative pb-10" style={{
        background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
        backgroundAttachment: 'fixed'
      }}>

        {/* Ambient Background Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* Mobile Back Button - Main Screen */}
        <button
          onClick={() => navigate("/user/dashboard")}
          className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 md:pt-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-[0_0_20px_rgba(233,30,99,0.5)]">
              Izhaar <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Tracker</span>
            </h1>
            <p className="text-sm md:text-base text-white/50 max-w-lg mx-auto">
              Track your sent Izhaars in real-time. Fast, secure, and beautiful.
            </p>
          </div>

          {/* Love Truck Banner */}
          <div className="mb-8">
            <div className="love-truck-container relative max-w-3xl mx-auto h-12 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.2)]">
              <div className="absolute inset-0 flex items-center">
                <div className="love-truck text-2xl drop-shadow-[0_0_5px_rgba(255,105,180,0.8)]">
                  🚚..💗
                </div>
                <p className="w-full text-center text-xs sm:text-sm font-semibold text-white/80 tracking-wide uppercase">
                  Live Status Updates Active
                </p>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Side: List */}
            <div className="md:col-span-6 lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📋</span> Recent Activity
                </h2>
                <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-md">{allCodes.length} items</span>
              </div>

              <div className="space-y-3 pb-20 md:pb-0">
                {loading && allCodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <div className="text-4xl mb-4 animate-bounce">⏳</div>
                    <p className="text-white/60 font-medium">Loading history...</p>
                  </div>
                ) : allCodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm text-center px-6">
                    <div className="text-5xl mb-4 opacity-50">📭</div>
                    <p className="text-lg font-bold text-white/80">No Izhaars Sent Yet</p>
                    <p className="text-sm text-white/40 mt-2">Start sending love to see tracking details here!</p>
                  </div>
                ) : (
                  allCodes.map((item) => renderCodeItem(item))
                )}
              </div>
            </div>

            {/* Right Side: Detail View (Desktop Only) */}
            <div className="hidden md:block md:col-span-6 lg:col-span-7 sticky top-6 h-[600px]">
              {selectedIzhaar ? (
                renderDetailedView()
              ) : (
                <div className="h-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center p-10 animate-pulse-slow">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(233,30,99,0.1)]">
                    <span className="text-5xl">👈</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Select an Item</h3>
                  <p className="text-white/40 max-w-xs">
                    Click on any Izhaar card from the list to view its real-time delivery timeline and details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Styles for Animation */}
        <style>{`
          @keyframes loveTruck {
            0% { transform: translateX(100%); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(-300%); opacity: 0; }
          }
          .love-truck {
            position: absolute;
            left: 50%;
            animation: loveTruck 8s linear infinite;
          }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </div>
    </>
  );
}