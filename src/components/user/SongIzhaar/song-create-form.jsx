import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/config";
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

// Add new options for voice clarity and background music
const voiceClarities = [
  { label: "Crisp", value: "Crisp" },
  { label: "Studio Clean", value: "Studio Clean" },
  { label: "Soft", value: "Soft" },
  { label: "Natural", value: "Natural" },
];

const backgroundMusicOptions = [
  { label: "Lo-Fi", value: "Lo-Fi" },
  { label: "Orchestral", value: "Orchestral" },
  { label: "EDM", value: "EDM" },
  { label: "Acoustic", value: "Acoustic" },
  { label: "Piano", value: "Piano" },
  { label: "Cinematic", value: "Cinematic" },
  { label: "Trap", value: "Trap" },
  { label: "Soft Background", value: "Soft Background" },
];

export default function SongCreateForm() {
  const navigate = useNavigate();
  const { receiverDetails } = useReceiverForLetter();
  const [tab, setTab] = useState("Lyrics");
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState(null);
  const [mood, setMood] = useState(null);
  const [vocal, setVocal] = useState("Random");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState(180000); // Default 3 minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Add state for new fields
  const [voiceClarity, setVoiceClarity] = useState("Studio Clean");
  const [backgroundMusic, setBackgroundMusic] = useState("Soft Background");
  const [genre, setGenre] = useState("Pop");

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

    try {
      const sanitizedPrompt = `${lyrics}, ${language} ${vocal.toLowerCase()} vocals`;

      const response = await fetch(`${BASE_URL}/api/music`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: sanitizedPrompt,
          duration_ms: duration || 45000,
          genre: genre,
        
          mood: mood || "Neutral",
         
          voice_clarity: voiceClarity,
          background_music: backgroundMusic,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError("Song generation failed. Please try again.");
        setLoading(false);
        return;
      }

      const base64Url = `data:${result.mime};base64,${result.audio_base64}`;

      // Navigate to song preview screen with audio data
      navigate("/user/song/preview", {
        state: {
          audioUrl: base64Url,
          lyrics: lyrics,
          style: style || "Pop",
          mood: mood || "Neutral",
          vocal: vocal,
          language: language,
          duration: duration,
          genre: genre,
          voiceClarity: voiceClarity,
          backgroundMusic: backgroundMusic,
        },
      });
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
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-2xl backdrop-blur-lg border border-white/10"
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

          {/* Language Selection */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <span className="text-sm sm:text-base font-semibold text-white mb-4 block">🌍 Language</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.label}
                  className={`flex flex-col items-center px-2 sm:px-3 py-2 sm:py-3 rounded-lg border-2 transition-all duration-200 ${
                    language === lang.label
                      ? "border-green-400 bg-white/20 scale-105"
                      : "border-transparent bg-white/10 hover:border-green-400/50 hover:bg-white/15"
                  }`}
                  onClick={() => setLanguage(lang.label)}
                >
                  <span className="text-xl sm:text-2xl mb-1">{lang.icon}</span>
                  <span className="text-[11px] sm:text-xs font-medium text-white">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-8 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <span className="text-sm sm:text-base font-semibold text-white mb-4 block">⏱️ Song Duration</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 border-2 ${
                    duration === dur.value
                      ? "bg-purple-500 border-white/60 scale-105 ring-2 ring-white/40"
                      : "bg-purple-500/70 border-transparent opacity-70 hover:opacity-90"
                  }`}
                  onClick={() => setDuration(dur.value)}
                >
                  <span className="text-lg sm:text-xl">{dur.icon}</span>
                  <span className="text-white text-xs sm:text-sm">{dur.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Clarity Selection */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <span className="text-sm sm:text-base font-semibold text-white mb-4 block">🎙️ Voice Clarity</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {voiceClarities.map((clarity) => (
                <button
                  key={clarity.value}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 border-2 ${
                    voiceClarity === clarity.value
                      ? "bg-blue-500 border-white/60 scale-105 ring-2 ring-white/40"
                      : "bg-blue-500/70 border-transparent opacity-70 hover:opacity-90"
                  }`}
                  onClick={() => setVoiceClarity(clarity.value)}
                >
                  <span className="text-white text-xs sm:text-sm">{clarity.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Music Selection */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <span className="text-sm sm:text-base font-semibold text-white mb-4 block">🎶 Background Music</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {backgroundMusicOptions.map((music) => (
                <button
                  key={music.value}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 border-2 ${
                    backgroundMusic === music.value
                      ? "bg-green-500 border-white/60 scale-105 ring-2 ring-white/40"
                      : "bg-green-500/70 border-transparent opacity-70 hover:opacity-90"
                  }`}
                  onClick={() => setBackgroundMusic(music.value)}
                >
                  <span className="text-white text-xs sm:text-sm">{music.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Genre Selection */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-6 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <span className="text-sm sm:text-base font-semibold text-white mb-4 block">🎸 Genre</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {musicStyles.map((style) => (
                <button
                  key={style.label}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 border-2 ${
                    genre === style.label
                      ? "bg-purple-500 border-white/60 scale-105 ring-2 ring-white/40"
                      : "bg-purple-500/70 border-transparent opacity-70 hover:opacity-90"
                  }`}
                  onClick={() => setGenre(style.label)}
                >
                  <span className="text-white text-xs sm:text-sm">{style.label}</span>
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
        </div>
      </div>
    </div>
  );}