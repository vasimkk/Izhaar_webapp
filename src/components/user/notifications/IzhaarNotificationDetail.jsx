import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../../../utils/api';
import LetterNotificationCard from './LetterNotificationCard';

export default function IzhaarNotificationDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  // Expecting izhaar object to be passed via location.state
  const izhaarObj = location.state?.izhaar || {};
  const [rejected, setRejected] = useState(false);

  const senderName = izhaarObj.sender_name === 0 || izhaarObj.sender_name === '0' ? 'Izhaar User' : izhaarObj.sender_name || 'Unknown';

  const handleAccept = async () => {
    try {
      await api.patch(`/izhaar/accept/${izhaarObj.izhaar_code || izhaarObj.code}`);
      navigate('/user/chat-interface');
      // Optionally show a toast here
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
     
      <div className="w-full max-w-lg  p-6 flex flex-col items-center">
        {isLetterType ? (
          <LetterNotificationCard
            izhaarObj={izhaarObj}
            senderName={senderName}
            rejected={rejected}
            handleAccept={handleAccept}
            handleReject={handleReject}
          />
        ) : (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold text-pink-500 mb-4">Izhaar Details</h2>
            <div className="w-full mb-2 flex flex-col items-start">
              <span className="text-gray-500 text-sm font-semibold">Izhaar Code:</span>
              <span className="text-lg font-bold text-gray-800">{izhaarObj.izhaar_code || izhaarObj.code || 'N/A'}</span>
            </div>
            <div className="w-full mb-2 flex flex-col items-start">
              <span className="text-gray-500 text-sm font-semibold">Sender:</span>
              <span className="text-lg font-bold text-gray-800">{senderName}</span>
            </div>
            {(izhaarObj.text || izhaarObj.message) && (
              <div className="w-full mb-2 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-semibold">Message:</span>
                <span className="text-base text-gray-700 mt-1">{izhaarObj.text || izhaarObj.message}</span>
              </div>
            )}
            {rejected ? (
              <span className="text-red-500 font-bold text-base mt-6">Rejected successfully</span>
            ) : (
              <div className="flex gap-4 mt-6">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow"
                  onClick={handleAccept}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow"
                  onClick={handleReject}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
