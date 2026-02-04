import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import F from "../../assets/F.jpeg"
export default function Aboutus() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const totalSlides = 8;

  useEffect(() => {
    // Handle screen resize to update slidesToShow
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1); // Mobile: show 1
      } else {
        setSlidesToShow(3); // Desktop: show 3
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlide = totalSlides - slidesToShow;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [maxSlide]);

  return (
    <>
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/")}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(212, 197, 232, 0.3)',
          boxShadow: '0 4px 12px rgba(45, 27, 78, 0.15)'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5 text-[#2D1B4E]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* ABOUT US */}
      <section id="about" className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#fff0e8] via-[#ffe8f5] to-[#f0f5ff] relative overflow-hidden">
        <style jsx>{`
            @keyframes slide {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-slide {
              animation: slide 30s linear infinite;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
            @keyframes shimmer {
              0% { background-position: -1000px 0; }
              100% { background-position: 1000px 0; }
            }
            .parallax-card {
              transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
            }
            .parallax-card:hover {
              transform: translateY(-10px) scale(1.02);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
          `}</style>

        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-[#FF6F00] to-[#E91E63] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#3B82F6] to-[#9C27B0] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-[#2D1B4E]">
              About <span className="gradient-text">Us</span>
            </h2>


            {/* Mission & Vision - Side by Side with Parallax */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Mission */}
              <div className="parallax-card bg-white/20 backdrop-blur-lg rounded-3xl p-8 md:p-10 border border-white/30 shadow-xl relative group">
                <h3 className="text-2xl md:text-3xl font-bold text-[#2D1B4E] mb-6 text-center relative z-10">
                  <span className="gradient-text">Mission</span>
                </h3>
                <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-4 relative z-10">
                  Our mission is simple — to help people express feelings they cannot say themselves.
                </p>
                <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-4 relative z-10">
                  We aim to make confessions, apologies, and emotional communication safe, respectful, and beautifully delivered, so no relationship, bond, or love story breaks because of fear, shyness, hesitation, or overthinking.
                </p>
                <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 mt-6 relative z-10 shadow-lg border border-white/40">
                  <p className="text-base md:text-lg text-[#2D1B4E] font-bold leading-relaxed text-center">
                    Izhaar exists to give every genuine feeling… a genuine chance.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="parallax-card bg-white/20 backdrop-blur-lg rounded-3xl p-8 md:p-10 border border-white/30 shadow-xl relative group">
                <h3 className="text-2xl md:text-3xl font-bold text-[#2D1B4E] mb-6 text-center relative z-10">
                  <span className="gradient-text">Vision</span>
                </h3>
                <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-4 relative z-10">
                  Our vision is to build India's most trusted emotional-expression platform — a place where anyone can confess, connect, apologize, or reconnect without fear.
                </p>
                <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-3 relative z-10">
                  A future where:
                </p>
                <ul className="text-base md:text-lg text-gray-800 space-y-2 ml-6 mb-4 relative z-10 list-disc">
                  <li>Expressing love feels effortless</li>
                  <li>Relationships get second chances</li>
                  <li>Feelings are respected, not judged</li>
                  <li>Safe meetings protect both hearts</li>
                  <li>Every emotion finds its path</li>
                </ul>
                <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 mt-4 relative z-10 shadow-lg border border-white/40">
                  <p className="text-base md:text-lg text-[#2D1B4E] font-bold leading-relaxed text-center">
                    Turning unspoken emotions into unforgettable moments.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Story */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/30 shadow-xl mb-8 relative">
              <h3 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-8 text-center">
                <span className="gradient-text">Our Story</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Story Content - Left Side */}
                <div className="order-2 md:order-1">
                  <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                    <span className="font-bold text-[#2D1B4E]">Izhaar</span> was born from a simple truth —
                    people feel deeply, but not everyone can express it.
                  </p>
                  <div className="text-lg text-[#6B5B8E] leading-relaxed mb-4 space-y-2">
                    <p>Some freeze.</p>
                    <p>Some overthink.</p>
                    <p>Some fear rejection.</p>
                    <p>Some fear losing the relationship.</p>
                    <p>And some just don't know how to say it.</p>
                  </div>
                  <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                    We saw countless beautiful connections ending before they even began…
                    not because feelings were missing,
                    but because words were.
                  </p>
                  <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                    So we created <span className="font-bold text-[#2D1B4E]">Izhaar</span> —
                    a platform that speaks for the shy, the scared, the nervous, the emotional, the introverted,
                    and the deeply genuine.
                  </p>
                  <div className="text-lg text-[#2D1B4E] font-semibold leading-relaxed mt-6 space-y-2">
                    <p>Because every love story deserves a chance.</p>
                    <p>And every feeling deserves to be expressed.</p>
                  </div>
                </div>

                {/* Founder Details - Right Side */}
                <div className="order-1 md:order-2 flex flex-col items-center">
                  <div className="relative mb-6">
                    {/* Decorative circles behind */}
                    <div className="absolute inset-0 animate-pulse">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-pink-400/30 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/30 rounded-full blur-xl"></div>
                    </div>

                    {/* Main image container with gradient border */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#E91E63] via-[#9C27B0] to-[#3B82F6] p-1 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner ">
                        <img
                          src={F}
                          alt="Founder"
                          className="w-full h-full object-cover object-top rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center bg-white/80 rounded-2xl p-6 shadow-lg border border-[#d4c5e8]/30">
                    <h4 className="text-2xl font-bold text-[#2D1B4E] mb-2">Shaik Imrooz</h4>
                    <p className="text-lg font-semibold gradient-text mb-3">Founder & CEO</p>
                    <p className="text-[#6B5B8E] leading-relaxed mb-4">
                      "Every emotion deserves to be expressed, and every heart deserves to be heard."
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E91E63] to-[#9C27B0] flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E91E63] to-[#9C27B0] flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E91E63] to-[#9C27B0] flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/30 shadow-xl mb-8 relative overflow-hidden">
              <div className="text-center mb-12">
                <p className="text-[#6B5B8E] text-sm md:text-base font-semibold tracking-widest mb-2">TESTIMONIALS</p>
                <h3 className="text-2xl md:text-3xl font-bold text-[#2D1B4E] mb-3">
                  <span className="gradient-text">What They Say About Us</span>
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] mx-auto"></div>
              </div>

              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
                  >
                    {/* Testimonial 1 */}
                    <div className="min-w-full md:min-w-[33.333%] px-4">
                      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                          "It was an excellent experience to work with Izhaar. The team delivered our project on time and helped us express our feelings beautifully. Looking forward to work with them again."
                        </p>
                        <div className="border-t border-white/40 w-full pt-4 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E91E63] to-[#9C27B0] p-0.5 mb-3 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-[#2D1B4E]">RS</span>
                            </div>
                          </div>
                          <h4 className="text-base font-bold text-[#2D1B4E]">Rahul Sharma</h4>
                          <p className="text-xs text-[#6B5B8E] font-medium">Software Engineer</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="min-w-full md:min-w-[33.333%] px-4">
                      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                          "Izhaar platform has completely changed how I express my feelings. Professional, well organized and creative team that helped me convey my emotions perfectly. Highly satisfied!"
                        </p>
                        <div className="border-t border-white/40 w-full pt-4 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E91E63] to-[#9C27B0] p-0.5 mb-3 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-[#2D1B4E]">PV</span>
                            </div>
                          </div>
                          <h4 className="text-base font-bold text-[#2D1B4E]">Priya Verma</h4>
                          <p className="text-xs text-[#6B5B8E] font-medium">Marketing Manager</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="min-w-full md:min-w-[33.333%] px-4">
                      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                          "Got my message delivered beautifully through Izhaar. Very creative and innovative work done with professional approach. I am extremely pleased with the service. Terrific job!"
                        </p>
                        <div className="border-t border-white/40 w-full pt-4 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E91E63] to-[#9C27B0] p-0.5 mb-3 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-[#2D1B4E]">AK</span>
                            </div>
                          </div>
                          <h4 className="text-base font-bold text-[#2D1B4E]">Arjun Kapoor</h4>
                          <p className="text-xs text-[#6B5B8E] font-medium">Business Owner</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 4 */}
                    <div className="min-w-full md:min-w-[33.333%] px-4">
                      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                          "Izhaar made expressing my emotions so much easier. The platform is intuitive and the delivery was perfect. My loved one was touched beyond words. Thank you!"
                        </p>
                        <div className="border-t border-white/40 w-full pt-4 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E91E63] to-[#9C27B0] p-0.5 mb-3 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-[#2D1B4E]">NK</span>
                            </div>
                          </div>
                          <h4 className="text-base font-bold text-[#2D1B4E]">Neha Khan</h4>
                          <p className="text-xs text-[#6B5B8E] font-medium">Designer</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 5 */}
                    <div className="min-w-full md:min-w-[33.333%] px-4">
                      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                          "Absolutely wonderful service! The team understood my emotions perfectly and helped me convey them in the most beautiful way. Highly recommend to everyone!"
                        </p>
                        <div className="border-t border-white/40 w-full pt-4 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E91E63] to-[#9C27B0] p-0.5 mb-3 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-[#2D1B4E]">VM</span>
                            </div>
                          </div>
                          <h4 className="text-base font-bold text-[#2D1B4E]">Vikram Mehta</h4>
                          <p className="text-xs text-[#6B5B8E] font-medium">Consultant</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 6 */}
                    <div className="min-w-full md:min-w-[33.333%] px-4">
                      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                          "Best platform for expressing emotions! The creativity and attention to detail shown by the Izhaar team is commendable. My partner loved the surprise!"
                        </p>
                        <div className="border-t border-white/40 w-full pt-4 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E91E63] to-[#9C27B0] p-0.5 mb-3 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-[#2D1B4E]">SD</span>
                            </div>
                          </div>
                          <h4 className="text-base font-bold text-[#2D1B4E]">Simran Dhillon</h4>
                          <p className="text-xs text-[#6B5B8E] font-medium">Teacher</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 7 */}
                    <div className="min-w-full md:min-w-[33.333%] px-4">
                      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                          "Exceptional service from start to finish. Izhaar helped me reconnect with someone special. The team's professionalism and care made all the difference. Thank you!"
                        </p>
                        <div className="border-t border-white/40 w-full pt-4 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E91E63] to-[#9C27B0] p-0.5 mb-3 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-[#2D1B4E]">AP</span>
                            </div>
                          </div>
                          <h4 className="text-base font-bold text-[#2D1B4E]">Aditya Patel</h4>
                          <p className="text-xs text-[#6B5B8E] font-medium">Entrepreneur</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 8 */}
                    <div className="min-w-full md:min-w-[33.333%] px-4">
                      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed text-center mb-6 flex-grow">
                          "I was nervous about expressing my feelings, but Izhaar made it so easy and stress-free. The result was beyond my expectations. Truly grateful for this service!"
                        </p>
                        <div className="border-t border-white/40 w-full pt-4 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E91E63] to-[#9C27B0] p-0.5 mb-3 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-[#2D1B4E]">KR</span>
                            </div>
                          </div>
                          <h4 className="text-base font-bold text-[#2D1B4E]">Kavya Reddy</h4>
                          <p className="text-xs text-[#6B5B8E] font-medium">Doctor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentSlide(0)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === 0 ? 'bg-gradient-to-r from-[#E91E63] to-[#9C27B0] w-8' : 'bg-white/50 hover:bg-white/70 border border-white/40'}`}
                  ></button>
                  <button
                    onClick={() => setCurrentSlide(1)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === 1 ? 'bg-gradient-to-r from-[#E91E63] to-[#9C27B0] w-8' : 'bg-white/50 hover:bg-white/70 border border-white/40'}`}
                  ></button>
                  <button
                    onClick={() => setCurrentSlide(2)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === 2 ? 'bg-gradient-to-r from-[#E91E63] to-[#9C27B0] w-8' : 'bg-white/50 hover:bg-white/70 border border-white/40'}`}
                  ></button>
                  <button
                    onClick={() => setCurrentSlide(3)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === 3 ? 'bg-gradient-to-r from-[#E91E63] to-[#9C27B0] w-8' : 'bg-white/50 hover:bg-white/70 border border-white/40'}`}
                  ></button>
                  <button
                    onClick={() => setCurrentSlide(4)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === 4 ? 'bg-gradient-to-r from-[#E91E63] to-[#9C27B0] w-8' : 'bg-white/50 hover:bg-white/70 border border-white/40'}`}
                  ></button>
                  <button
                    onClick={() => setCurrentSlide(5)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === 5 ? 'bg-gradient-to-r from-[#E91E63] to-[#9C27B0] w-8' : 'bg-white/50 hover:bg-white/70 border border-white/40'}`}
                  ></button>
                </div>
              </div>
            </div>

            {/* Statistics & CTA */}
            <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                    <p className="text-[#6B5B8E]">Happy Users</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
                    <p className="text-[#6B5B8E]">Messages Sent</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">5K+</div>
                    <p className="text-[#6B5B8E]">Connections Made</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
                    <p className="text-[#6B5B8E]">Support Available</p>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-[#2D1B4E] mb-6">
                  Ready to Express Your Heart?
                </h3>
                <p className="text-lg text-[#6B5B8E] mb-6 leading-relaxed">
                  Join thousands who found the courage to speak their truth through Izhaar.
                </p>
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  Start Your Izhaar Journey →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}