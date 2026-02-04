import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.png";
import Step1 from "../../assets/images/Fear.png";
import Step2 from "../../assets/images/izhaar_explore.png";
import Step3 from "../../assets/images/Male.png";
import Step4 from "../../assets/images/Female.png";
import Step5 from "../../assets/images/Couples.png";


import bgVideo from "../../assets/bgvidieo.mp4";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = React.useRef(null);

  // Use Cloudinary hosted video for faster loading on mobile/devices
  const VIDEO_URL = "https://res.cloudinary.com/df5jbm55b/video/upload/q_auto,f_auto/v1770212374/bgvidieo_uakxfl.mp4";

  // RAF smoothing refs for smooth video scrubbing
  const rafRef = React.useRef(null);
  const targetTimeRef = React.useRef(0);
  const videoReadyRef = React.useRef(false);
  const lastSeekRef = React.useRef(0);
  const frameCallbackRef = React.useRef(null);
  const lastNormalizedRef = React.useRef(null);
  const scrollDirRef = React.useRef(0);
  const prevScrollYRef = React.useRef(0);
  const lastDirRef = React.useRef(0);
  


  /* =======================
     VIDEO SYNC WITH SCROLL (SCRUBBING)
  ======================= */
  useEffect(() => {
    // RAF loop: smoothly interpolate video.currentTime towards targetTimeRef
    const rafLoop = () => {
      const video = videoRef.current;
      if (video && !isNaN(video.duration)) {
        const target = targetTimeRef.current || 0;
        const current = video.currentTime || 0;
        const delta = target - current;

        const now = performance.now();
        const timeSinceLastSeek = now - (lastSeekRef.current || 0);

        // Only attempt to write currentTime when we have enough buffered data
        const canSeek = video.readyState >= 3; // HAVE_FUTURE_DATA

        // Normalize target to avoid exact 0 or duration (which can trigger buffering/looping)
        const duration = video.duration || 0;
        const normalized = duration ? Math.max(0.001, Math.min(0.999, target / duration)) : 0;

        // Skip tiny oscillations around the same progress to avoid loop/jitter
        const lastNormalized = lastNormalizedRef.current;
        const normalizedDelta = lastNormalized != null ? Math.abs(normalized - lastNormalized) : Infinity;

        // Increase responsiveness when user changes scroll direction (helps reverse/backwards feel)
        const dir = scrollDirRef.current || 0;
        const dirChanged = lastDirRef.current !== 0 && dir !== lastDirRef.current;
        const seekFactor = dirChanged ? 0.35 : 0.12;
        const minDelta = dirChanged ? 0.03 : 0.12;

        // Throttle frequent seeks to avoid mobile buffering/stalls. Allow small interpolated steps
        if (canSeek && (Math.abs(delta) > minDelta || timeSinceLastSeek > 120) && normalizedDelta > 0.001) {
          // Perform a controlled step towards the target (smaller writes reduce heavy seeks)
          let next = current + delta * seekFactor;
          // clamp away from exact edges
          next = Math.max(0.001, Math.min(duration - 0.001, next));
          try {
            video.currentTime = next;
            lastSeekRef.current = now;
            lastNormalizedRef.current = normalized;
            lastDirRef.current = dir || lastDirRef.current;
          } catch (e) {
            // ignore seek errors
          }
        }
      }
      rafRef.current = requestAnimationFrame(rafLoop);
    };

    const handleScroll = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const section = document.getElementById("journey");
      if (!section) return;
      
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;

      // Determine bounds from first/last step for more accurate mapping
      const firstEl = document.getElementById(steps[0].id);
      const lastEl = document.getElementById(steps[steps.length - 1].id);
      if (!firstEl || !lastEl) return;

      const startOffset = Math.round(viewportHeight * (window.innerWidth < 768 ? 0.45 : 0.9));
      const startY = firstEl.offsetTop - startOffset;
      const endY = lastEl.offsetTop + lastEl.offsetHeight - viewportHeight + startOffset;
      const totalScrollableHeight = Math.max(1, endY - startY);

      let progress = (scrollY - startY) / totalScrollableHeight;
      progress = Math.max(0, Math.min(1, progress));

      // Set the target time (we'll interpolate towards this in RAF loop)
      if (video.duration) {
        targetTimeRef.current = video.duration * progress;
      }

      // Update active step based on DOM position
      const centerLine = scrollY + viewportHeight / 2;
      let foundStep = 0;

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
      setActiveStep(foundStep);

      
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(rafLoop);

    // Ensure video metadata is loaded and attempt to play (helps rendering on mobile)
    const videoEl = videoRef.current;
    const onLoaded = () => {
      videoReadyRef.current = true;
      try {
        videoEl.setAttribute("preload", "auto");
      } catch (e) {}
      // Ensure the video is paused and at a valid start frame so scrubbing works
      try { videoEl.pause(); } catch (e) {}
      try { if (videoEl.currentTime === 0) videoEl.currentTime = 0.01; } catch (e) {}
    };
    if (videoEl) {
      // prefer canplaythrough/loadedmetadata
      videoEl.addEventListener("loadedmetadata", onLoaded);
      videoEl.addEventListener("canplaythrough", onLoaded);
      // set crossorigin to help some CDNs deliver faster
      try {
        videoEl.crossOrigin = "anonymous";
      } catch (e) {}
      try {
        // explicitly disable looping to avoid unexpected restarts
        videoEl.loop = false;
      } catch (e) {}
      // if the video fires 'ended' due to network/duration issues, keep it paused
      try {
        videoEl.addEventListener('ended', () => {
          try { videoEl.pause(); } catch (e) {}
        });
      } catch (e) {}
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (videoEl) {
        videoEl.removeEventListener("loadedmetadata", onLoaded);
        videoEl.removeEventListener("canplay", onLoaded);
      }
    };
  }, []);

  // Set CSS variable --vh to handle mobile browser UI (address bar) resizing
  useEffect(() => {
    const setVh = () => {
      const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
      document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`);
    };
    setVh();

    // update on resize and on mobile visualViewport changes (address bar hide/show)
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    window.addEventListener("touchmove", setVh, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setVh);
      window.visualViewport.addEventListener("scroll", setVh);
    }

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
      window.removeEventListener("touchmove", setVh);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", setVh);
        window.visualViewport.removeEventListener("scroll", setVh);
      }
    };
  }, []);



  const steps = [
    {
      id: "step1",
      title: "Rahul’s Hidden Heart",
      desc: "Rahul liked Anjali for months, but every time he tried to speak, fear and overthinking held him back. His feelings remained quietly in his heart, waiting for a moment to be heard.",
      image: Step1,
    },
    {
      id: "step2",
      title: "Discovering Izhaar",
      desc: "One late night, while scrolling on his phone, Rahul discovered Izhaar. It offered a safe and thoughtful way to express his feelings without revealing his identity",
      image: Step2,
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
      image: Step3,
    }
    ,
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
      image: Step5, // Fixed image reference from earlier context if needed, or keep Step4. Assuming Step4 is correct.

    }
    ,
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
      image: Step5,
    },
  
       
  ];

  /* =======================
     INTERSECTION OBSERVER
  ======================= */



  return (
    <div className="relative w-full text-[#2D1B4E] bg-black">

      {/* SCROLL PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 z-[100] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(236,72,153,0.7)]"
        style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
      />

      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div
          className="
      max-w-7xl mx-auto
      flex items-center justify-between
      px-6 py-4
      rounded-2xl
      bg-white/10
      backdrop-blur-xl
      border border-white/20
      shadow-lg shadow-black/20
    "
        >
          {/* LOGO */}
          <h1 className="text-2xl font-extrabold">
            <img
              src={Logo}
              alt="Izhaar"
              className="h-10 w-auto drop-shadow-sm"
            />
          </h1>

          {/* DESKTOP NAV - Updated text color for visibility on video */}
          <nav className="hidden md:flex gap-10 text-white font-bold drop-shadow-md">
            <a href="#home" className="hover:text-pink-200 transition">Home</a>
            <a href="#journey" className="hover:text-pink-200 transition">How It Works</a>
            <a href="#features" className="hover:text-pink-200 transition">Features</a>
            <a href="/about-us" className="hover:text-pink-200 transition">About Us</a>
          </nav>

          {/* MOBILE HAMBURGER - updated color */}
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU (GLASS STYLE) */}
        {menuOpen && (
          <div
            className="
        md:hidden
        mt-4 mx-4
        rounded-2xl
        bg-black/80
        backdrop-blur-xl
        border border-white/20
        shadow-lg
        px-6 py-6
        space-y-4
        text-white
      "
          >
            <a href="#home" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#journey" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#features" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="/about-us" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>About Us</a>
          </div>
        )}
      </header>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .font-vibes { font-family: 'Great Vibes', cursive; }
          html, body { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
        `}
      </style>





      {/* JOURNEY */}
      {/* JOURNEY - MAIN CONTAINER */}
      <section id="journey" className="relative w-full">
        {/* FIXED VIDEO BACKGROUND: Covers entire screen */}
        <div
          className="fixed top-0 left-0 w-full overflow-hidden z-0 bg-black"
          style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
        >
          <video
            ref={videoRef}
            src={VIDEO_URL}
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover object-center block"
            style={{ minWidth: '100%', minHeight: '100%' }}
          />
          {/* Dark Overlay (Solid semi-transparent black for text visibility) */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Fixed Background Elements (Optional decorative blurs) */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        {/* SCROLLING CONTENT TRACK - Scrolls OVER the fixed video */}
        <div className="relative z-10">
          <div className="w-full">

            {/* BLOCK 1: HERO TEXT */}
            <div className="min-h-[100vh] md:min-h-[150vh] relative">
              <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-6 z-20">
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up text-center">
                  <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight drop-shadow-md font-serif leading-tight">
                    Got a Crush? <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">Too Scared to Say It?</span>
                  </h1>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mt-2 drop-shadow-sm">
                    We’ve Got You 💗
                  </h3>

                  <button
                    onClick={() => navigate("/user/dashboard")}
                    className="mt-8 px-10 py-4 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white text-lg font-bold rounded-full shadow-[0_10px_20px_rgba(233,30,99,0.4)] hover:scale-105 transition-all border-2 border-white/50 mx-auto flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Confess Now</span>
                    <span className="text-xl group-hover:scale-110 transition-transform">💌</span>
                  </button>


                </div>
              </div>
            </div>


            {/* BLOCK 3+: SCROLL STEPS */}
            {steps.map((step, index) => (
              <div
                key={step.id}
                id={step.id}
                className={`relative transition-all duration-700 min-h-[100vh] md:min-h-[150vh] ${activeStep === index
                  ? "opacity-100 blur-none scale-100"
                  : "opacity-20 blur-sm scale-90"
                  }`}
              >
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-6 z-10 w-full max-w-4xl mx-auto">
                  <h3 className="text-4xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 drop-shadow-2xl font-vibes text-center">
                    {step.title}
                  </h3>
                  <div className="text-xl md:text-3xl text-white font-medium leading-relaxed drop-shadow-md max-w-3xl mx-auto text-center">
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




    </div>

  );
};

export default HomePage;