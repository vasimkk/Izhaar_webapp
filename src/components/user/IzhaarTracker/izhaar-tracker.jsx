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
        from: window.location.pathname 
      } 
    });
  };

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
        className={`relative bg-white/80 backdrop-blur rounded-2xl px-4 py-3 shadow-sm border transition-all cursor-pointer hover:shadow-md ${
          selectedIzhaar?.id === item.id ? 'border-pink-400 ring-2 ring-pink-200' : 'border-pink-100'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white flex items-center justify-center text-sm">
              💌
            </div>
            <div>
              <p className="text-xs text-gray-500">To</p>
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[170px] sm:max-w-[220px]">
                {item.receiver_name || item.receiver_mobile || item.receiver_email || item.receiver_instagram || "Unknown"}
              </p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white whitespace-nowrap ${
              item.status === "SENT" ? "bg-yellow-400" :
              item.status === "DELIVERED" ? "bg-blue-400" :
              item.status === "SEEN" ? "bg-purple-400" :
              item.status === "ACCEPTED" ? "bg-green-400" :
              item.status === "REJECTED" ? "bg-red-400" : "bg-gray-400"
            }`}
          >
            {item.status || "-"}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-gray-500">
            {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
          </p>
          <p className="text-[11px] font-semibold text-pink-600 tracking-wide">
            {item.izhaar_code || item.code || "N/A"}
          </p>
        </div>

        <div className="mt-2 h-1.5 w-full rounded-full bg-pink-50 overflow-hidden">
          <div
            className={`h-full rounded-full ${
              item.status === "SENT" ? "w-1/4 bg-yellow-400" :
              item.status === "DELIVERED" ? "w-2/4 bg-blue-400" :
              item.status === "SEEN" ? "w-3/4 bg-purple-400" :
              item.status === "ACCEPTED" ? "w-full bg-green-400" :
              item.status === "REJECTED" ? "w-full bg-red-400" : "w-1/6 bg-gray-300"
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
      <div className="relative">
       

        <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl h-full">
          {/* Close Button - Only on Mobile */}
          <button
            onClick={() => setSelectedIzhaar(null)}
            className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
            Izhaar Tracker
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Track your Izhaar delivery status</p>

          {/* Izhaar Details */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Izhaar Code</p>
                <p className="text-sm sm:text-base font-bold text-pink-600">{selectedIzhaar.izhaar_code || selectedIzhaar.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Receiver</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                  {selectedIzhaar.receiver_name || selectedIzhaar.receiver_mobile || selectedIzhaar.receiver_email || "Unknown"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Created At</p>
                <p className="text-xs sm:text-sm text-gray-700">
                  {selectedIzhaar.created_at ? new Date(selectedIzhaar.created_at).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>
            
            {/* Preview Button */}
            <button
              onClick={() => handleViewIzhaarDetail(selectedIzhaar)}
              className="mt-3 w-full rounded-lg px-4 py-2.5 font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)'
              }}
            >
              View Izhaar Details
            </button>
          </div>

          {/* Progress Tracker - Vertical Layout */}
          <div className="relative py-4">
            <div className="flex flex-col space-y-6">
              {steps.map((step, index) => (
                <div key={step.label} className="flex items-start relative">
                  {/* Connection Line - Vertical */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`absolute left-4 sm:left-6 top-10 sm:top-12 w-0.5 sm:w-1 h-full ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  
                  {/* Icon Circle */}
                  <div 
                    className={`relative z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.isRejected 
                        ? 'bg-red-500' 
                        : step.completed 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.isRejected ? (
                      <span className="text-white text-base sm:text-2xl">✗</span>
                    ) : step.completed ? (
                      <span className="text-white text-base sm:text-2xl">✓</span>
                    ) : (
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full" />
                    )}
                  </div>
                  
                  {/* Label and Description */}
                  <div className="ml-4">
                    <p className={`text-sm sm:text-base font-bold ${
                      step.isRejected 
                        ? 'text-red-600' 
                        : step.completed 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                    }`}>
                      {step.isRejected ? 'REJECTED' : step.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.label === 'SENT' && 'Your Izhaar has been sent'}
                      {step.label === 'DELIVERED' && 'Delivered to receiver'}
                      {step.label === 'SEEN' && 'Receiver has viewed your Izhaar'}
                      {step.label === 'ACCEPTED' && !step.isRejected && 'Receiver accepted your Izhaar'}
                      {step.isRejected && 'Receiver declined your Izhaar'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Current Status</p>
            <p className={`text-base sm:text-lg font-bold ${
              selectedIzhaar.status === 'REJECTED' 
                ? 'text-red-600' 
                : selectedIzhaar.status === 'ACCEPTED' 
                ? 'text-green-600' 
                : 'text-yellow-600'
            }`}>
              {selectedIzhaar.status || 'PENDING'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Full Screen Detail View */}
      {selectedIzhaar && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 z-50 overflow-y-auto">
          <div className="min-h-screen p-4 pt-16">
            {renderDetailedView()}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
            animation: 'gradientShift 15s ease infinite'
          }}>
        
        {/* Mobile Back Button */}
        <button
          onClick={() => navigate("/user/dashboard")}
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

        {/* Header */}
        <div className="pt-9 px-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
            Izhaar Tracker
          </h1>
          <p className="text-xs sm:text-sm text-center text-gray-500 mt-1">
            Like a WhatsApp update — quick, clean, and beautiful.
          </p>
        </div>

        {/* Love Truck Animation */}
        <div className="px-4 mb-4">
          <div className="relative max-w-5xl mx-auto h-10 rounded-full bg-white/70 backdrop-blur border border-pink-100 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/80 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/80 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="love-truck">
                🚚💗💗💗
              </div>
              <p className="w-full text-center text-xs sm:text-sm font-semibold text-pink-600">
                Your love delivery is on the way...
              </p>
            </div>
          </div>
        </div>
        
        {/* Desktop: Two Column Layout, Mobile: Single Column */}
        <div className="px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side: Notification List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 hidden md:block">Your Izhaar List</h2>
                {loading && allCodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center pt-20">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-base font-semibold text-gray-400">Loading...</p>
                  </div>
                ) : allCodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center pt-20">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-base font-semibold text-gray-400">No Izhaar found</p>
                  </div>
                ) : (
                  allCodes.map((item) => renderCodeItem(item))
                )}
              </div>

              {/* Right Side: Detail View (Desktop Only) */}
              <div className="hidden md:block sticky top-4 h-fit">
                {selectedIzhaar ? (
                  renderDetailedView()
                ) : (
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center h-[500px]">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-lg font-semibold text-gray-600 text-center">
                      Select an Izhaar to view tracking details
                    </p>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Click on any Izhaar from the list to see its delivery status
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Animation Styles */}
        <style>{`
          @keyframes gradientShift {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(10deg); }
          }

          @keyframes loveTruck {
            0% { transform: translateX(0); }
            100% { transform: translateX(-220%); }
          }

          @keyframes loveTruckFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }

          .love-truck {
            position: absolute;
            left: 100%;
            font-size: 18px;
            white-space: nowrap;
            display: inline-block;
            will-change: transform;
            animation: loveTruck 6s linear infinite, loveTruckFloat 1.5s ease-in-out infinite;
            filter: drop-shadow(0 2px 6px rgba(233, 30, 99, 0.35));
          }
          
          @keyframes floatHeart {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg) scale(0.5);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            50% {
              transform: translateY(-200px) translateX(${Math.random() * 50 - 25}px) rotate(${Math.random() * 360}deg) scale(1);
              opacity: 0.6;
            }
            90% {
              opacity: 0.3;
            }
            100% {
              transform: translateY(-400px) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 720}deg) scale(0.3);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
}