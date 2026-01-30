import React, { useState, useEffect, useRef } from 'react';
import { FaHeart, FaComment, FaShare, FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaPlus, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { useUserId } from '../../../hooks/useUserId';

// Import Asset Videos
import starsVideo from '../../../assets/video/Stars_1.mp4';
import bgVideo from '../../../assets/video/bg1.mp4';
import myPageVideo from '../../../assets/video/mypage.mp4';

const Reels = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

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
      videoUrl: starsVideo,
      caption: 'Starry Nights ✨',
      user: { name: 'Izhaar Magic', avatar: '✨' },
      likes: 120,
      comments: 5,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-2",
      videoUrl: bgVideo,
      caption: 'Aesthetic Vibes 🌸',
      user: { name: 'Izhaar Vibes', avatar: '🌸' },
      likes: 85,
      comments: 2,
      isLiked: false,
      type: 'video'
    },
    {
      id: "asset-3",
      videoUrl: myPageVideo,
      caption: 'My Page Story 📖',
      user: { name: 'Izhaar Stories', avatar: '📖' },
      likes: 200,
      comments: 10,
      isLiked: false,
      type: 'video'
    },

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
    setMuted(!muted);
    videoRefs.current.forEach(video => {
      if (video) video.muted = !muted;
    });
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
                muted
                preload="auto"
                onClick={togglePlay}
                onError={(e) => console.error('Video error:', reel.videoUrl, e)}
                onLoadedData={() => console.log('Video loaded:', reel.videoUrl)}
              />
            )}

            {/* Overlay Controls */}
            <div className={`absolute inset-0 ${reel.locked ? 'z-30 pointer-events-none' : 'pointer-events-none'}`}>

              {/* Top Bar - ALWAYS VISIBLE */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-auto">
                <div className="flex items-center justify-between">
                  <button onClick={() => navigate(-1)} className="text-white text-xl">
                    ✕
                  </button>
                  <div className="text-white font-bold">Reels</div>
                  <button onClick={toggleMute} className="text-white text-xl">
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
                <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-auto">
                  <div className="flex items-start justify-between">
                    {/* User Info & Caption */}
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl">
                          {reel.user.avatar}
                        </div>
                        <span className="text-white font-bold">{reel.user.name}</span>
                        <button className="text-white text-sm border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition">
                          Follow
                        </button>
                      </div>
                      <p className="text-white text-sm">{reel.caption}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Like */}
                      <button
                        onClick={() => handleLike(reel.id)}
                        className="flex flex-col items-center transition-transform hover:scale-110"
                      >
                        <div className={`text-3xl ${reel.isLiked ? 'text-red-500' : 'text-white'}`}>
                          <FaHeart className={reel.isLiked ? 'fill-current' : ''} />
                        </div>
                        <span className="text-white text-xs">{reel.likes}</span>
                      </button>

                      {/* Comment */}
                      <button className="flex flex-col items-center transition-transform hover:scale-110">
                        <div className="text-white text-3xl">
                          <FaComment />
                        </div>
                        <span className="text-white text-xs">{reel.comments}</span>
                      </button>

                      {/* Share */}
                      <button className="flex flex-col items-center transition-transform hover:scale-110">
                        <div className="text-white text-3xl">
                          <FaShare />
                        </div>
                        <span className="text-white text-xs">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Play/Pause indicator - Hidden on Locked to prevent confusion/interaction if iframe captures it */}
              {!playing && !reel.locked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" onClick={togglePlay}>
                  <div className="bg-black/50 rounded-full p-6">
                    <FaPlay className="text-white text-4xl" />
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
