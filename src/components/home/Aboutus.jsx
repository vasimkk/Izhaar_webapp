import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import F from "../../assets/F.jpeg";

export default function Aboutus() {
  const navigate = useNavigate();

  // ✅ VIDEO (scroll scrub)
  const VIDEO_URL =
    "https://res.cloudinary.com/df5jbm55b/video/upload/v1770278799/aboutus_mysdue.mp4";

  const scrollWrapRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // ✅ TESTIMONIAL SLIDER
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const totalSlides = 8;

  const maxSlide = useMemo(() => Math.max(0, totalSlides - slidesToShow), [totalSlides, slidesToShow]);

  // Detect mobile + set slidesToShow
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSlidesToShow(mobile ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoslide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [maxSlide]);

  // ✅ IMPORTANT: Mobile browsers require 1 user gesture to allow scrubbing.
  // We unlock silently on first touch (no button, no message).
  useEffect(() => {
    if (!isMobile || !isVideoReady || unlocked) return;

    const unlock = async () => {
      const v = videoRef.current;
      if (!v) return;

      try {
        // user gesture event => allows play() and then scrubbing
        await v.play();
        v.pause();
        setUnlocked(true);
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    return () => window.removeEventListener("touchstart", unlock);
  }, [isMobile, isVideoReady, unlocked]);

  // ✅ Scroll scrub (desktop always; mobile only after unlocked)
  useEffect(() => {
    if (!isVideoReady) return;
    if (isMobile && !unlocked) return;

    const v = videoRef.current;
    const wrap = scrollWrapRef.current;
    if (!v || !wrap) return;

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const update = () => {
      rafRef.current = null;
      if (!v.duration || Number.isNaN(v.duration)) return;

      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const scrolled = clamp(-rect.top, 0, total);
      const progress = scrolled / total;

      const targetTime = progress * v.duration;

      // keep it stable
      v.pause();
      if (Math.abs(v.currentTime - targetTime) > 0.02) {
        v.currentTime = targetTime;
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Also update on touchmove for smooth mobile scroll scrubbing
    window.addEventListener("touchmove", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("touchmove", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVideoReady, isMobile, unlocked]);

  return (
    <>
      {/* ✅ Mobile Back Button */}
      <button
        onClick={() => navigate("/")}
        className="md:hidden fixed top-4 left-4 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md shadow-lg border border-white/40 transition-all active:scale-95"
        aria-label="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-[#2D1B4E]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* ✅ Scroll wrapper: make it tall so scrub feels cinematic */}
      <div ref={scrollWrapRef} className="relative min-h-[240vh]">
        {/* ✅ Sticky background video */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            // Mobile fallback: autoplay + loop until unlock happens
            autoPlay={isMobile && !unlocked}
            loop={isMobile && !unlocked}
            onLoadedMetadata={() => setIsVideoReady(true)}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Gradient fade bottom */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 to-transparent" />
        </div>

        {/* ✅ CONTENT */}
        <section
          id="about"
          className="relative z-10 -mt-[85vh] pb-24 px-4 md:px-8"
        >
          {/* small helper: you can keep your gradient-text class in global css */}
          <style>{`
            .gradient-text{
              background: linear-gradient(90deg,#E91E63,#9C27B0,#3B82F6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .glass{
              background: rgba(255,255,255,0.14);
              border: 1px solid rgba(255,255,255,0.22);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              box-shadow: 0 18px 60px rgba(0,0,0,0.25);
            }
            .glass-soft{
              background: rgba(255,255,255,0.18);
              border: 1px solid rgba(255,255,255,0.24);
              backdrop-filter: blur(14px);
              -webkit-backdrop-filter: blur(14px);
              box-shadow: 0 16px 44px rgba(0,0,0,0.18);
            }
          `}</style>

          <div className="max-w-6xl mx-auto">
            {/* HERO TITLE */}
            <div className="text-center mt-24 md:mt-28 mb-10">
              <p className="text-white/80 text-xs md:text-sm font-semibold tracking-[0.28em] uppercase">
                Izhaar • About
              </p>
              <h2 className="mt-3 text-4xl md:text-6xl font-extrabold text-white drop-shadow">
                About <span className="gradient-text">Us</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
                Scroll to experience our story — the background video moves with your scroll.
                {isMobile && !unlocked ? " (First touch enables smooth motion.)" : ""}
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-3xl p-7 md:p-9">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                  <span className="gradient-text">Mission</span>
                </h3>
                <p className="text-white/85 leading-relaxed mb-3">
                  Our mission is simple — to help people express feelings they cannot say themselves.
                </p>
                <p className="text-white/85 leading-relaxed">
                  We aim to make confessions, apologies, and emotional communication safe, respectful,
                  and beautifully delivered — so no relationship breaks because of fear or hesitation.
                </p>
                <div className="mt-6 rounded-2xl p-4 bg-white/15 border border-white/25 text-center">
                  <p className="text-white font-semibold">
                    Izhaar exists to give every genuine feeling… a genuine chance.
                  </p>
                </div>
              </div>

              <div className="glass rounded-3xl p-7 md:p-9">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                  <span className="gradient-text">Vision</span>
                </h3>
                <p className="text-white/85 leading-relaxed mb-3">
                  Our vision is to build India&apos;s most trusted emotional-expression platform — a place
                  where anyone can confess, connect, apologize, or reconnect without fear.
                </p>
                <p className="text-white/85 leading-relaxed mb-2">A future where:</p>
                <ul className="text-white/85 space-y-2 ml-5 list-disc">
                  <li>Expressing love feels effortless</li>
                  <li>Relationships get second chances</li>
                  <li>Feelings are respected, not judged</li>
                  <li>Safe meetings protect both hearts</li>
                  <li>Every emotion finds its path</li>
                </ul>
                <div className="mt-6 rounded-2xl p-4 bg-white/15 border border-white/25 text-center">
                  <p className="text-white font-semibold">
                    Turning unspoken emotions into unforgettable moments.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Story */}
            <div className="glass-soft rounded-3xl p-7 md:p-10 mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                <span className="gradient-text">Our Story</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <p className="text-white/85 text-lg leading-relaxed mb-4">
                    <span className="font-bold text-white">Izhaar</span> was born from a simple truth —
                    people feel deeply, but not everyone can express it.
                  </p>
                  <div className="text-white/80 text-lg leading-relaxed mb-4 space-y-1">
                    <p>Some freeze.</p>
                    <p>Some overthink.</p>
                    <p>Some fear rejection.</p>
                    <p>Some fear losing the relationship.</p>
                    <p>And some just don&apos;t know how to say it.</p>
                  </div>
                  <p className="text-white/85 text-lg leading-relaxed mb-4">
                    We saw countless beautiful connections ending before they even began…
                    not because feelings were missing, but because words were.
                  </p>
                  <p className="text-white/85 text-lg leading-relaxed mb-4">
                    So we created <span className="font-bold text-white">Izhaar</span> — a platform that
                    speaks for the shy, the scared, the nervous, the introverted, and the deeply genuine.
                  </p>

                  <div className="text-white text-lg font-semibold leading-relaxed mt-6 space-y-1">
                    <p>Because every love story deserves a chance.</p>
                    <p>And every feeling deserves to be expressed.</p>
                  </div>
                </div>

                <div className="order-1 md:order-2 flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="relative w-44 h-44 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-[#E91E63] via-[#9C27B0] to-[#3B82F6] p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img src={F} alt="Founder" className="w-full h-full object-cover object-top" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center bg-white/85 rounded-2xl p-6 shadow-lg border border-white/40 w-full max-w-sm">
                    <h4 className="text-2xl font-bold text-[#2D1B4E] mb-1">Shaik Imrooz</h4>
                    <p className="text-base font-semibold gradient-text mb-3">Founder & CEO</p>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      &quot;Every emotion deserves to be expressed, and every heart deserves to be heard.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="glass-soft rounded-3xl p-7 md:p-10 mb-8 overflow-hidden">
              <div className="text-center mb-10">
                <p className="text-white/80 text-xs md:text-sm font-semibold tracking-[0.28em]">
                  TESTIMONIALS
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                  <span className="gradient-text">What They Say About Us</span>
                </h3>
                <div className="w-16 h-1 bg-white/70 mx-auto mt-3 rounded-full" />
              </div>

              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
                  >
                    {/* Cards - keep your content as-is */}
                    {[
                      {
                        text:
                          '"It was an excellent experience to work with Izhaar. The team delivered our project on time and helped us express our feelings beautifully. Looking forward to work with them again."',
                        name: "Rahul Sharma",
                        role: "Software Engineer",
                        initials: "RS",
                      },
                      {
                        text:
                          '"Izhaar platform has completely changed how I express my feelings. Professional, well organized and creative team that helped me convey my emotions perfectly. Highly satisfied!"',
                        name: "Priya Verma",
                        role: "Marketing Manager",
                        initials: "PV",
                      },
                      {
                        text:
                          '"Got my message delivered beautifully through Izhaar. Very creative and innovative work done with professional approach. I am extremely pleased with the service. Terrific job!"',
                        name: "Arjun Kapoor",
                        role: "Business Owner",
                        initials: "AK",
                      },
                      {
                        text:
                          '"Izhaar made expressing my emotions so much easier. The platform is intuitive and the delivery was perfect. My loved one was touched beyond words. Thank you!"',
                        name: "Neha Khan",
                        role: "Designer",
                        initials: "NK",
                      },
                      {
                        text:
                          '"Absolutely wonderful service! The team understood my emotions perfectly and helped me convey them in the most beautiful way. Highly recommend to everyone!"',
                        name: "Vikram Mehta",
                        role: "Consultant",
                        initials: "VM",
                      },
                      {
                        text:
                          '"Best platform for expressing emotions! The creativity and attention to detail shown by the Izhaar team is commendable. My partner loved the surprise!"',
                        name: "Simran Dhillon",
                        role: "Teacher",
                        initials: "SD",
                      },
                      {
                        text:
                          '"Exceptional service from start to finish. Izhaar helped me reconnect with someone special. The team’s professionalism and care made all the difference. Thank you!"',
                        name: "Aditya Patel",
                        role: "Entrepreneur",
                        initials: "AP",
                      },
                      {
                        text:
                          '"I was nervous about expressing my feelings, but Izhaar made it so easy and stress-free. The result was beyond my expectations. Truly grateful for this service!"',
                        name: "Kavya Reddy",
                        role: "Doctor",
                        initials: "KR",
                      },
                    ].map((t, idx) => (
                      <div key={idx} className="min-w-full md:min-w-[33.333%] px-3">
                        <div className="bg-white/18 border border-white/25 rounded-2xl p-6 h-full shadow-lg flex flex-col">
                          <p className="text-white/90 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                            {t.text}
                          </p>
                          <div className="border-t border-white/25 pt-4 flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow">
                              <span className="text-lg font-bold text-[#2D1B4E]">{t.initials}</span>
                            </div>
                            <h4 className="mt-3 text-base font-bold text-white">{t.name}</h4>
                            <p className="text-xs text-white/70 font-medium">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.max(1, maxSlide + 1) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentSlide === i ? "bg-white w-8" : "bg-white/40 w-2.5 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Stats + CTA */}
            <div className="grid md:grid-cols-2 gap-8 items-center mt-10">
              <div className="glass rounded-3xl p-7 md:p-9">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "10K+", label: "Happy Users" },
                    { value: "50K+", label: "Messages Sent" },
                    { value: "5K+", label: "Connections Made" },
                    { value: "24/7", label: "Support Available" },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</div>
                      <p className="text-white/75 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Express Your Heart?
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Join thousands who found the courage to speak their truth through Izhaar.
                </p>
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="px-9 py-4 rounded-full font-bold bg-white text-[#2D1B4E] shadow-lg hover:shadow-xl transition-shadow active:scale-[0.99]"
                >
                  Start Your Izhaar Journey →
                </button>
              </div>
            </div>

            {/* Spacer so last scroll reaches end of video */}
            <div className="h-[60vh]" />
          </div>
        </section>
      </div>
    </>
  );
}
