import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserLayout from "./UserLayout";
import api from "../../utils/api";
import { Link } from "react-router-dom";

// Pages
import ChatInterface from "./Chatbox/chat-interface";
import ProfileView from "./Profile/profile-view";
import TypeOfIzhaar from "./IzhaarTypes/type-of-izhaar";
import WatchParty from "./WatchParty/WatchParty";
import Quiz from "./Quiz/Quiz";
import { io } from "socket.io-client";
import { BASE_URL } from "../../config/config";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("home");
  const [checking, setChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [quizInvite, setQuizInvite] = useState(null);

  /* =========================================================
     1️⃣ ROUTE GUARD – onboarding / profile / template checks
     ========================================================= */
  useEffect(() => {
    let isMounted = true;

    const checkOnboardingComplete = async () => {
      // Check onboarding on all dashboard routes


      try {
        // Agreement check
        const agreeRes = await api.get("/user-agreement/status");
        if (!agreeRes.data?.agreed) {
          navigate("/welcome", { replace: true });
          return;
        }

        // Profile check
        const profileRes = await api.get("/profile/me");
        const profileData = profileRes.data?.profile || profileRes.data;
        const hasProfile = profileData && (profileData.id || profileData._id);

        if (!hasProfile) {
          navigate("/profile", { replace: true });
          return;
        }

        // Store profile in state
        setCurrentUser(profileData);

        // Template check
        try {
          const templateRes = await api.get("/user/template-history");
          if (!templateRes.data || templateRes.data.length === 0) {
            navigate("/user/select-template", { replace: true });
            return;
          }
        } catch {
          navigate("/user/select-template", { replace: true });
          return;
        }

        // All good
        if (isMounted) setChecking(false);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/profile", { replace: true });
        } else {
          console.error("Onboarding check failed:", err);
          if (isMounted) setChecking(false);
        }
      }
    };

    checkOnboardingComplete();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  /* =========================================================
     1.5 SOCKET INITIALIZATION & GLOBAL LISTENERS
     ========================================================= */
  useEffect(() => {
    if (!currentUser || !currentUser.user_id) return;

    const newSocket = io(BASE_URL, {
      query: { userId: currentUser.user_id },
    });
    setSocket(newSocket);

    newSocket.on("quiz-invite-received", (invite) => {
      console.log("Global Quiz Invite Received:", invite);
      setQuizInvite(invite);
    });

    // We can also centralize watch party invites here later if needed

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  /* =========================================================
     2️⃣ PREVENT BACK NAVIGATION TO AUTH / ONBOARDING
     ========================================================= */
  useEffect(() => {
    if (location.pathname !== "/user/dashboard") return;

    const handlePopState = () => {
      const path = window.location.pathname;

      const blocked =
        path.includes("/login") ||
        path.includes("/register") ||
        (path.includes("/profile") && !path.includes("/user/profile")) ||
        path.includes("/user/select-template") ||
        path.includes("/welcome");

      if (blocked) {
        window.history.pushState(null, "", "/user/dashboard");
        navigate("/user/dashboard", { replace: true });
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  /* =========================================================
     3️⃣ SYNC ACTIVE TAB WITH ROUTE
     ========================================================= */
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("chat")) setActiveTab("chat");
    else if (path.includes("profile")) setActiveTab("profile");
    else if (path.includes("confession")) setActiveTab("confession");
    else if (path.includes("watch-party")) setActiveTab("watch-party");
    else if (path.includes("quiz")) setActiveTab("quiz");
    else setActiveTab("home");
  }, [location.pathname]);

  /* =========================================================
     4️⃣ TAB NAVIGATION HANDLER
     ========================================================= */
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    const routes = {
      home: "/user/dashboard",
      confession: "/user/confession",
      chat: "/user/chat-interface",
      profile: "/user/profile",
      "watch-party": "/user/watch-party",
      quiz: "/user/quiz",
      gift:"/gifts"
    };

    navigate(routes[tabId]);
  };

  /* =========================================================
     5️⃣ LOADING STATE (AFTER ALL HOOKS ✅)
     ========================================================= */
  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)' }}>
        <div className="text-[#2D1B4E] text-xl font-medium">Loading...</div>
      </div>
    );
  }

  /* =========================================================
     6️⃣ RENDER
     ========================================================= */
  return (
    <UserLayout showHeader={activeTab === "home"}>
      <div className="w-full">

        {/* HOME */}
        {activeTab === "home" && (
          <div className="relative min-h-screen flex items-center justify-center">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">



                {/* LEFT - CONTENT */}
                <div className="space-y-6 text-center md:text-left">
                  <h1 className="font-bold">
                    <span className="block text-4xl md:text-5xl bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
                      Izhaar — We Speak on Your Behalf.
                    </span>
                    <span className="block text-3xl text-[#2D1B4E] mt-2">
                      Feelings Safely
                    </span>
                  </h1>

                  <div className="text-[#6B5B8E] text-lg max-w-xl mx-auto md:mx-0">
                    <p>
                      Feelings are real… Expression is difficult.
                      <br />
                      <b>Izhaar makes it easy.</b>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <button
                      onClick={() => handleTabChange("confession")}
                      className="px-6 py-3 rounded-2xl font-semibold text-white shadow-xl hover:scale-105 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                        boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)'
                      }}
                    >
                      Start Your Izhaar
                    </button>

                    <button
                      onClick={() => navigate("/user/izhaar_tracker")}
                      className="px-6 py-3 rounded-2xl font-semibold text-[#2D1B4E] bg-white/60 backdrop-blur-md border border-[#E91E63]/30 hover:bg-white/80 transition-all shadow-lg"
                    >
                      View Your Izhaars
                    </button>

                    <button
                      onClick={() => handleTabChange("watch-party")}
                      className="px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all shadow-xl"
                      style={{
                        background: 'linear-gradient(135deg, #9C27B0 0%, #3B82F6 100%)',
                        boxShadow: '0 4px 15px 0 rgba(156, 39, 176, 0.4)'
                      }}
                    >
                      Watch Together
                    </button>

                    <button
                      onClick={() => handleTabChange("quiz")}
                      className="px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all shadow-xl"
                      style={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)',
                        boxShadow: '0 4px 15px 0 rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      Play Game
                    </button>
                      <button
                      onClick={() => handleTabChange("gift")}
                      className="px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all shadow-xl"
                      style={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)',
                        boxShadow: '0 4px 15px 0 rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      Gifts
                    </button>
                  </div>
                     <div
                      className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform"
                      style={{
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate('/magazine')}
                    >
                      <h3 className="text-xl font-semibold mb-2 text-white">Magazine</h3>
                      <p className="text-white">View Magazine</p>
                    </div>
                </div>
               

                {/* RIGHT - PARTICLE HEART ANIMATION */}
                <div className="hidden md:flex items-center justify-center relative">
                  <div className="particle-heart-container">
                    {/* Generate 150 particles for the heart shape */}
                    {[...Array(150)].map((_, i) => {
                      // Calculate heart shape coordinates
                      const t = (i / 150) * Math.PI * 2;
                      const x = 16 * Math.pow(Math.sin(t), 3);
                      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

                      // Scale and center (reduced scale for smaller heart)
                      const scale = 5.5;
                      const offsetX = 50 + x * scale;
                      const offsetY = 50 + y * scale;

                      return (
                        <div
                          key={i}
                          className="particle"
                          style={{
                            '--final-x': `${offsetX}%`,
                            '--final-y': `${offsetY}%`,
                            animationDelay: `${(i / 150) * 1.5}s`
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* CONFESSION */}
        {activeTab === "confession" && <TypeOfIzhaar />}

        {/* CHAT */}
        {activeTab === "chat" && (
          <div className="px-5 md:px-10">
            <ChatInterface />
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="px-5 md:px-10">
            <ProfileView />
          </div>
        )}

        {/* WATCH PARTY */}
        {activeTab === "watch-party" && (
          <div className="px-5 md:px-10 h-full">
            <WatchParty user={currentUser} />
          </div>
        )}

        {/* QUIZ */}
        {activeTab === "quiz" && (
          <div className="px-5 md:px-10 h-full">
            <Quiz user={currentUser} socket={socket} />
          </div>
        )}

        {/* GLOBAL QUIZ INVITE POPUP */}
        {quizInvite && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-blue-900 to-cyan-900 border border-blue-500/50 p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4">
              <div className="text-4xl">🎮</div>
              <h3 className="text-xl font-bold text-white">Quiz Challenge!</h3>
              <p className="text-blue-200">
                <span className="font-bold text-white">{quizInvite.senderName}</span> invited you to a quiz game!
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setQuizInvite(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition text-sm font-semibold text-white"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    setQuizInvite(null);
                    handleTabChange("quiz");
                    // Join quiz logic will be handled in Quiz.jsx or we can emit here
                    socket.emit("join-quiz", { roomId: quizInvite.roomId, userId: currentUser.user_id });
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition text-sm font-bold text-white shadow-lg"
                >
                  Accept & Play
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes typing {
          0% {
            width: 0;
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes formHeart {
          0% {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            left: var(--final-x);
            top: var(--final-y);
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        
        .typing-text {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 2.5s steps(50) forwards;
          opacity: 0;
          width: 0;
          display: inline-block;
        }
        
        .typing-fade {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translate(2px, -3px) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translate(-1px, 2px) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translate(3px, 1px) scale(1.05);
            opacity: 0.9;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 2px rgba(233, 30, 99, 0.5));
          }
          50% {
            filter: brightness(1.5) drop-shadow(0 0 8px rgba(156, 39, 176, 0.8));
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .particle-heart-container {
          position: relative;
          width: 220px;
          height: 220px;
          animation: float 4s ease-in-out infinite;
        }
        
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(233, 30, 99, 1) 0%, rgba(156, 39, 176, 0.8) 50%, rgba(59, 130, 246, 0.6) 100%);
          box-shadow: 0 0 3px rgba(233, 30, 99, 0.8), 0 0 6px rgba(156, 39, 176, 0.5);
          animation: 
            formHeart 4s ease-in-out infinite,
            particleFloat 3s ease-in-out infinite,
            glow 2s ease-in-out infinite;
          transform-origin: center;
        }
        
        .particle:nth-child(3n) {
          background: radial-gradient(circle, rgba(156, 39, 176, 1) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(233, 30, 99, 0.6) 100%);
          width: 2.5px;
          height: 2.5px;
        }
        
        .particle:nth-child(5n) {
          background: radial-gradient(circle, rgba(59, 130, 246, 1) 0%, rgba(233, 30, 99, 0.8) 50%, rgba(156, 39, 176, 0.6) 100%);
          width: 4px;
          height: 4px;
        }
        
        .particle:nth-child(7n) {
          width: 2px;
          height: 2px;
          box-shadow: 0 0 4px rgba(233, 30, 99, 1), 0 0 8px rgba(156, 39, 176, 0.8);
        }
      `}</style>
    </UserLayout>
  );
}
