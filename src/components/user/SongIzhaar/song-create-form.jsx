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
        <div className="text-center mb-8">
          <h5 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2 drop-shadow-lg">
            🎵 Request Your Song
          </h5>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            Tell us your story, and we'll create a masterpiece just for you.
          </p>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-2xl">
          {/* Story Input */}
          <textarea
            className="w-full h-28 sm:h-32 md:h-36 rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-xl backdrop-blur-lg border border-black/10 outline-none text-white resize-none placeholder-gray-300 focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-lg"
            placeholder="Describe your story, feelings, and the message you want to convey..."
            maxLength={3000}
            value={story}
            onChange={e => setStory(e.target.value)}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}
          />
          <div className="text-right text-[10px] sm:text-xs text-gray-500 -mt-4 mb-6">{story.length}/3000</div>

          {/* Style of the Music */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-xl backdrop-blur-lg border border-white/40 bg-white/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm sm:text-base font-bold text-gray-800">🎸 Music Style</span>
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all">
                Random <span>🎲</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {musicStyles.map((s) => (
                <button
                  key={s.label}
                  className={`flex flex-col items-center px-2 sm:px-3 py-2 sm:py-3 rounded-xl border-2 transition-all duration-200 ${style === s.label
                    ? "border-pink-500 bg-pink-50 text-pink-600 scale-105 shadow-md"
                    : "border-transparent bg-white/40 hover:bg-white/60 text-gray-700"
                    }`}
                  onClick={() => setStyle(s.label)}
                >
                  <span className="text-xl sm:text-2xl mb-1">{s.icon}</span>
                  <span className="text-[11px] sm:text-xs font-bold">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood of the Music */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-xl backdrop-blur-lg border border-white/40 bg-white/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm sm:text-base font-bold text-gray-800">🎭 Mood</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {moods.map((m) => (
                <button
                  key={m.label}
                  className={`flex flex-col items-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all duration-200 ${mood === m.label
                    ? "border-cyan-500 bg-cyan-50 text-cyan-600 scale-105 shadow-md"
                    : "border-transparent bg-white/40 hover:bg-white/60 text-gray-700"
                    }`}
                  onClick={() => setMood(m.label)}
                >
                  <span className="text-xl sm:text-2xl mb-1">{m.icon}</span>
                  <span className="text-[11px] sm:text-xs font-bold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vocals */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-xl backdrop-blur-lg border border-white/40 bg-white/30">
            <span className="text-sm sm:text-base font-bold text-gray-800 mb-4 block">🎤 Voice Type</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {vocals.map((v) => (
                <button
                  key={v.label}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 border-2 ${vocal === v.label
                    ? `${v.color.replace('bg-', 'text-')} border-${v.color.replace('bg-', '')} bg-white shadow-md scale-105`
                    : "bg-white/40 border-transparent text-gray-600 hover:bg-white/60"
                    }`}
                  onClick={() => setVocal(v.label)}
                >
                  <span className="text-lg sm:text-xl">{v.icon}</span>
                  <span className="text-xs sm:text-sm">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-xl backdrop-blur-lg border border-white/40 bg-white/30">
            <span className="text-sm sm:text-base font-bold text-gray-800 mb-4 block">🌍 Language</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.label}
                  className={`flex flex-col items-center px-2 sm:px-3 py-2 sm:py-3 rounded-xl border-2 transition-all duration-200 ${language === lang.label
                    ? "border-green-500 bg-green-50 text-green-700 scale-105 shadow-md"
                    : "border-transparent bg-white/40 hover:bg-white/60 text-gray-700"
                    }`}
                  onClick={() => setLanguage(lang.label)}
                >
                  <span className="text-xl sm:text-2xl mb-1">{lang.icon}</span>
                  <span className="text-[11px] sm:text-xs font-bold">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-8 shadow-xl backdrop-blur-lg border border-white/40 bg-white/30">
            <span className="text-sm sm:text-base font-bold text-gray-800 mb-4 block">⏱️ Song Duration</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 border-2 ${duration === dur.value
                    ? "border-purple-500 bg-purple-50 text-purple-700 scale-105 shadow-md"
                    : "bg-white/40 border-transparent text-gray-600 hover:bg-white/60"
                    }`}
                  onClick={() => setDuration(dur.value)}
                >
                  <span className="text-lg sm:text-xl">{dur.icon}</span>
                  <span className="text-xs sm:text-sm">{dur.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={submitRequest}
            disabled={loading}
            className={`w-full rounded-2xl px-4 sm:px-5 md:px-6 py-4 sm:py-5 font-bold text-lg sm:text-xl transition-all shadow-xl text-white transform hover:-translate-y-1 ${loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-2xl active:translate-y-0 active:scale-95"
              }`}
            style={{
              background: 'linear-gradient(90deg, #FF512F 0%, #DD2476 100%)',
              boxShadow: '0 10px 25px -5px rgba(221, 36, 118, 0.5)'
            }}>
            {loading ? "🚀 Sending Request..." : "✨ Submit Song Request"}
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