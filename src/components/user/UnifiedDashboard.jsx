import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserLayout from "./UserLayout";
import couplePose from "../../assets/images/couple_pose_4.png";
import bgimg from "../../assets/images/bg.png";

// Import your page components
import ChatInterface from "./chat-interface";
import ProfileView from "./Profile/profile-view";
import TypeOfIzhaar from "./IzhaarTypes/type-of-izhaar";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");

  // Prevent back navigation to auth/profile creation pages
  useEffect(() => {
    // Clear history stack when dashboard loads
    if (location.pathname === "/user/dashboard") {
      window.history.replaceState(null, '', window.location.href);
      
      // Block back navigation to previous routes
      const handlePopState = (e) => {
        const currentPath = window.location.pathname;
        // Prevent going back to auth/profile creation routes
        if (currentPath.includes('/login') || 
            currentPath.includes('/register') || 
            currentPath.includes('/profile') && !currentPath.includes('/user/profile') ||
            currentPath.includes('/select-template') ||
            currentPath.includes('/welcome')) {
          window.history.pushState(null, '', window.location.href);
          navigate("/user/dashboard", { replace: true });
        } else {
          window.history.pushState(null, '', window.location.href);
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      
      // Push a new state to prevent back navigation
      window.history.pushState(null, '', window.location.href);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [location.pathname, navigate]);

  // Determine active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("chat")) {
      setActiveTab("chat");
    } else if (path.includes("profile")) {
      setActiveTab("profile");
    } else if (path.includes("confession")) {
      setActiveTab("confession");
    } else {
      setActiveTab("home");
    }
  }, [location.pathname]);

  // Handle tab navigation
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const routes = {
      home: "/user/dashboard",
      confession: "/user/confession",
      chat: "/user/chat-interface",
      profile: "/user/profile",
    };
    navigate(routes[tabId]);
  };

  return (
    <UserLayout 
      showHeader={activeTab === "home"} 
      backgroundClass=""
    >
      <div className="w-full text-white">
        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="animate-fade-in relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0" />
            
            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                
                {/* Right Side - Couple Image (hidden on mobile) */}
                <div className="hidden md:flex justify-end order-2 md:order-2">
                  <div className="relative">
                    <img 
                      src={couplePose} 
                      alt="Couple" 
                      className="w-full max-w-md h-auto object-contain drop-shadow-2xl animate-float"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent rounded-full blur-3xl" />
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="space-y-6 order-1 md:order-2 text-center md:text-left">
  <div className="space-y-3">
    <h1 className="font-bold leading-tight">
      <span className="
        block
        text-2xl 
        sm:text-3xl 
        md:text-4xl 
        lg:text-5xl
        bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
        bg-clip-text text-transparent
      ">
        Izhaar — We Speak on Your Behalf.
      </span>

      <span className="
        block 
        mt-1
        text-xl 
        sm:text-2xl 
        md:text-3xl 
        lg:text-4xl 
        text-white
      ">
        Feelings Safely
      </span>
    </h1>

    <p className="
      text-sm 
      sm:text-base 
      md:text-lg 
      text-black 
      leading-relaxed
      max-w-xl
      mx-auto
      md:mx-0
    ">
      Feelings are real… Expression is difficult.
      <br />
      <span className="font-medium">Izhaar makes it easy.</span>
      <br />
      A modern way to express feelings — love, sorry, confession, patch-up —
      safely and anonymously.
    </p>
  </div>

  <div className="flex flex-col sm:flex-row gap-3 pt-3 justify-center md:justify-start">
    <button
      onClick={() => handleTabChange('confession')}
      className="
        px-6 
        py-3 
        rounded-xl 
        text-sm 
        sm:text-base 
        font-semibold 
        text-white 
        shadow-xl 
        transition-all 
        duration-300 
        hover:scale-105
      "
      style={{
        background:
          'linear-gradient(90deg, rgba(255, 71, 71, 0.9) 0%, rgba(206, 114, 255, 0.9) 50%, rgba(157, 209, 255, 0.9) 100%)',
      }}
    >
      Start Your Izhaar
    </button>

    <button
      onClick={() => navigate('/user/izhaar_tracker')}
      className="
        px-6 
        py-3 
        rounded-xl 
        text-sm 
        sm:text-base 
        font-semibold 
        text-white 
        bg-white/10 
        backdrop-blur-xl 
        border 
        border-white/20 
        hover:bg-white/20 
        transition-all
      "
    >
      View Your Izhaars
    </button>
  </div>
</div>

              </div>
            </div>
          </div>
        )}

        {/* CONFESSION TAB */}
        {activeTab === "confession" && (
          <div className="animate-fade-in">
            <TypeOfIzhaar />
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="animate-fade-in px-5 md:px-10">
            <ChatInterface />
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="animate-fade-in px-5 md:px-10">
            <ProfileView />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </UserLayout>
  );
}
