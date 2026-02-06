import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import bg1 from '../../../assets/temp/letter_01.png';
import bg2 from '../../../assets/temp/letter_03.png';
import bg3 from '../../../assets/temp/letter_04.png';
import bg4 from '../../../assets/temp/letter_05.png';

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

  // Debug: Log what we're receiving
  useEffect(() => {
    console.log('%c🔍 DEBUG: SongPreview mounted', 'color: #FF6A6A; font-weight: bold;');
    console.log('Location state:', location.state);
    console.log('ReceiverDetails from context:', receiverDetails);
  }, []);

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
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)'
        }}
      >
        {/* Mobile Back Button */}
        <button
          onClick={() => navigate("/user/song/list")}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 bg-white/10 border border-white/10 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="text-center p-6 sm:p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-w-md shadow-2xl">
          <p className="text-white/80 text-lg mb-4 font-semibold">No song data found.</p>
          <button
            onClick={() => navigate("/user/song/create")}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-pink-500/20 hover:shadow-lg transition font-bold"
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
          background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)'
        }}
      >
        {/* Mobile Back Button */}
        <button
          onClick={() => navigate("/user/song/list")}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 bg-white/10 border border-white/10 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Processing Your Song</h2>
              <div className="w-20 sm:w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mb-4 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
              <div className="flex justify-center mt-4">
                <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
              </div>
            </div>

            <div className="bg-black/20 p-4 sm:p-5 rounded-2xl mb-6 text-center border border-white/5">
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">Song Reference ID</p>
              <p className="text-lg sm:text-2xl font-bold text-white font-mono tracking-wider">#{requestId}</p>
            </div>

            <div className="text-center mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm sm:text-base font-medium text-white/80 leading-relaxed">
                Our AI artists are composing your masterpiece. You'll receive a notification within 48 hours once it's ready!
              </p>
              <p className="text-xs text-pink-400 mt-3 font-semibold">Thank you for your patience ✨</p>
            </div>

            <button
              onClick={() => navigate("/user/dashboard")}
              className="w-full rounded-xl px-4 py-3.5 font-bold text-sm sm:text-base transition-all shadow-lg text-white transform hover:-translate-y-1 hover:shadow-pink-500/20 active:translate-y-0 active:scale-95 bg-gradient-to-r from-pink-600 to-purple-600 border border-white/10"
            >
              Return to Dashboard
            </button>

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
    console.log('%c🎵 SEND SONG FUNCTION CALLED', 'color: #FF6A6A; font-size: 16px; font-weight: bold;');

    try {
      console.log('%c📝 Starting song submission process...', 'color: #FF4D99; font-size: 12px;');

      setSending(true);
      setSendError(null);
      setSendSuccess(null);

      console.log('%c1️⃣ Converting audio URL to file...', 'color: #FFA500; font-size: 12px;');
      const file = await dataURLToFile(audioUrl, "izhaar-song.mp3");
      console.log('File conversion result:', file);

      if (!file) {
        console.error('%c❌ File conversion failed!', 'color: #EF4444; font-size: 12px;');
        setSendError("Failed to prepare audio file for upload.");
        return;
      }

      console.log('%c2️⃣ Preparing sender and receiver data...', 'color: #FFA500; font-size: 12px;');

      // Try multiple sources for receiver data
      let receiver = {};

      // Source 1: From location.state
      if (location.state?.receiver) {
        receiver = location.state.receiver;
        console.log('✅ Receiver from location.state');
      }
      // Source 2: From receiverDetails context
      else if (receiverDetails?.receiver) {
        receiver = receiverDetails.receiver;
        console.log('✅ Receiver from receiverDetails.receiver');
      }
      // Source 3: receiverDetails itself
      else if (receiverDetails) {
        receiver = receiverDetails;
        console.log('✅ Receiver from receiverDetails directly');
      }
      // Source 4: From requestDetails
      else if (requestDetails?.details) {
        let d = requestDetails.details;
        if (typeof d === 'string') {
          try { d = JSON.parse(d); } catch (e) { }
        }
        if (d?.receiver) {
          receiver = d.receiver;
          console.log('✅ Receiver from requestDetails');
        }
      }

      console.log('%c🔍 Raw receiver data found:', 'color: #FF4D99; font-weight: bold;');
      console.log(receiver);

      // Map receiver fields to match backend expectations
      const preAssignedCode = receiver?.izhaar_code;
      const generatedCode = `IZH-${Date.now()}`;

      console.log('%c📋 IZHAAR CODE SOURCES:', 'color: #FF4D99; font-weight: bold;');
      console.log('  Pre-assigned in receiver:', preAssignedCode);
      console.log('  Will generate if not present:', generatedCode);

      const mappedReceiver = {
        receiverName: receiver?.receiverName || receiver?.name || receiver?.fullname || "Special Someone",
        receiverMobile: receiver?.receiverMobile || receiver?.mobile || receiver?.phone || "",
        receiverEmail: receiver?.receiverEmail || receiver?.email || "",
        receiverInstagramId: receiver?.receiverInstagramId || receiver?.instagramId || receiver?.instagram_id || "",
        izhaar_code: preAssignedCode || generatedCode,
        sender_id: receiver?.sender_id || receiverDetails?.sender_id || localStorage.getItem('user_id') || localStorage.getItem('userId')
      };

      // Get sender_id from mapped receiver (actual user ID)
      let sender_id = mappedReceiver.sender_id;

      console.log('📍 Field Mapping:');
      console.log('  Source - location.state.receiver:', location.state?.receiver);
      console.log('  Source - receiverDetails.receiver:', receiverDetails?.receiver);
      console.log('  Source - receiverDetails:', receiverDetails);
      console.log('  Raw receiver found:', receiver);
      console.log('  Mapped receiver:', mappedReceiver);
      console.log('  Final sender_id used:', sender_id);

      const izhaar_code = mappedReceiver.izhaar_code;

      console.log('%c✅ Receiver Details Being Sent:', 'color: #10B981; font-weight: bold; font-size: 12px;');
      console.log(mappedReceiver);

      console.log('%c3️⃣ Building FormData...', 'color: #FFA500; font-size: 12px;');
      const form = new FormData();
      form.append("izhaar_code", izhaar_code);
      form.append("sender_id", sender_id);
      form.append("type", "SONG");
      form.append("template_id", selectedTemplate);
      form.append("message", lyrics || "");
      form.append("receiver", JSON.stringify(mappedReceiver));
      form.append("file", file);

      // Convert FormData to object for logging
      const formDataObject = {};
      for (let [key, value] of form.entries()) {
        if (value instanceof File) {
          formDataObject[key] = {
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified
          };
        } else {
          formDataObject[key] = value;
        }
      }

      // Comprehensive console logging
      console.log('%c╔════════════════════════════════════════╗', 'color: #FF6A6A; font-size: 12px; font-weight: bold;');
      console.log('%c║   SONG SUBMISSION TO BACKEND          ║', 'color: #FF6A6A; font-size: 12px; font-weight: bold;');
      console.log('%c╚════════════════════════════════════════╝', 'color: #FF6A6A; font-size: 12px; font-weight: bold;');

      console.log('%c📌 Individual Fields:', 'color: #FF4D99; font-weight: bold; font-size: 12px;');
      console.log('  izhaar_code:', izhaar_code, preAssignedCode ? '(pre-assigned from receiver)' : '(generated new)');
      console.log('  sender_id:', sender_id);
      console.log('  type:', "SONG");
      console.log('  template_id:', selectedTemplate);
      console.log('  message (lyrics):', lyrics || "(empty)");
      console.log('  receiver (mapped):', mappedReceiver);
      console.log('  file:', {
        name: file?.name,
        size: file?.size,
        type: file?.type,
        lastModified: file?.lastModified
      });

      console.log('%c📦 Complete FormData:', 'color: #FF4D99; font-weight: bold; font-size: 12px;');
      console.table(formDataObject);

      console.log('%c👤 ReceiverDetails from Context:', 'color: #9C27B0; font-weight: bold; font-size: 12px;');
      console.log(receiverDetails);

      console.log('%c📋 Request Details:', 'color: #9C27B0; font-weight: bold; font-size: 12px;');
      console.log(requestDetails);

      console.log('%c🔗 API Endpoint:', 'color: #3B82F6; font-weight: bold; font-size: 12px;');
      console.log('POST /izhaar/submit');

      console.log('%c4️⃣ Sending request to backend...', 'color: #FFA500; font-size: 12px;');
      const response = await api.post("/izhaar/submit", form);

      console.log('%c✅ Request successful!', 'color: #10B981; font-size: 12px; font-weight: bold;');
      console.log('%c╔════════════════════════════════════════╗', 'color: #10B981; font-size: 12px; font-weight: bold;');
      console.log('%c║   BACKEND RESPONSE                    ║', 'color: #10B981; font-size: 12px; font-weight: bold;');
      console.log('%c╚════════════════════════════════════════╝', 'color: #10B981; font-size: 12px; font-weight: bold;');
      console.log('  Status:', response.status);
      console.log('  Response Data:', response.data);

      const submitData = response?.data || {};
      const uploadedFileUrl = submitData.file_path || submitData.file_url || submitData.url;
      if (uploadedFileUrl) {
        setFileUrl(uploadedFileUrl);
      }

      setSendSuccess("Izhaar submitted successfully!");
      toast.success("Success ❤️ Song sent beautifully");

      setTimeout(() => {
        navigate("/user/izhaar_tracker");
      }, 2000);
    } catch (err) {
      console.log('%c=== ERROR DURING SUBMISSION ===', 'color: #EF4444; font-size: 14px; font-weight: bold;');
      console.log('Error message:', err.message);
      console.log('Error code:', err.code);
      console.log('Error response status:', err.response?.status);
      console.log('Error response data:', err.response?.data);
      console.log('Full error object:', err);
      console.log('%c=== END ERROR ===', 'color: #EF4444; font-size: 14px; font-weight: bold;');

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
        background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)'
      }}>
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/user/song/list")}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 bg-white/10 border border-white/10 text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 overflow-y-auto">

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h6 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
            Your Song is Ready!
          </h6>
          <div className="w-20 sm:w-28 h-1 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
        </div>

        {/* Main Container */}
        <div className="w-full max-w-2xl flex flex-col items-stretch">

          {/* Music Card */}
          <div className="w-full flex flex-col items-center justify-center">
            {/* Album Art Card with Overlay */}
            <div className="relative group cursor-pointer w-full mb-4 sm:mb-6">
              <div
                className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-square border-2 border-white/10 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.3)]"
                style={{
                  backgroundImage: `url(${TEMPLATES.find(t => t.id === selectedTemplate)?.bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Light Overlay - Subtle top-to-bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Song Info Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 drop-shadow-md">Your Song</h3>
                  <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">Manual Service • {style} • {mood}</p>

                  {/* Progress Bar */}
                  <div className="mb-3 sm:mb-4">
                    <div
                      className="w-full bg-white/20 rounded-full h-1.5 sm:h-2 overflow-hidden cursor-pointer hover:h-2 sm:hover:h-2.5 transition-all backdrop-blur-sm"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-white/50 mt-1 sm:mt-2 font-medium">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
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
                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <button className="text-white/60 hover:text-white transition hover:scale-110">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z" />
                      </svg>
                    </button>
                    <button
                      onClick={handlePlayPause}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-110 transition-all border border-white/20"
                    >
                      {isPlaying ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <button className="text-white/60 hover:text-white transition hover:scale-110">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 18l2-3h2v12h-2v-9zm0-12l-8.5 6L16 12V6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="w-full">
            <button
              onClick={handleSendSong}
              disabled={sending}
              className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg text-white ${sending ? 'opacity-70 cursor-not-allowed bg-white/10' : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] hover:shadow-pink-500/20 active:scale-95'}`}
            >
              {sending ? 'Sending…' : 'Send Song'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {sendError && (
          <div className="mt-6 sm:mt-8 w-full max-w-2xl p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center backdrop-blur-sm">
            {sendError}
          </div>
        )}

        {/* Success Message */}
        {sendSuccess && (
          <div className="mt-6 sm:mt-8 w-full max-w-2xl p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-sm text-center backdrop-blur-sm">
            {sendSuccess}
            {fileUrl && (
              <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs text-green-300 font-mono text-left border border-white/5">
                <p className="font-semibold mb-2">File stored successfully</p>
                <p className="break-all bg-black/40 p-2 rounded text-xs text-white/50">{fileUrl}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

