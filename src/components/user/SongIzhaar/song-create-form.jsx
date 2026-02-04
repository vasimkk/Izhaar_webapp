import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import { toast } from "react-toastify";

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

const languages = [
  { label: "English", icon: "🇬🇧" },
  { label: "Hindi", icon: "🇮🇳" },
  { label: "Telugu", icon: "🗣️" },
  { label: "Marathi", icon: "🗯️" },
  { label: "Urdu", icon: "🕌" },
  { label: "MK", icon: "🌍" },
];

const durations = [
  { label: "2 min", value: 120000, icon: "⏱️" },
  { label: "3 min", value: 180000, icon: "⏱️" },
  { label: "4 min", value: 240000, icon: "⏱️" },
];




export default function SongCreateForm() {
  const navigate = useNavigate();
  const { receiverDetails } = useReceiverForLetter();
  const [story, setStory] = useState("");
  const [style, setStyle] = useState(null);
  const [mood, setMood] = useState(null);
  const [vocal, setVocal] = useState("Random");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState(180000); // Default 3 minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voiceClarity, setVoiceClarity] = useState("Studio Clean");
  const [backgroundMusic, setBackgroundMusic] = useState("Soft Background");
  const [genre, setGenre] = useState("Pop");

  useEffect(() => {
    console.log("Receiver Details:", receiverDetails);
  }, [receiverDetails]);

  // Check for pending requests on mount
  // Check for pending requests commented out to allow manual navigation via "My Song List"
  // useEffect(() => {
  //   const checkPending = async () => { ... }
  // }, [navigate]);

  const submitRequest = async () => {
    if (!story.trim()) {
      setError("Please describe your story or feelings");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        story,
        mood: mood || "Neutral",
        language,
        style: style || genre || "Pop", // Fallback to genre if style not picked
        duration,
        voice_type: vocal,
        voice_clarity: voiceClarity,
        genre,
        background_music: backgroundMusic,
        receiver: receiverDetails
      };

      const response = await api.post("/music/request", payload);

      if (response.data.success) {
        toast.success("Song Request Sent! 🎵 Admin will create it for you.");
        // Navigate to song preview (which will show pending state)
        navigate("/user/song/preview", {
          state: {
            requestId: response.data.requestId,
            story,
            mood: mood || "Neutral",
            language,
            style: style || genre || "Pop",
            status: "PENDING"
          }
        });
      } else {
        setError(response.data.message || "Failed to submit request");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
        animation: 'gradientShift 15s ease infinite'
      }}>
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="text-center mb-6">
          <h5 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Customize Your Song
          </h5>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-purple-400 mb-3" />
          <p className="text-xs sm:text-sm md:text-sm text-gray-600 max-w-xl mx-auto">
            Tell us your story and we'll craft a personalised song just for you.
          </p>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-xl sm:max-w-2xl">
          {/* Story Input */}
          <textarea
            className="w-full h-24 sm:h-28 md:h-32 rounded-xl p-4 sm:p-5 md:p-6 mb-4 shadow-lg border border-black/10 outline-none text-gray-900 resize-none placeholder-gray-400 focus:border-purple-400 focus:bg-white transition-all font-medium text-base"
            placeholder="Describe your story, feelings, and the message you want to convey..."
            maxLength={3000}
            value={story}
            onChange={e => setStory(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.9)'
            }}
          />
          <div className="text-right text-[10px] sm:text-xs text-gray-500 -mt-3 mb-4">{story.length}/3000</div>

          {/* Style of the Music */}
          <div className="rounded-lg p-3 sm:p-4 mb-3 shadow-md border border-white/30 bg-gradient-to-br from-white/90 to-white/70 hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm sm:text-sm font-semibold text-gray-800">Music Style</span>
              <button className="bg-yellow-300 hover:bg-yellow-200 text-black rounded-md px-2 py-1 text-[11px] font-semibold transition-all">
                Random
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2">
              {musicStyles.map((s) => (
                <button
                  key={s.label}
                  className={`flex items-center justify-center px-3 py-2 rounded-md border transition-all duration-150 text-sm transform ${style === s.label
                    ? "bg-gradient-to-r from-pink-50 to-pink-100 ring-2 ring-offset-1 ring-pink-200 text-pink-700"
                    : "border-transparent bg-white/40 hover:bg-white/60 text-gray-700 hover:scale-105"
                    }`}
                  onClick={() => setStyle(s.label)}
                >
                  <span className="font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood of the Music */}
          <div className="rounded-lg p-3 sm:p-4 mb-3 shadow-md border border-white/30 bg-gradient-to-br from-white/90 to-white/70 hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm sm:text-sm font-semibold text-gray-800">Mood</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2">
              {moods.map((m) => (
                <button
                  key={m.label}
                  className={`flex items-center justify-center px-3 py-2 rounded-md border transition-all duration-150 text-sm transform ${mood === m.label
                    ? "bg-gradient-to-r from-cyan-50 to-cyan-100 ring-2 ring-offset-1 ring-cyan-200 text-cyan-700"
                    : "border-transparent bg-white/40 hover:bg-white/60 text-gray-700 hover:scale-105"
                    }`}
                  onClick={() => setMood(m.label)}
                >
                  <span className="font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vocals */}
          <div className="rounded-lg p-3 sm:p-4 mb-3 shadow-md border border-white/30 bg-gradient-to-br from-white/90 to-white/70 hover:scale-[1.01] transition-transform">
            <span className="text-sm sm:text-sm font-semibold text-gray-800 mb-3 block">Voice Type</span>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-2 md:gap-3">
              {vocals.map((v) => (
                <button
                  key={v.label}
                  className={`flex items-center justify-center px-3 py-2 rounded-md border transition-all duration-150 text-sm font-medium transform ${vocal === v.label
                    ? `bg-gradient-to-r from-white to-white/95 ring-2 ring-offset-1 ${v.color.replace('bg-', 'ring-')}`
                    : "bg-white/40 border-transparent text-gray-600 hover:bg-white/60 hover:scale-105"
                    }`}
                  onClick={() => setVocal(v.label)}
                >
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="rounded-lg p-3 sm:p-4 mb-3 shadow-md border border-white/30 bg-gradient-to-br from-white/90 to-white/70 hover:scale-[1.01] transition-transform">
            <span className="text-sm sm:text-sm font-semibold text-gray-800 mb-1 block">Language</span>
            <div className="text-xs text-gray-500 mb-2">Supported: English, Hindi, Telugu, Marathi, Urdu, MK</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.label}
                  className={`flex items-center justify-center px-3 py-2 rounded-md border transition-all duration-150 text-sm transform ${language === lang.label
                    ? "bg-gradient-to-r from-green-50 to-green-100 ring-2 ring-offset-1 ring-green-200 text-green-700"
                    : "border-transparent bg-white/40 hover:bg-white/60 text-gray-700 hover:scale-105"
                    }`}
                  onClick={() => setLanguage(lang.label)}
                >
                  <span className="font-medium">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="rounded-lg p-3 sm:p-4 mb-4 shadow-md border border-white/30 bg-gradient-to-br from-white/90 to-white/70 hover:scale-[1.01] transition-transform">
            <span className="text-sm sm:text-sm font-semibold text-gray-800 mb-2 block">Duration</span>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  className={`flex items-center justify-center px-3 py-2 rounded-md border transition-all duration-150 text-sm font-medium transform ${duration === dur.value
                    ? "bg-gradient-to-r from-purple-50 to-purple-100 ring-2 ring-offset-1 ring-purple-200 text-purple-700"
                    : "bg-white/40 border-transparent text-gray-600 hover:bg-white/60 hover:scale-105"
                    }`}
                  onClick={() => setDuration(dur.value)}
                >
                  <span>{dur.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={submitRequest}
            disabled={loading}
            className={`w-full rounded-lg px-4 py-3 font-semibold text-base text-white transition-all shadow-lg transform ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:scale-95" }`}
            style={{
              background: 'linear-gradient(90deg, #FF6A6A 0%, #FF4D99 50%, #C84BFF 100%)',
              boxShadow: '0 12px 30px -12px rgba(200,75,255,0.35)'
            }}>
            {loading ? "Sending..." : "Send Request"}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500 text-white text-sm text-center shadow-lg animate-pulse">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}