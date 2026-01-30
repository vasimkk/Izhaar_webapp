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
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 ${isLetterType ? 'bg-gradient-to-br from-amber-50 via-pink-200 to-purple-300' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'}`}>
      <div className="w-full max-w-2xl p-0 sm:p-6 flex flex-col items-center">
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
          <div className="w-full rounded-3xl p-8 shadow-2xl backdrop-blur-lg border border-gray-400/50 bg-gradient-to-br from-gray-700 to-gray-900">
            <h2 className="text-2xl font-bold text-gray-300 mb-4 text-center">Izhaar Details</h2>
            <p className="text-gray-400 text-center">This Izhaar type is not supported yet.</p>
            <button
              onClick={() => navigate('/user/notifications')}
              className="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Back to Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
