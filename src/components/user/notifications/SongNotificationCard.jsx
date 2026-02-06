import React, { useState } from "react";
import bg1 from '../../../assets/temp/letter_01.png';
import bg2 from '../../../assets/temp/letter_02.jpeg';
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
    <div className="w-full p-4 sm:p-6 md:p-8 backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
      <h4 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 text-center drop-shadow-sm">
        🎵 Song Izhaar
      </h4>

      {/* Sender Info - Glass Card */}
      <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">From</p>
          <p className="text-lg font-bold text-white">{senderName}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Code</p>
          <p className="text-sm font-mono text-pink-300 font-bold">{izhaarObj.izhaar_code || izhaarObj.code || 'N/A'}</p>
        </div>
      </div>

      {/* Modern Music Card */}
      {izhaarObj.file_path && (
        <div className="mb-8">
          {/* Album Art Card with Overlay */}
          <div className="relative group cursor-pointer mb-6 mx-auto max-w-sm">
            <div
              className="rounded-3xl shadow-[0_10px_40px_-10px_rgba(233,30,99,0.3)] overflow-hidden aspect-square border-4 border-white/10 group-hover:border-pink-500/50 transition-all duration-500"
              style={{
                backgroundImage: `url(${TEMPLATES.find(t => t.id === selectedTemplate)?.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Dark Overlay - Top to Bottom Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

              {/* Spinning Vinyl Effect (Optional) */}
              <div className={`absolute inset-0 flex items-center justify-center opacity-30 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <div className="w-2/3 h-2/3 rounded-full border-[20px] border-black/80"></div>
              </div>

              {/* Song Info Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">🎵 Special Song</h3>
                <p className="text-pink-200 text-sm mb-4 font-medium">Dedication from {senderName}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div
                    className="w-full bg-white/20 rounded-full h-1.5 sm:h-2 overflow-hidden cursor-pointer hover:h-2 sm:hover:h-2.5 transition-all"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-2 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Audio Player (Hidden but functional) */}
                <audio
                  id={`modernPlayer-${izhaarObj.izhaar_code}`}
                  className="w-full hidden"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={izhaarObj.file_path} type="audio/mpeg" />
                </audio>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-6">
                  <button className="text-white/60 hover:text-white transition">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-110 transition-all border border-white/20"
                  >
                    {isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <button className="text-white/60 hover:text-white transition">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 18l2-3h2v12h-2v-9zm0-12l-8.5 6L16 12V6z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>



          {/* Download Button */}
          <div className="mb-6 text-center">
            <a
              href={izhaarObj.file_path}
              download="izhaar-song.mp3"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-2 px-6 rounded-full transition-all text-sm backdrop-blur-sm"
            >
              <span>📥</span> Download Song
            </a>
          </div>
        </div>
      )}


      {/* Action Buttons */}
      {rejected ? (
        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
          <span className="text-lg font-bold text-red-400 drop-shadow-md">✓ Rejected successfully</span>
        </div>
      ) : hideActions ? (
        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
          <span className="text-lg font-bold text-gray-300">This is your sent Izhaar</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 border border-white/10"
            onClick={handleAccept}
          >
            ✓ Accept
          </button>
          <button
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 border border-white/10"
            onClick={handleReject}
          >
            ✗ Reject
          </button>
        </div>
      )}
    </div>
  );
}
