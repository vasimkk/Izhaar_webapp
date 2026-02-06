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
        background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)'
      }}>

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h5 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-3 drop-shadow-sm">
            Customize Your Song
          </h5>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mb-4 shadow-[0_0_15px_rgba(236,72,153,0.6)]" />
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-medium leading-relaxed">
            Tell us your story and we'll craft a personalised song just for you.
          </p>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-xl sm:max-w-2xl space-y-5">
          {/* Story Input */}
          <div className="relative group">
            <textarea
              className="w-full h-32 sm:h-36 rounded-2xl p-5 mb-2 shadow-xl border border-white/10 outline-none text-white resize-none placeholder-white/30 focus:border-pink-500/50 focus:bg-white/10 transition-all font-medium text-base bg-white/5 backdrop-blur-md"
              placeholder="Describe your story, feelings, and the message you want to convey..."
              maxLength={3000}
              value={story}
              onChange={e => setStory(e.target.value)}
            />
            <div className={`absolute bottom-6 right-5 text-xs font-semibold ${story.length > 2500 ? 'text-pink-400' : 'text-white/40'}`}>
              {story.length}/3000
            </div>
          </div>

          {/* Style of the Music */}
          <div className="rounded-2xl p-5 shadow-lg border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:border-pink-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-pink-400">🎵</span> Music Style
              </span>
              <button
                onClick={() => setStyle("Pop")}
                className="bg-white/10 hover:bg-white/20 text-white/80 rounded-lg px-3 py-1 text-xs font-semibold transition-all border border-white/5"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {musicStyles.map((s) => (
                <button
                  key={s.label}
                  className={`flex items-center justify-center px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium transform ${style === s.label
                    ? "bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                    : "border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white hover:scale-105"
                    }`}
                  onClick={() => setStyle(s.label)}
                >
                  <span className="mr-1 opacity-70">{s.icon}</span> <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood of the Music */}
          <div className="rounded-2xl p-5 shadow-lg border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">✨</span> Mood
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {moods.map((m) => (
                <button
                  key={m.label}
                  className={`flex items-center justify-center px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium transform ${mood === m.label
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    : "border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white hover:scale-105"
                    }`}
                  onClick={() => setMood(m.label)}
                >
                  <span className="mr-1 opacity-70">{m.icon}</span> <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vocals */}
          <div className="rounded-2xl p-5 shadow-lg border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:border-blue-500/30">
            <span className="text-base font-bold text-white mb-4 block flex items-center gap-2">
              <span className="text-blue-400">🎤</span> Voice Type
            </span>
            <div className="grid grid-cols-3 gap-3">
              {vocals.map((v) => (
                <button
                  key={v.label}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-bold transform ${vocal === v.label
                    ? `bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] ring-1 ring-white/50`
                    : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105"
                    }`}
                  onClick={() => setVocal(v.label)}
                >
                  <span className="mr-2 text-base">{v.icon}</span> <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="rounded-2xl p-5 shadow-lg border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:border-green-500/30">
            <span className="text-base font-bold text-white mb-1 block flex items-center gap-2">
              <span className="text-green-400">🗣️</span> Language
            </span>
            <div className="text-xs text-gray-400 mb-4 pl-7">Supported: English, Hindi, Telugu, Marathi, Urdu, MK</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.label}
                  className={`flex items-center justify-center px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium transform ${language === lang.label
                    ? "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white hover:scale-105"
                    }`}
                  onClick={() => setLanguage(lang.label)}
                >
                  <span className="mr-1 opacity-70">{lang.icon}</span> <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="rounded-2xl p-5 shadow-lg border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:border-yellow-500/30 mb-6">
            <span className="text-base font-bold text-white mb-4 block flex items-center gap-2">
              <span className="text-yellow-400">⏱️</span> Duration
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  className={`flex items-center justify-center px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium transform ${duration === dur.value
                    ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    : "border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white hover:scale-105"
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
            className={`w-full rounded-2xl px-6 py-4 font-bold text-lg text-white transition-all shadow-lg transform ${loading ? "opacity-70 cursor-not-allowed bg-white/10" : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:scale-[1.02] hover:shadow-pink-500/40 active:scale-95 shimmer-effect"}`}
            style={!loading ? {
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)'
            } : {}}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Composing...</span>
              </div>
            ) : (
              "Send Request"
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}