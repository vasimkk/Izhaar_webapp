import React, { useState } from "react";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.png';
import bg3 from '../../../assets/temp/letter_03.png';
import bg4 from '../../../assets/temp/letter_04.png';

const TEMPLATES = [
  { id: "1", title: "Romantic Pink", bg: bg1, border: "border-[#ffb6b9]" },
  { id: "2", title: "Rose Love", bg: bg2, border: "border-[#e75480]" },
  { id: "3", title: "Cute Couple", bg: bg3, border: "border-[#a3d8f4]" },
  { id: "4", title: "Classic Letter", bg: bg4, border: "border-[#deb887]" },
];

export default function SongNotificationCard({
  izhaarObj,
  senderName,
  rejected,
  handleAccept,
  handleReject,
  hideActions
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(izhaarObj?.template_id || "1");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    const player = document.getElementById(`modernPlayer-${izhaarObj.izhaar_code}`);
    if (player) {
      if (player.paused) {
        player.play();
        setIsPlaying(true);
      } else {
        player.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = (e) => {
    const audio = e.target;
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    const audio = e.target;
    setDuration(audio.duration);
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    const player = document.getElementById(`modernPlayer-${izhaarObj.izhaar_code}`);
    if (player && duration) {
      player.currentTime = percentage * duration;
      setCurrentTime(percentage * duration);
    }
  };
  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
      <h4 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 sm:mb-6 text-center">
        🎵 Song Izhaar
      </h4>

      {/* Sender Info */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl">
        <p className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">From:</p>
        <p className="text-lg sm:text-xl font-bold text-purple-300">{senderName}</p>
      </div>

      {/* Izhaar Code */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-black/40 border border-purple-300/30">
        <p className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Izhaar Code:</p>
        <p className="text-xs sm:text-sm font-mono text-purple-200 break-all">{izhaarObj.izhaar_code || izhaarObj.code || 'N/A'}</p>
      </div>

      {/* Modern Music Card */}
      {izhaarObj.file_path && (
        <div className="mb-6 sm:mb-8">
          {/* Album Art Card with Overlay */}
          <div className="relative group cursor-pointer mb-4 sm:mb-6">
            <div
              className="rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden aspect-square border-2 sm:border-4 border-white/20 hover:border-[#E91E63]/50 transition-all"
              style={{
                backgroundImage: `url(${TEMPLATES.find(t => t.id === selectedTemplate)?.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Dark Overlay - Top to Bottom Gradient */}
              <div className="absolute inset-0" />
              
              {/* Song Info Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">🎵 Song</h3>
                <p className="text-gray-200 text-xs sm:text-sm mb-3 sm:mb-4">From {senderName}</p>
                
                {/* Progress Bar */}
                <div className="mb-3 sm:mb-4">
                  <div 
                    className="w-full bg-white/20 rounded-full h-1.5 sm:h-2 overflow-hidden cursor-pointer hover:h-2 sm:hover:h-2.5 transition-all"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="bg-gradient-to-r from-[#E91E63] to-[#9C27B0] h-full rounded-full transition-all" 
                      style={{width: `${duration ? (currentTime / duration) * 100 : 0}%`}}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1 sm:mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Audio Player (Hidden but functional) */}
                <audio 
                  id={`modernPlayer-${izhaarObj.izhaar_code}`}
                  className="w-full"
                  style={{
                    colorScheme: 'dark',
                    display: 'none'
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={izhaarObj.file_path} type="audio/mpeg" />
                </audio>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                  <button className="text-gray-300 hover:text-white transition">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={handlePlayPause}
                    className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-2xl hover:scale-110 transition-all"
                  >
                    {isPlaying ? (
                      <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                  <button className="text-gray-300 hover:text-white transition">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 18l2-3h2v12h-2v-9zm0-12l-8.5 6L16 12V6z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

         

          {/* Download Button */}
          <div className="mb-4 sm:mb-6">
            <a
              href={izhaarObj.file_path}
              download="izhaar-song.mp3"
              className="w-full inline-block text-center bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transition-all text-sm sm:text-base"
            >
              📥 Download Song
            </a>
          </div>
        </div>
      )}

      

      {/* Action Buttons */}
      {rejected ? (
        <div className="text-center">
          <span className="text-base sm:text-lg font-bold text-red-400">✓ Rejected successfully</span>
        </div>
      ) : hideActions ? (
        <div className="text-center">
          <span className="text-base sm:text-lg font-bold text-gray-300">This is your sent Izhaar</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transition-all text-sm sm:text-base"
            onClick={handleAccept}
          >
            ✓ Accept
          </button>
          <button
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transition-all text-sm sm:text-base"
            onClick={handleReject}
          >
            ✗ Reject
          </button>
        </div>
      )}
    </div>
  );
}
