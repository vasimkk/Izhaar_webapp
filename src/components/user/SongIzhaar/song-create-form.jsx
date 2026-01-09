import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../config/config";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import { toast } from "react-toastify";
// import useUserId from "../../../hooks/useUserId";
const musicStyles = [
  { label: "Pop", icon: "🎧" },
  { label: "Rock", icon: "🎸" },
  { label: "Rap", icon: "🎤" },
  { label: "R&B", icon: "🎻" },
  { label: "Electronic", icon: "🎹" },
  { label: "Dance", icon: "💃" },
  { label: "Hip-Hop", icon: "🎷" },
  { label: "Jazz", icon: "🎺" },
  { label: "Country", icon: "🪕" },
  { label: "Folk", icon: "🪗" },
  { label: "Blues", icon: "🎼" },
];
const moods = [
  { label: "Love", icon: "🥰" },
  { label: "Sorry", icon: "😔" },
  { label: "Funny", icon: "😂" },
  { label: "Sad", icon: "😭" },
  { label: "Flirty", icon: "😏" },
];
const vocals = [
  { label: "Random", color: "bg-gray-600", icon: "🔀" },
  { label: "Male", color: "bg-blue-500", icon: "♂️" },
  { label: "Female", color: "bg-pink-500", icon: "♀️" },
];

