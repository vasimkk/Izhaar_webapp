import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.jpeg';
import bg4 from '../../../assets/temp/letter_04.jpeg';

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
  
  const { audioUrl, lyrics, style, mood, vocal } = location.state || {};
  
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!audioUrl) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">No song data found. Please generate a song first.</p>
          <button 
            onClick={() => navigate("/user/song/create")}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Go Back to Create
          </button>
        </div>
      </div>
    );
  }

  const dataURLToFile = (dataUrl, filename) => {
    try {
      const [meta, base64] = dataUrl.split(",");
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

      const file = dataURLToFile(audioUrl, "izhaar-song.mp3");
      if (!file) {
        setSendError("Failed to prepare audio file for upload.");
        return;
      }

      const sender_id = receiverDetails?.sender_id || "USER123";
      const izhaar_code = receiverDetails?.izhaar_code || `IZH-${Date.now()}`;
      const receiver = receiverDetails?.receiver || receiverDetails || {};
      
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
      
      // Capture the file path/URL from backend response
      const submitData = response?.data || {};
      console.log("Backend response:", submitData);
      const uploadedFileUrl = submitData.file_path || submitData.file_url || submitData.path || submitData.url;
      if (uploadedFileUrl) {
        setFileUrl(uploadedFileUrl);
        console.log("File Path stored in DB:", uploadedFileUrl);
      } else {
        console.warn("No file path in response. Full response:", submitData);
      }

      // After successful song submission, get latest payment and mark as USED
      try {
        const paymentRes = await api.get("/razorpay/payment-status", {
          params: { userId: sender_id, service: "song" }
        });
        const payment = paymentRes.data;
        if (payment && payment.payment_reference) {
          await api.post("/razorpay/mark-used", {
            userId: sender_id,
            paymentReference: payment.payment_reference
          });
          console.log("Payment marked as USED");
        } else {
          console.warn("No valid payment found to mark as USED");
        }
      } catch (err) {
        console.error("Failed to mark payment as USED", err);
      }

      setSendSuccess("Izhaar submitted successfully!");
      toast.success("Success ❤️ Song sent beautifully");
      
      // Navigate to dashboard after success
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
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10 overflow-y-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h6 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2 drop-shadow-lg">
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
                  className="rounded-3xl shadow-2xl overflow-hidden aspect-square border-4 border-white/20 hover:border-[#E91E63]/50 transition-all"
                  style={{
                    backgroundImage: `url(${TEMPLATES.find(t => t.id === selectedTemplate)?.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Dark Overlay - Top to Bottom Gradient */}
                  <div className="absolute inset-0 " />
                  
                  {/* Song Info Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">✨ Your Song</h3>
                    <p className="text-gray-200 text-sm mb-4">AI Generated • {style} • {mood}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div 
                        className="w-full bg-white/20 rounded-full h-2 overflow-hidden cursor-pointer hover:h-2.5 transition-all"
                        onClick={handleProgressClick}
                      >
                        <div 
                          className="bg-gradient-to-r from-[#E91E63] to-[#9C27B0] h-full rounded-full transition-all" 
                          style={{width: `${duration ? (currentTime / duration) * 100 : 0}%`}}
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
                          <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={handlePlayPause}
                        className="w-14 h-14 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-2xl hover:scale-110 transition-all"
                      >
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>
                      <button className="text-gray-300 hover:text-white transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 18l2-3h2v12h-2v-9zm0-12l-8.5 6L16 12V6z"/>
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
            <div className="bg-white/95 rounded-2xl p-6 shadow-2xl border-2 border-[#E91E63]/20 backdrop-blur-md">
              <h4 className="text-lg md:text-xl font-bold mb-4 text-center italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
                Pick a Style 🎨
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative h-40 rounded-2xl border-4 transition-all overflow-hidden group cursor-pointer ${
                      selectedTemplate === template.id
                        ? 'border-[#E91E63] shadow-2xl scale-105'
                        : 'border-[#9C27B0]/30 hover:border-[#9C27B0]/60'
                    }`}
                  >
                    {/* Background Image */}
                    <img
                      src={template.bg}
                      alt={template.title}
                      className="w-full h-full object-cover"
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
                      <div className="absolute top-2 right-2 w-8 h-8 bg-[#E91E63] rounded-full flex items-center justify-center text-white font-bold">
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
                onClick={handleDownload}
                className="w-full py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-black font-semibold text-sm transition-all border border-green-400/50"
              >
                📥 Download
              </button>
              <button 
                onClick={handleSendSong}
                disabled={sending}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all border bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105 active:scale-95'}`}
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
