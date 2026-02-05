import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";


const HomePage = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const isAudioOnRef = useRef(false);

  const videoRef = useRef(null);

  // ✅ Updated Video URL (Bright/Motion Studio)
  // ✅ Updated Video URL (Bright/Motion Studio)
  const VIDEO_URL = "https://res.cloudinary.com/df5jbm55b/video/upload/v1770285527/webfinal_koopqr.mp4";
  // 🎵 Romantic Background Music (Piano)
  const AUDIO_URL = "https://assets.mixkit.co/music/preview/mixkit-romantic-piano-235.mp3";

  // RAF smoothing refs
  const rafRef = useRef(null);
  const targetTimeRef = useRef(0);
  const lastSeekRef = useRef(0);
  const lastNormalizedRef = useRef(null);
  const scrollDirRef = useRef(0);
  const prevScrollYRef = useRef(0);
  const lastDirRef = useRef(0);
  const scrollProgressRef = useRef(0);

  const steps = useMemo(
    () => [
      {
        id: "step1",
        title: "Rahul’s Hidden Heart",
        desc: "Rahul liked Anjali for months, but every time he tried to speak, fear and overthinking held him back. His feelings remained quietly in his heart, waiting for a moment to be heard.",
        style: "intro"
      },
      {
        id: "step2",
        title: "Discovering Izhaar",
        desc: "One late night, while scrolling on his phone, Rahul discovered Izhaar. It offered a safe and thoughtful way to express his feelings without revealing his identity",
        style: "focus"
      },
      {
        id: "step3",
        title: "Pouring His Heart Out",
        desc: (
          <>
            After signing up on Izhaar, Rahul shared his emotions through the{" "}
            <strong>AI-powered emotional assistance </strong>, which helped him shape his thoughts into respectful and heartfelt words.
            <br /><br />
            <strong>Confession Specialists </strong>then reached out to Anjali to let her know that someone had expressed interest, while keeping Rahul’s <strong>Identity private.</strong> Every message was fully <strong>Encrypted</strong> and kept entirely <strong>Secure.</strong>
          </>
        ),
        style: "intro"
      },
      {
        id: "step4",
        title: "Anjali Feels the Magic",
        desc: (
          <>
            Anjali read Rahul’s message at her own pace, taking in its warmth and sincerity. His honesty brought a gentle smile to her face.
            <br />
            <br />
            Wanting to know who had sent it, she clicked <strong>"Curious to Know"</strong>, and their conversation began, giving Rahul a chance to introduce himself with confidence and clarity.
          </>
        ),
        style: "focus"
      },
      {
        id: "step5",
        title: "A Beautiful Beginning",
        desc: (
          <>
            When the interest became mutual, Rahul chose to<strong> Reveal himself</strong>. Rahul and Anjali felt a genuine spark and a meaningful connection.
            <br />
            <br />
            Through the <strong>Izhaar Safe Date</strong> service, they met in a secure and well-arranged date. It marked the beginning of a new chapter built on honesty, courage, and the trusted guidance of Izhaar, leading to a lasting bond.
          </>
        ),
        style: "intro"
      },
    ],
    []
  );

  const audioRef = useRef(null);

  // Toggle Audio independently
  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newState = !isAudioOn;
    setIsAudioOn(newState);
    isAudioOnRef.current = newState;

    if (newState) {
      audio.play().catch(e => console.log("Audio play failed", e));
    } else {
      audio.pause();
    }
  };

  const unlockVideo = async () => {
    // Basic unlock if needed for iOS interactions, though audio now separate
    setUnlocked(true);
  };

  useEffect(() => {
    const rafLoop = () => {
      const video = videoRef.current;
      // ALWAYS Scrub video (Visual Magic) regardless of audio state
      if (video && !isNaN(video.duration)) {
        const target = targetTimeRef.current || 0;
        const current = video.currentTime || 0;
        const delta = target - current;
        const now = performance.now();
        const timeSinceLastSeek = now - (lastSeekRef.current || 0);
        const canSeek = video.readyState >= 3;
        const duration = video.duration || 0;
        const normalized = duration ? Math.max(0.001, Math.min(0.999, target / duration)) : 0;
        const lastNormalized = lastNormalizedRef.current;
        const normalizedDelta = lastNormalized != null ? Math.abs(normalized - lastNormalized) : Infinity;
        const dir = scrollDirRef.current || 0;
        const dirChanged = lastDirRef.current !== 0 && dir !== lastDirRef.current;
        const seekFactor = dirChanged ? 0.6 : 0.25;
        const minDelta = dirChanged ? 0.01 : 0.06;

        if (canSeek && (Math.abs(delta) > minDelta || timeSinceLastSeek > 120) && normalizedDelta > 0.001) {
          let next = current + delta * seekFactor;
          next = Math.max(0.001, Math.min(duration - 0.001, next));
          try {
            video.currentTime = next;
            lastSeekRef.current = now;
            lastNormalizedRef.current = normalized;
            lastDirRef.current = dir || lastDirRef.current;
          } catch (e) { }
        }

        // Cinematic transforms related to scroll progress
        const p = scrollProgressRef.current;
        // Scale down slightly as we scroll
        const scale = 1.1 - p * 0.1;
        video.style.transform = `translateZ(0) scale(${scale})`;
        video.style.opacity = `1`;

        // 🎵 MUSIC PLAYBACK (Independent of Scroll)
        // We removed the frame-sync logic because background music should not "scrub" or stutter.
        // It simply loops when "Sound On" is active.
      }
      rafRef.current = requestAnimationFrame(rafLoop);
    };

    const handleScroll = () => {
      const section = document.getElementById("content-wrapper");
      if (!section) return;

      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;

      const deltaScroll = scrollY - prevScrollYRef.current;

      // Smart Header Logic
      if (deltaScroll > 5 && scrollY > 100) {
        setShowHeader(false); // Hide on scroll down
      } else if (deltaScroll < -2 || scrollY <= 100) {
        setShowHeader(true); // Show on scroll up or at top
      }

      if (deltaScroll !== 0) scrollDirRef.current = deltaScroll > 0 ? 1 : -1;
      prevScrollYRef.current = scrollY;

      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - viewportHeight);
      scrollProgressRef.current = Math.max(0, Math.min(1, scrollY / maxScroll));

      // Map scroll to video time - focus on the "Story" part
      const stepsStart = document.getElementById("steps-start");
      const stepsEnd = document.getElementById("steps-end");

      if (stepsStart && stepsEnd) {
        const startY = stepsStart.offsetTop - viewportHeight * 0.5;
        const endY = stepsEnd.offsetTop + stepsEnd.offsetHeight - viewportHeight * 0.5;
        const totalHeight = Math.max(1, endY - startY);
        let progress = (scrollY - startY) / totalHeight;
        progress = Math.max(0, Math.min(1, progress));

        const video = videoRef.current;
        if (video && video.duration) {
          targetTimeRef.current = video.duration * progress;
        }
      }

      // Active step detection
      const centerLine = scrollY + viewportHeight / 2;
      let foundStep = -1;
      for (let i = 0; i < steps.length; i++) {
        const el = document.getElementById(steps[i].id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (centerLine >= offsetTop && centerLine < offsetTop + offsetHeight) {
            foundStep = i;
            break;
          }
        }
      }
      if (foundStep !== -1) setActiveStep(foundStep);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(rafLoop);

    const videoEl = videoRef.current;
    const onLoaded = () => {
      try {
        videoEl.preload = "auto";
        if (!isAudioOnRef.current) {
          videoEl.muted = true;
          videoEl.pause();
          if (!videoEl.currentTime) videoEl.currentTime = 0.01;
        }
        videoEl.playsInline = true;
      } catch (e) { }
    };

    if (videoEl) {
      videoEl.addEventListener("loadedmetadata", onLoaded);
      videoEl.addEventListener("canplaythrough", onLoaded);
    }

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (videoEl) {
        videoEl.removeEventListener("loadedmetadata", onLoaded);
        videoEl.removeEventListener("canplaythrough", onLoaded);
      }
    };
  }, [steps]);

  // Adjust height for mobile
  useEffect(() => {
    const setVh = () => {
      const vh = (window.visualViewport?.height || window.innerHeight) * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div className="relative bg-black text-white overflow-x-hidden font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }
        .font-vibes { font-family: 'Great Vibes', cursive; } /* Keep nuances if needed */
      `}</style>

      {/* BACKGROUND VIDEO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          className="w-full h-full object-cover will-change-transform"
          muted
          playsInline
          preload="auto"
          style={{ willChange: 'transform, filter, opacity', transform: 'translateZ(0)' }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        {/* Hidden Audio Track for "Sound On" mode */}
        <audio ref={audioRef} src={AUDIO_URL} loop preload="auto" />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* SOUND TOGGLE */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          {isAudioOn ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>
      </div>

      {/* HEADER - Minimalist Smart Glass Style */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between text-white transition-transform duration-500 ease-in-out  backdrop-blur-xl border-b border-white/5 shadow-lg ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>

        {/* LEFT: Navigation Links */}
        <div className="flex items-center gap-8 md:gap-12">
          {/* Logo / Brand Name as First Item */}
          <a
            href="#hero"
            className="border-b-2 border-transparent pb-1.5"
          >
            <img src={Logo} alt="Izhaar" className="h-8 md:h-10 w-auto" />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-xs font-bold tracking-[0.2em] uppercase text-[#BD248F] transition-colors border-b-2 border-[#BD248F] pb-1.5">
              Home
            </a>
            <a href="#journey" className="text-xs font-bold tracking-[0.2em] uppercase text-white/80 hover:text-[#BD248F] transition-colors border-b-2 border-transparent hover:border-[#BD248F] pb-1.5">
              How It Works
            </a>
            <a href="/about-us" className="text-xs font-bold tracking-[0.2em] uppercase text-white/80 hover:text-[#BD248F] transition-colors border-b-2 border-transparent hover:border-[#BD248F] pb-1.5">
              About Us
            </a>
            <a href="#faq" className="text-xs font-bold tracking-[0.2em] uppercase text-white/80 hover:text-[#BD248F] transition-colors border-b-2 border-transparent hover:border-[#BD248F] pb-1.5">
              FSQ
            </a>
          </nav>
        </div>

        {/* RIGHT: CTA & Mobile Menu */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="hidden md:block text-[10px] font-bold tracking-[0.2em] uppercase text-white hover:text-pink-400 transition-colors border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black hover:border-transparent"
          >
            Get Started
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Full Screen Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <a href="#hero" onClick={() => setMenuOpen(false)} className="text-2xl font-light tracking-[0.1em] text-white hover:text-pink-400 transition-colors">Home</a>
          <a href="#journey" onClick={() => setMenuOpen(false)} className="text-2xl font-light tracking-[0.1em] text-white hover:text-pink-400 transition-colors">Story</a>
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-2xl font-light tracking-[0.1em] text-white hover:text-pink-400 transition-colors">Features</a>
          <button onClick={() => { navigate('/user/dashboard'); setMenuOpen(false); }} className="px-8 py-3 border border-white/30 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all">
            Get Started
          </button>
        </div>
      </header>

      {/* CONTENT WRAPPER */}
      <div id="content-wrapper" className="relative z-10 flex flex-col pt-20">

        {/* HERO SECTION */}
        <section
          id="hero"
          className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative"
          data-hero="true"
        >
          {/* Glass Card */}
          <div
            className="
      text-center w-full max-w-xl md:max-w-2xl mx-auto
      bg-black/25 backdrop-blur-lg
      rounded-3xl
      p-6 sm:p-8
      border border-white/20
      shadow-2xl
      transition-all duration-700 ease-out
      hover:scale-[1.01]
    "
          >
            <div className="space-y-5 md:space-y-6 text-center animate-hero-enter">

              {/* Heading */}
              <h1
                className="
          text-3xl sm:text-4xl md:text-5xl
          font-extrabold
          text-white
          tracking-tight
          leading-tight
          drop-shadow-lg
        "
              >
                Got a Crush? <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 block sm:inline mt-2 sm:mt-0">
                  Too Scared to Say It?
                </span>
              </h1>

              {/* Sub heading */}
              <h3 className="text-base sm:text-lg font-semibold text-white/90 drop-shadow max-w-lg mx-auto">
                We’ve Got You 💗
              </h3>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="
            group relative
            px-6 py-2.5 sm:px-8 sm:py-3
            text-sm sm:text-base
            font-bold
            text-white
            rounded-full
            bg-gradient-to-r from-pink-500 to-purple-600
            shadow-[0_10px_25px_rgba(236,72,153,0.4)]
            transition-all duration-300
            hover:scale-105
            hover:shadow-[0_20px_40px_rgba(168,85,247,0.5)]
            active:scale-95
          "
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Confess Now
                    <span className="text-base sm:text-lg transition-transform group-hover:translate-x-1">
                      💌
                    </span>
                  </span>

                  {/* Cursor glow */}
                  <span
                    className="
              absolute inset-0 rounded-full
              bg-white/20 blur-xl opacity-0
              group-hover:opacity-100
              transition duration-300
            "
                  />
                </button>
              </div>
            </div>
          </div>
        </section>



        <div id="story"></div>

        {/* STORY STEPS START - Wrapped with ID markers for Video Sync */}
        <div id="steps-start" className="pt-20" />

        {steps.map((step, index) => (
          <section
            key={step.id}
            id={step.id}
            className={`min-h-screen flex items-center justify-center px-4 sm:px-6 transition-all duration-1000 ${activeStep === index ? 'opacity-100 scale-100 blur-0' : 'opacity-30 scale-95 blur-sm'
              }`}
          >
            {step.style === 'intro' ? (
              // INTRO STYLE (Centered)
              <div className="w-full max-w-xl md:max-w-2xl mx-auto text-center bg-black/30 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl transition-all duration-500 hover:bg-black/40">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-lg tracking-tight">
                  {step.title}
                </h2>
                <div className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-lg mx-auto drop-shadow-md font-light">
                  {step.desc}
                </div>
              </div>
            ) : (
              // FOCUS STYLE (With Bar)
              <div className="w-full max-w-xl md:max-w-2xl mx-auto text-center bg-black/30 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl transition-all duration-500 hover:bg-black/40">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 drop-shadow-md font-light max-w-lg mx-auto">
                  {step.desc}
                </p>
                <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto drop-shadow-sm opacity-80"></div>
              </div>
            )}
          </section>
        ))}

        <div id="steps-end" />
        {/* STORY STEPS END */}





        {/* FOOTER */}
        <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 text-white py-12 px-4 md:px-8 relative z-20 mt-32 shadow-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-bold mb-4 bg-gradient-to-br from-[#E91E63] to-[#9C27B0] bg-clip-text text-transparent drop-shadow-sm">
                  Izhaar
                </h4>

                <p className="text-white/70 text-sm">Speak your heart. Express your love. Build connections.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#home" className="hover:text-white transition">Home</a></li>
                  <li><a href="#journey" className="hover:text-white transition">How It Works</a></li>
                  <li><a href="#features" className="hover:text-white transition">Features</a></li>
                  <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="/privacy_policy" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="/privacy_policy" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="/contact_us" className="hover:text-white transition">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Follow Us</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="https://www.instagram.com/izhaar.official7/?igsh=MWJjNDlic2U4djU2eg%3D%3D" className="hover:text-white transition">Instagram</a></li>
                  <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                  <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 pt-8 text-center text-white/70 text-sm">
              <p>&copy; 2026 Izhaar. All rights reserved. Made with <span className="text-pink-400">❤️</span> for love.</p>
            </div>
          </div>
        </footer>

      </div>

      {/* MOBILE UNLOCK OVERLAY */}
      {!unlocked && (
        <div
          onClick={unlockVideo}
          className="fixed inset-0 z-[60] md:hidden flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl text-center shadow-2xl">
            <span className="text-4xl block mb-4">👆</span>
            <p className="text-xl font-bold">Tap to experience motion</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
