import React from "react";

export default function SongNotificationCard({
  izhaarObj,
  senderName,
  rejected,
  handleAccept,
  handleReject
}) {
  return (
    <div className="w-full rounded-3xl p-8 shadow-2xl backdrop-blur-lg border border-purple-400/50"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 20, 60, 0.9) 0%, rgba(40, 10, 80, 0.9) 100%)'
      }}>
      
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 text-center">
        🎵 Song Izhaar
      </h2>

      {/* Sender Info */}
      <div className="mb-6 p-4 rounded-xl bg-black/40 border border-purple-300/30">
        <p className="text-gray-400 text-sm font-semibold mb-1">From:</p>
        <p className="text-xl font-bold text-purple-300">{senderName}</p>
      </div>

      {/* Izhaar Code */}
      <div className="mb-6 p-4 rounded-xl bg-black/40 border border-purple-300/30">
        <p className="text-gray-400 text-sm font-semibold mb-1">Izhaar Code:</p>
        <p className="text-sm font-mono text-purple-200 break-all">{izhaarObj.izhaar_code || izhaarObj.code || 'N/A'}</p>
      </div>

      {/* Message */}
      {(izhaarObj.message || izhaarObj.text) && (
        <div className="mb-6 p-4 rounded-xl bg-black/40 border border-purple-300/30">
          <p className="text-gray-400 text-sm font-semibold mb-2">Message:</p>
          <p className="text-base text-gray-200">{izhaarObj.message || izhaarObj.text}</p>
        </div>
      )}

      {/* Audio Player */}
      {izhaarObj.file_path && (
        <div className="mb-6 p-6 rounded-xl bg-black/50 border border-pink-400/50">
          <p className="text-gray-400 text-sm font-semibold mb-3">🎧 Your Song:</p>
          <audio 
            controls 
            className="w-full rounded-lg"
            style={{ colorScheme: 'dark' }}>
            <source src={izhaarObj.file_path} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p className="text-xs text-gray-500 mt-3 font-mono break-all">File: {izhaarObj.file_path}</p>
        </div>
      )}

      {/* Download Button */}
      {izhaarObj.file_path && (
        <div className="mb-6">
          <a
            href={izhaarObj.file_path}
            download="izhaar-song.mp3"
            className="w-full inline-block text-center bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            📥 Download Song
          </a>
        </div>
      )}

      {/* Action Buttons */}
      {rejected ? (
        <div className="text-center">
          <span className="text-lg font-bold text-red-400">✓ Rejected successfully</span>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
            onClick={handleAccept}
          >
            ✓ Accept
          </button>
          <button
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
            onClick={handleReject}
          >
            ✗ Reject
          </button>
        </div>
      )}
    </div>
  );
}
