import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
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

export default function SongPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { receiverDetails } = useReceiverForLetter();

  // State from location (either direct generation or ID-based request)
  const initialData = location.state || {};
  const [requestId, setRequestId] = useState(initialData.requestId || initialData.id || null);
  const [audioUrl, setAudioUrl] = useState(initialData.audioUrl || initialData.song_file_path || null);
  const [status, setStatus] = useState(initialData.status || (requestId ? "PENDING" : "COMPLETED"));

  // Metadata
  const [lyrics, setLyrics] = useState(initialData.lyrics || initialData.story || "");
  const [style, setStyle] = useState(initialData.style || "Pop");
  const [mood, setMood] = useState(initialData.mood || "Neutral");

  const [checkingStatus, setCheckingStatus] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [requestDetails, setRequestDetails] = useState(initialData || null);

  // Poll for status if requestId exists and not completed
  useEffect(() => {
    // If passed data already has the song file path, ensure it's set
    if (initialData.song_file_path && !audioUrl) {
      setAudioUrl(initialData.song_file_path);
    }

    if (!requestId || status === "COMPLETED") {
      if (status === "COMPLETED" && !audioUrl && requestDetails?.song_file_path) {
        setAudioUrl(requestDetails.song_file_path);
      }
      return;
    }

    const checkStatus = async () => {
      try {
        setCheckingStatus(true);
        const res = await api.get(`/music/request/${requestId}`);
        if (res.data.success) {
          const req = res.data.request;
          setStatus(req.status);
          setRequestDetails(req); // Store full details

          if (req.status === "COMPLETED" && req.song_file_path) {
            setAudioUrl(req.song_file_path);
            setLyrics(req.story || lyrics);
            toast.success("🎵 Your song is ready!");
          }
        }
      } catch (err) {
        console.error("Status check failed", err);
      } finally {
        setCheckingStatus(false);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 10 seconds
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [requestId, status]);

  // Helper to get receiver name
  const getReceiverName = () => {
    if (!requestDetails) return "Unknown";
    let details = requestDetails.details;
    if (typeof details === 'string') {
      try { details = JSON.parse(details); } catch (e) { }
    }
    return details?.receiver?.name || details?.receiver?.fullname || "Special Someone";
  };

  const handleManualRefresh = async () => {
    if (!requestId) return;
    setCheckingStatus(true);
    try {
      const res = await api.get(`/music/request/${requestId}`);
      if (res.data.success) {
        const req = res.data.request;
        setStatus(req.status);
        setRequestDetails(req);
        if (req.status === "COMPLETED" && req.song_file_path) {
          setAudioUrl(req.song_file_path);
          setLyrics(req.story || lyrics);
          toast.success("🎵 Your song is ready!");
        } else {
          toast.info(`Current Status: ${req.status}`);
        }
      }
    } catch (err) {
      toast.error("Failed to refresh status");
    } finally {
      setCheckingStatus(false);
    }
  };

  if (!audioUrl && !requestId) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <p className="text-white text-lg mb-4">No song data found.</p>
          <button
            onClick={() => navigate("/user/song/create")}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Go Back to Create
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteRequest = async () => {
    if (!requestId) return;
    if (window.confirm("Are you sure you want to cancel this request? You can submit a new one.")) {
      try {
        const res = await api.delete(`/music/request/${requestId}`);
        if (res.data.success) {
          toast.success("Request cancelled successfully.");
          navigate("/user/song/create");
        } else {
          toast.error(res.data.message || "Failed to cancel request");
        }
      } catch (err) {
        toast.error("Error cancelling request");
      }
    }
  };

  // --- PENDING STATE UI ---
  if (status !== "COMPLETED" && requestId) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        }}
      >
        <div className="text-center max-w-lg p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-fade-in relative z-10">

          {/* Animated Music Note or Hourglass */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
              <span className="text-4xl">⏳</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Creating Your Masterpiece...</h2>
          <p className="text-gray-300 mb-6">
            Our music directors are composing your song. This usually takes a little while.
            You can stay here or come back later.
          </p>

          <div className="bg-black/30 p-4 rounded-xl mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm border-b border-white/10 pb-2 mb-2">
              <span className="text-gray-400">Request ID:</span>
              <span className="text-white font-mono">#{requestId}</span>
            </div>

            {/* Receiver Info */}
            {(() => {
              let details = requestDetails?.details;
              if (typeof details === 'string') {
                try { details = JSON.parse(details); } catch (e) { }
              }
              const r = details?.receiver;
              if (r) {
                const name = r.receiverName || r.name || r.fullname || r.receiver?.receiverName;
                const mobile = r.receiverMobile || r.mobile || r.receiver?.receiverMobile;

                return (
                  <div className="bg-white/5 p-3 rounded-lg my-2 text-sm border border-white/10">
                    <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Receiver Details</p>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-semibold">{name || "Unknown"}</span>
                    </div>
                    {mobile && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mobile:</span>
                        <span className="text-white font-mono text-xs">{mobile}</span>
                      </div>
                    )}
                  </div>
                );
              }
            })()}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Style:</span>
              <span className="text-white">{requestDetails?.style || style}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Mood:</span>
              <span className="text-white">{requestDetails?.mood || mood}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-2">
              <span className="text-gray-400">Status:</span>
              <span className={`font-bold ${status === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'}`}>
                {status}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-center">
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleManualRefresh}
                disabled={checkingStatus}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition flex items-center gap-2"
              >
                {checkingStatus ? "Checking..." : "🔄 Refresh Status"}
              </button>
              <button
                onClick={() => navigate("/user/dashboard")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition"
              >
                Go to Dashboard
              </button>
            </div>


          </div>
        </div>
      </div>
    );
  }

  // --- COMPLETED / PREVIEW UI (Existing Logic) ---

  const dataURLToFile = async (urlOrDataUrl, filename) => {
    // If it's a remote URL (cloudinary), we might send URL directly or fetch blob.
    // Ideally backend 'submitIzhaar' should accept a URL directly if it's already uploaded.
    // Or we fetch blob and re-upload.
    // Currently submitIzhaar handles file upload or we pass file_path string if already uploaded?
    // User wants to SEND this song in an Izhaar.

    // If audioUrl starts with 'http', it's already a file. 
    // We can fetch it and convert to File object if the submit API requires a File.
    if (urlOrDataUrl.startsWith('http')) {
      try {
        const response = await fetch(urlOrDataUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
      } catch (e) {
        console.error("Failed to convert URL to file", e);
        return null;
      }
    }

    // Base64 handling
    try {
      const [meta, base64] = urlOrDataUrl.split(",");
      const mimeMatch = meta.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "audio/mpeg";
      const bstr = atob(base64);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      return null;
    }
  };

  const handleSendSong = async () => {
    try {
      setSending(true);
      setSendError(null);
      setSendSuccess(null);

      const file = await dataURLToFile(audioUrl, "izhaar-song.mp3");
      // If we failed to get file object, and audioUrl is a remote URL, 
      // maybe we should update backend to accept 'file_url' in body?
      // Current submitIzhaar relies on req.file.

      if (!file) {
        setSendError("Failed to prepare audio file for upload.");
        return;
      }

      const sender_id = receiverDetails?.sender_id || "USER123";
      const izhaar_code = receiverDetails?.izhaar_code || `IZH-${Date.now()}`;

      // Prefer receiver from the stored request details
      let receiver = receiverDetails?.receiver || receiverDetails || {};
      if (requestDetails?.details) {
        let d = requestDetails.details;
        if (typeof d === 'string') {
          try { d = JSON.parse(d); } catch (e) { }
        }
        // Handle nested receiver structure if needed (based on user image it looked like details.receiver)
        if (d?.receiver) {
          receiver = d.receiver;
        }
      }

      const form = new FormData();
      form.append("izhaar_code", izhaar_code);
      form.append("sender_id", sender_id);
      form.append("type", "SONG");
      form.append("template_id", selectedTemplate);
      form.append("message", lyrics || "");
      form.append("receiver", JSON.stringify(receiver));
      form.append("file", file);

      console.log('Submitting song payload:', { izhaar_code, sender_id, type: "SONG", message: lyrics, receiver });
      const response = await api.post("/izhaar/submit", form);

      const submitData = response?.data || {};
      const uploadedFileUrl = submitData.file_path || submitData.file_url || submitData.url;
      if (uploadedFileUrl) {
        setFileUrl(uploadedFileUrl);
      }

      // Mark payment used logic...

      setSendSuccess("Izhaar submitted successfully!");
      toast.success("Success ❤️ Song sent beautifully");

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000);
    } catch (err) {
      setSendError(err.message || "Failed to send song");
      toast.error("Error: " + (err.message || "Failed"));
    } finally {
      setSending(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "song.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    const player = document.getElementById('modernPlayer');
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

    const player = document.getElementById('modernPlayer');
    if (player && duration) {
      player.currentTime = percentage * duration;
      setCurrentTime(percentage * duration);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #2c001e 0%, #1a0b2e 100%)',
        backgroundImage: `url("https://www.transparenttextures.com/patterns/black-linen.png"), linear-gradient(135deg, #1f001b 0%, #0d0d21 100%)`
      }}>
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10 overflow-y-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h6 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-2xl font-serif italic">
            🎉 Your Song is Ready!
          </h6>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-stretch">

          {/* LEFT SIDE - Modern Music Card */}
          <div className="w-full lg:w-2/3 flex flex-col items-center justify-center">
            {/* Modern Music Card */}
            <div className="w-full max-w-lg">
              {/* Album Art Card with Overlay */}
              <div className="relative group cursor-pointer mb-8">
                <div
                  className="rounded-3xl shadow-[0_0_40px_rgba(233,30,99,0.4)] overflow-hidden aspect-square border-4 border-white/10 hover:border-[#E91E63]/50 transition-all"
                  style={{
                    backgroundImage: `url(${TEMPLATES.find(t => t.id === selectedTemplate)?.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Dark Overlay - Top to Bottom Gradient */}
                  <div className="absolute inset-0 " />

                  {/* Song Info Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-2">✨ Your Song</h3>
                    <p className="text-gray-200 text-sm mb-4">Manual Service • {style} • {mood}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div
                        className="w-full bg-white/20 rounded-full h-2 overflow-hidden cursor-pointer hover:h-2.5 transition-all"
                        onClick={handleProgressClick}
                      >
                        <div
                          className="bg-gradient-to-r from-[#E91E63] to-[#9C27B0] h-full rounded-full transition-all"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-300 mt-2">
                        <span>{formatTime(currentTime)}</span>
                        {/* <span>{formatTime(duration)}</span> */}
                      </div>
                    </div>

                    {/* Audio Player (Hidden but functional) */}
                    <audio
                      id="modernPlayer"
                      className="w-full"
                      style={{
                        colorScheme: 'dark',
                        display: 'none'
                      }}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                    >
                      <source src={audioUrl} type="audio/mpeg" />
                    </audio>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-4">
                      <button className="text-gray-300 hover:text-white transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z" />
                        </svg>
                      </button>
                      <button
                        onClick={handlePlayPause}
                        className="w-14 h-14 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-2xl hover:scale-110 transition-all"
                      >
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                      <button className="text-gray-300 hover:text-white transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 18l2-3h2v12h-2v-9zm0-12l-8.5 6L16 12V6z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* RIGHT SIDE - Template Selector & Actions */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Template Selector */}
            <div className="bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/10 backdrop-blur-md">
              <h4 className="text-lg md:text-xl font-bold mb-4 text-center italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
                Pick a Style 🎨
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative h-40 rounded-2xl border-4 transition-all overflow-hidden group cursor-pointer ${selectedTemplate === template.id
                      ? 'border-[#E91E63] shadow-2xl scale-105'
                      : 'border-white/10 hover:border-[#9C27B0]/60'
                      }`}
                  >
                    {/* Background Image */}
                    <img
                      src={template.bg}
                      alt={template.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all" />

                    {/* Title at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white font-bold text-sm text-center">
                        {template.title}
                      </p>
                    </div>

                    {/* Selected Checkmark */}
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-[#E91E63] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSendSong}
                disabled={sending}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all border border-white/10 shadow-[0_0_20px_rgba(233,30,99,0.3)] bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(233,30,99,0.6)] hover:scale-105 active:scale-95'}`}
              >
                ✉️ {sending ? 'Sending…' : 'Send Song 💌'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {sendError && (
          <div className="mt-8 w-full max-w-4xl p-4 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300 text-sm text-center">
            {sendError}
          </div>
        )}

        {/* Success Message */}
        {sendSuccess && (
          <div className="mt-8 w-full max-w-4xl p-4 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-sm text-center">
            {sendSuccess}
            {fileUrl && (
              <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs text-emerald-200 font-mono text-left">
                <p className="font-semibold mb-2">📁 File Stored in Database:</p>
                <p className="break-all bg-black/50 p-2 rounded">🔗 {fileUrl}</p>
                <p className="mt-2 text-emerald-300">✅ Other users can now download this song</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

