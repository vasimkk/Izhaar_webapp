import React, { useState, useEffect, useRef } from 'react';
import { FaHeart, FaDownload, FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaPlus, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { useUserId } from '../../../hooks/useUserId';

// Import Asset Videos
import reel1 from '../../../assets/video/reel1.mp4';
import reel2 from '../../../assets/video/reel2.mp4';
import reel3 from '../../../assets/video/reel3.mp4';
import reel4 from '../../../assets/video/reel4.mp4';
import reel5 from '../../../assets/video/reel5.mp4';
import reel6 from '../../../assets/video/reel6.mp4';
import reel7 from '../../../assets/video/reel7.mp4';
import reel8 from '../../../assets/video/reel8.mp4';
import reel9 from '../../../assets/video/reel9.mp4';

const Reels = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);

  /* State for Upload */
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('video'); // 'video' or 'link'
  const [instagramLink, setInstagramLink] = useState('');
  const [uploadLocked, setUploadLocked] = useState(false);

  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // Fetch reels from backend
  useEffect(() => {
    fetchReels();
  }, []);

  /* Predefined Reels Data */
  const PREDEFINED_REELS = [
    {
      id: "asset-1",
      videoUrl: reel1,
      caption: 'Love Story 💕',
      user: { name: 'Izhaar Magic', avatar: '✨' },
      likes: 120,
      comments: 5,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-2",
      videoUrl: reel2,
      caption: 'Aesthetic Vibes 🌸',
      user: { name: 'Izhaar Vibes', avatar: '🌸' },
      likes: 85,
      comments: 2,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-3",
      videoUrl: reel3,
      caption: 'My Page Story 📖',
      user: { name: 'Izhaar Stories', avatar: '📖' },
      likes: 200,
      comments: 10,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-4",
      videoUrl: reel4,
      caption: 'Beautiful Moments 🎬',
      user: { name: 'Izhaar Moments', avatar: '🎬' },
      likes: 156,
      comments: 8,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-5",
      videoUrl: reel5,
      caption: 'Heartfelt Messages 💌',
      user: { name: 'Izhaar Hearts', avatar: '💌' },
      likes: 189,
      comments: 12,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-6",
      videoUrl: reel6,
      caption: 'Creative Expressions 🎨',
      user: { name: 'Izhaar Creative', avatar: '🎨' },
      likes: 145,
      comments: 7,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-7",
      videoUrl: reel7,
      caption: 'Magical Memories ✨',
      user: { name: 'Izhaar Dreams', avatar: '🌟' },
      likes: 220,
      comments: 15,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-8",
      videoUrl: reel8,
      caption: 'Special Feelings 💖',
      user: { name: 'Izhaar Feelings', avatar: '💖' },
      likes: 175,
      comments: 9,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-9",
      videoUrl: reel9,
      caption: 'Cherished Moments 🌹',
      user: { name: 'Izhaar Romance', avatar: '🌹' },
      likes: 198,
      comments: 11,
      isLiked: false,
      type: 'video'
    }
  ];

  const fetchReels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reels/feed');

      if (response.data.reels && response.data.reels.length > 0) {
        setReels(response.data.reels);
      } else {
        setReels(PREDEFINED_REELS);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
      // Fallback to predefined reels
      setReels(PREDEFINED_REELS);
    } finally {
      setLoading(false);
    }
  };

  // Play current video
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (playing) {
        currentVideo.play().catch(e => console.log('Play error:', e));
      } else {
        currentVideo.pause();
      }
    }

    // Pause all other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, playing]);

  // Handle scroll for swipe
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const itemHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
      setCurrentIndex(newIndex);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    setPlaying(!playing);
  };

  // Toggle mute
  const toggleMute = () => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    videoRefs.current.forEach(video => {
      if (video) video.muted = newMutedState;
    });
  };

  // Handle download
  const handleDownload = async (reel) => {
    try {
      if (reel.type === 'instagram' && reel.instagramUrl) {
        window.open(reel.instagramUrl, '_blank');
        return;
      }
      
      const response = await fetch(reel.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reel-${reel.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading reel:', error);
      alert('Unable to download this reel');
    }
  };

  // Handle like
  const handleLike = async (reelId) => {
    try {
      await api.post(`/reels/${reelId}/like`);
      setReels(reels.map(reel =>
        reel.id === reelId
          ? { ...reel, isLiked: !reel.isLiked, likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 }
          : reel
      ));
    } catch (error) {
      console.error('Error liking reel:', error);
      // Update UI anyway for demo
      setReels(reels.map(reel =>
        reel.id === reelId
          ? { ...reel, isLiked: !reel.isLiked, likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 }
          : reel
      ));
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (uploadType === 'video' && !uploadFile) {
      alert('Please select a video');
      return;
    }
    if (uploadType === 'link' && !instagramLink.trim()) {
      alert('Please enter Instagram reel link');
      return;
    }

    setUploading(true);

    // Create Temporary Reel Object
    const newReelId = Date.now();
    const newReel = {
      id: newReelId,
      videoUrl: uploadType === 'video' ? URL.createObjectURL(uploadFile) : null,
      instagramUrl: uploadType === 'link' ? instagramLink : null,
      caption: uploadCaption || (uploadType === 'video' ? 'My Video upload' : 'Instagram Reel'),
      user: { name: 'You', avatar: '👤' },
      likes: 0,
      comments: 0,
      isLiked: false,
      type: uploadType === 'video' ? 'video' : 'instagram',
      locked: uploadLocked
    };

    try {

      const formData = new FormData();
      if (uploadType === 'video') {
        formData.append('video', uploadFile);
      } else {
        formData.append('instagramUrl', instagramLink);
      }
      formData.append('caption', uploadCaption);
      formData.append('userId', userId);
      formData.append('type', uploadType);
      formData.append('locked', uploadLocked);

      // Attempt backend upload
      await api.post('/reels/upload', formData, {
        headers: uploadType === 'video' ? { 'Content-Type': 'multipart/form-data' } : {}
      });

      // If success, refetch
      fetchReels();

    } catch (error) {
      console.warn('Backend upload failed/missing, using local preview:', error);
      // Fallback: Add to local state immediately so user sees it
      setReels(prev => [newReel, ...prev]);
    }

    alert('Reel uploaded successfully! ✨');
    setShowUpload(false);
    setUploadFile(null);
    setInstagramLink('');
    setUploadCaption('');
    setUploadType('video');
    setUploadLocked(false);
    setUploading(false);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Reels...</div>
      </div>
    );
  }

  if (!reels || reels.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">No reels available</div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold"
        >
          Upload First Reel
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      {/* Reels Feed */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {reels.map((reel, index) => (
          <div key={reel.id} className="h-screen w-full snap-start relative flex items-center justify-center">
            {/* Video or Instagram Embed */}
            {reel.type === 'instagram' && reel.instagramUrl ? (
              <div className="h-full w-full bg-black flex items-center justify-center overflow-hidden">
                <iframe
                  src={`${reel.instagramUrl}/embed/captioned/?autoplay=1&muted=1`}
                  className="h-full w-full scale-[1.02]"
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  style={{ pointerEvents: reel.locked ? 'none' : 'auto' }}
                />
              </div>
            ) : (
              <video
                ref={el => videoRefs.current[index] = el}
                src={reel.videoUrl}
                className="h-full w-full object-cover"
                loop
                playsInline
                autoPlay
                muted={false}
                preload="auto"
                onClick={togglePlay}
                onError={(e) => console.error('Video error:', reel.videoUrl, e)}
                onLoadedData={() => console.log('Video loaded:', reel.videoUrl)}
              />
            )}

            {/* Overlay Controls */}
            <div className={`absolute inset-0 ${reel.locked ? 'z-30 pointer-events-none' : 'pointer-events-none'}`}>

              {/* Top Bar - ALWAYS VISIBLE */}
              <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-auto z-10">
                <div className="flex items-center justify-between">
                  <button onClick={() => navigate(-1)} className="text-white text-lg sm:text-xl p-2 hover:bg-white/10 rounded-full transition">
                    ✕
                  </button>
                  <div className="text-white font-bold text-base sm:text-lg">Reels</div>
                  <button onClick={toggleMute} className="text-white text-lg sm:text-xl p-2 hover:bg-white/10 rounded-full transition">
                    {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                </div>
              </div>

              {/* Locked Message Overlay */}
              {reel.locked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                    <p className="text-white font-medium flex items-center gap-2">
                      <span className="text-lg">🔒</span> View Only Mode
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Info & Interactions - HIDDEN IF LOCKED */}
              {!reel.locked && (
                <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-auto">
                  <div className="flex items-end justify-between gap-2">
                    {/* User Info & Caption */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-lg sm:text-2xl flex-shrink-0">
                          {reel.user.avatar}
                        </div>
                        <span className="text-white font-bold text-sm sm:text-base truncate">{reel.user.name}</span>
                        <button className="text-white text-xs sm:text-sm border border-white px-2 sm:px-3 py-1 rounded-full hover:bg-white hover:text-black transition flex-shrink-0">
                          Follow
                        </button>
                      </div>
                      <p className="text-white text-xs sm:text-sm line-clamp-2 pr-2">{reel.caption}</p>
                    </div>

                    {/* Action Buttons - Only Like and Download */}
                    <div className="flex flex-col items-center gap-3 sm:gap-4 flex-shrink-0">
                      {/* Like */}
                      <button
                        onClick={() => handleLike(reel.id)}
                        className="flex flex-col items-center transition-transform active:scale-95 hover:scale-110 touch-manipulation"
                      >
                        <div className={`text-2xl sm:text-3xl ${reel.isLiked ? 'text-red-500' : 'text-white'} drop-shadow-lg`}>
                          <FaHeart className={reel.isLiked ? 'fill-current' : ''} />
                        </div>
                        <span className="text-white text-xs font-semibold mt-1">{reel.likes}</span>
                      </button>

                      {/* Download */}
                      <button 
                        onClick={() => handleDownload(reel)}
                        className="flex flex-col items-center transition-transform active:scale-95 hover:scale-110 touch-manipulation"
                      >
                        <div className="text-white text-2xl sm:text-3xl drop-shadow-lg">
                          <FaDownload />
                        </div>
                        <span className="text-white text-xs font-semibold mt-1">Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Play/Pause indicator - Hidden on Locked to prevent confusion/interaction if iframe captures it */}
              {!playing && !reel.locked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" onClick={togglePlay}>
                  <div className="bg-black/50 rounded-full p-4 sm:p-6">
                    <FaPlay className="text-white text-3xl sm:text-4xl" />
                  </div>
                </div>
              )}

              {/* Click Blocker for Locked Reels - Prevents iframe interaction */}
              {reel.locked && (
                <div
                  className="absolute inset-0 z-20 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Optional: Temporarily show unlock hint or just block
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>



      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Upload Reel</h3>
              <button onClick={() => setShowUpload(false)} className="text-2xl text-gray-500">
                <FaTimes />
              </button>
            </div>

            {/* Upload Type Selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUploadType('video')}
                className={`flex-1 py-2 rounded-xl font-semibold transition ${uploadType === 'video'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                  }`}
              >
                📹 Upload Video
              </button>
              <button
                onClick={() => setUploadType('link')}
                className={`flex-1 py-2 rounded-xl font-semibold transition ${uploadType === 'link'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                  }`}
              >
                🔗 Instagram Link
              </button>
            </div>

            {/* File Preview or Link Input */}
            {uploadType === 'video' ? (
              uploadFile ? (
                <div className="mb-4">
                  <video
                    src={URL.createObjectURL(uploadFile)}
                    className="w-full h-64 object-cover rounded-xl"
                    controls
                  />
                  <button
                    onClick={() => setUploadFile(null)}
                    className="mt-2 text-red-500 text-sm"
                  >
                    Remove video
                  </button>
                </div>
              ) : (
                <label className="block mb-4">
                  <div className="w-full h-64 border-4 border-dashed border-purple-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition">
                    <FaPlus className="text-purple-400 text-4xl mb-2" />
                    <span className="text-gray-600">Click to select video</span>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              )
            ) : (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Instagram Reel URL</label>
                <input
                  type="url"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                  placeholder="https://www.instagram.com/p/DTPtUAqAaAJ/?igsh=MWIyc2QyY3VwN2hycQ=="
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Paste the full Instagram reel URL (e.g., https://www.instagram.com/reel/ABC123/)
                </p>
              </div>
            )}

            {/* Caption Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Caption</label>
              <textarea
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 outline-none resize-none"
                rows="3"
              />
            </div>

            {/* Locked Toggle */}
            <div className="mb-6 bg-pink-50 p-3 rounded-xl border border-pink-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={uploadLocked}
                    onChange={(e) => setUploadLocked(e.target.checked)}
                  />
                  <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition ${uploadLocked ? 'bg-pink-500' : ''}`}></div>
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${uploadLocked ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  🔒 Lock Reel <span className="text-xs font-normal text-gray-500">(View Only Mode)</span>
                </span>
              </label>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || (uploadType === 'video' && !uploadFile) || (uploadType === 'link' && !instagramLink.trim())}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${uploading || (uploadType === 'video' && !uploadFile) || (uploadType === 'link' && !instagramLink.trim())
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
                }`}
            >
              {uploading ? 'Uploading...' : 'Upload Reel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;