export default function SongCreateForm() {
  const { receiverDetails } = useReceiverForLetter();
  const userId = useUserId ? useUserId() : null;
  const [tab, setTab] = useState("Lyrics");
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState(null);
  const [mood, setMood] = useState(null);
  const [vocal, setVocal] = useState("Random");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(null);

  useEffect(() => {
    console.log("Receiver Details:", receiverDetails);
  }, [receiverDetails]);

  const generateSong = async () => {
    if (!lyrics.trim()) {
      setError("Please enter lyrics or description");
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch(`${BASE_URL}/api/music`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: lyrics,
          voice_type: vocal,
          style: style || "Pop",
          mood: mood || "Love"
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError("Song generation failed. Please try again.");
        setLoading(false);
        return;
      }

      const base64Url = `data:${result.mime};base64,${result.audio_base64}`;
      setAudioUrl(base64Url);
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please check your connection and try again.");
    }

    setLoading(false);
  };

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

  const sendSong = async () => {
    if (!audioUrl) {
      setSendError("No audio to send. Please generate a song first.");
      return;
    }
    setSending(true);
    setSendError(null);
    setSendSuccess(null);

    try {
      const file = dataURLToFile(audioUrl, "izhaar-song.mp3");
      if (!file) {
        setSendError("Failed to prepare audio file for upload.");
        setSending(false);
        return;
      }
      const sender_id = (receiverDetails && receiverDetails.sender_id) || userId || "USER123";
      const izhaar_code = (receiverDetails && receiverDetails.izhaar_code) || `IZH-${Date.now()}`;
      const payloadReceiver = receiverDetails?.receiver || receiverDetails || {};
      const form = new FormData();
      form.append("izhaar_code", izhaar_code);
      form.append("sender_id", sender_id);
      form.append("type", "SONG");
      form.append("template_id", "");
      form.append("message", lyrics || "");
      form.append("receiver", JSON.stringify(payloadReceiver));
      form.append("file", file);

      const resp = await api.post("/izhaar/submit", form);
      const data = resp?.data || {};
      setSendSuccess(data?.message || "Izhaar submitted successfully!");

      // Payment mark-used flow similar to letter
      try {
        const paymentRes = await api.get("/razorpay/payment-status", {
          params: { userId: sender_id, service: "song" },
        });
        const payment = paymentRes?.data;
        if (payment && payment.payment_reference) {
          await api.post("/razorpay/mark-used", {
            userId: sender_id,
            paymentReference: payment.payment_reference,
          });
        }
      } catch (e) {
        // Non-blocking
        console.warn("Payment mark-used skipped:", e?.message);
      }

      toast.success("Success ❤️ Song sent beautifully");
    } catch (e) {
      setSendError(e.message);
      toast.error("Error: " + (e.message || "Failed"));
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h5 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            🎵 Create Your Song
          </h5>
          <p className="text-xs sm:text-sm md:text-base text-gray-300">
            Bring your emotions to life with AI-generated music
          </p>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-2xl">
           {/* Lyrics Input */}
          <textarea
            className="w-full h-28 sm:h-32 md:h-36 rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-2xl backdrop-blur-lg border border-white/10 outline-none text-white resize-none placeholder-gray-400 focus:border-white/40 focus:bg-white/15 transition-all"
            placeholder="Describe your feelings and emotions..."
            maxLength={3000}
            value={lyrics}
            onChange={e => setLyrics(e.target.value)}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}
          />
          <div className="text-right text-[10px] sm:text-xs text-gray-400 -mt-4 mb-6">{lyrics.length}/3000</div>

          {/* Style of the Music */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm sm:text-base font-semibold text-white">🎸 Music Style <span className="text-[10px] sm:text-xs text-gray-400">(Optional)</span></span>
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all">
                Random <span>🎲</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {musicStyles.map((s) => (
                <button
                  key={s.label}
                  className={`flex flex-col items-center px-2 sm:px-3 py-2 sm:py-3 rounded-lg border-2 transition-all duration-200 ${
                    style === s.label
                      ? "border-pink-400 bg-white/20 scale-105"
                      : "border-transparent bg-white/10 hover:border-pink-400/50 hover:bg-white/15"
                  }`}
                  onClick={() => setStyle(s.label)}
                >
                  <span className="text-xl sm:text-2xl mb-1">{s.icon}</span>
                  <span className="text-[11px] sm:text-xs font-medium text-white">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood of the Music */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm sm:text-base font-semibold text-white">🎭 Mood <span className="text-[10px] sm:text-xs text-gray-400">(Optional)</span></span>
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all">
                Random <span>🎲</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {moods.map((m) => (
                <button
                  key={m.label}
                  className={`flex flex-col items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all duration-200 ${
                    mood === m.label
                      ? "border-cyan-400 bg-white/20 scale-105"
                      : "border-transparent bg-white/10 hover:border-cyan-400/50 hover:bg-white/15"
                  }`}
                  onClick={() => setMood(m.label)}
                >
                  <span className="text-xl sm:text-2xl mb-1">{m.icon}</span>
                  <span className="text-[11px] sm:text-xs font-medium text-white">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vocals */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-8 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <span className="text-sm sm:text-base font-semibold text-white mb-4 block">🎤 Voice Type</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {vocals.map((v) => (
                <button
                  key={v.label}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 border-2 ${
                    vocal === v.label
                      ? `${v.color} border-white/60 scale-105 ring-2 ring-white/40`
                      : `${v.color} border-transparent opacity-70 hover:opacity-90`
                  }`}
                  onClick={() => setVocal(v.label)}
                >
                  <span className="text-lg sm:text-xl">{v.icon}</span>
                  <span className="text-white text-xs sm:text-sm">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Create Song Button */}
          <button 
            onClick={generateSong}
            disabled={loading}
            className={`w-full rounded-xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 font-semibold text-sm sm:text-base md:text-lg transition-all shadow-lg text-white ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 active:scale-95"
            }`}
            style={{
              background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
            }}>
            {loading ? "🎵 Generating..." : "✨ Create Song"}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success Message with Audio Player */}
          {audioUrl && (
            <div className="mt-8 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-lg border border-green-400/50"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 50, 30, 0.7) 0%, rgba(0, 30, 20, 0.5) 100%)'
              }}>
              <div className="text-center mb-4">
                <p className="text-lg sm:text-xl font-semibold text-green-300 mb-2">🎉 Your Song is Ready!</p>
                <p className="text-sm text-gray-300">Your personalized song has been generated successfully!</p>
              </div>
              <audio 
                controls 
                className="w-full rounded-lg"
                style={{
                  colorScheme: 'dark'
                }}>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <div className="flex gap-3 mt-4">
                <a 
                  href={audioUrl} 
                  download="song.mp3"
                  className="flex-1 text-center py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold text-sm transition-all border border-green-400/50"
                >
                  📥 Download
                </a>
                <button 
                  onClick={sendSong}
                  disabled={sending}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all border ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'} bg-blue-500/20 text-blue-300 border-blue-400/50`}
                >
                  ✉️ {sending ? 'Sending…' : 'Send'}
                </button>
              </div>
              {sendError && (
                <div className="mt-3 p-3 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300 text-xs text-center">
                  {sendError}
                </div>
              )}
              {sendSuccess && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs text-center">
                  {sendSuccess}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );}