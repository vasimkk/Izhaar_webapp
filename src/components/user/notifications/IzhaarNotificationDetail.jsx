import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../../../utils/api';
import LetterNotificationCard from './LetterNotificationCard';
import SongNotificationCard from './SongNotificationCard';

export default function IzhaarNotificationDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  // Expecting izhaar object to be passed via location.state
  const izhaarObj = location.state?.izhaar || {};
  const fromPath = location.state?.from || '';
  const [rejected, setRejected] = useState(false);

  // Check if coming from tracker - hide accept/reject buttons
  const isFromTracker = fromPath === '/user/izhaar_tracker';

  // Log the received data
  useEffect(() => {
    console.log("Izhaar Object received:", izhaarObj);
    console.log("Type:", izhaarObj.type);
    console.log("File Path:", izhaarObj.file_path);
    console.log("Message:", izhaarObj.message);
    console.log("From path:", fromPath);
  }, [izhaarObj, fromPath]);

  const senderName = izhaarObj.sender_name === 0 || izhaarObj.sender_name === '0' ? 'Izhaar User' : izhaarObj.sender_name || 'Unknown';

  const handleAccept = async () => {
    try {
      await api.patch(`/izhaar/accept/${izhaarObj.izhaar_code || izhaarObj.code}`);
      navigate('/user/chat-interface');
    } catch (e) {
      alert('Failed to accept.');
    }
  };

  const handleReject = async () => {
    try {
      await api.patch(`/izhaar/reject/${izhaarObj.izhaar_code || izhaarObj.code}`);
      setRejected(true);
    } catch (e) {
      alert('Failed to reject.');
    }
  };

  const isLetterType = izhaarObj.type === "LETTER";
  const isSongType = izhaarObj.type === "SONG";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4" style={{
      background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl p-0 sm:p-6 flex flex-col items-center relative z-10">
        {isLetterType ? (
          <LetterNotificationCard
            izhaarObj={izhaarObj}
            senderName={senderName}
            rejected={rejected}
            handleAccept={handleAccept}
            handleReject={handleReject}
            hideActions={isFromTracker}
          />
        ) : isSongType ? (
          <SongNotificationCard
            izhaarObj={izhaarObj}
            senderName={senderName}
            rejected={rejected}
            handleAccept={handleAccept}
            handleReject={handleReject}
            hideActions={isFromTracker}
          />
        ) : (
          // OTHER TYPES (not supported for now)
          <div className="w-full rounded-3xl p-8 shadow-2xl backdrop-blur-xl border border-white/10 bg-white/5">
            <div className="text-5xl text-center mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Izhaar Details</h2>
            <p className="text-gray-300 text-center mb-6">This Izhaar type is not fully supported in this view yet.</p>
            <button
              onClick={() => navigate('/user/notifications')}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95"
            >
              Back to Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
