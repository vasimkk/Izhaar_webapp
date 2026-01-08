import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserLayout from "./UserLayout";
import couplePose from "../../assets/images/couple_pose_4.png";
import api from "../../utils/api";

// Pages
import ChatInterface from "./chat-interface";
import ProfileView from "./Profile/profile-view";
import TypeOfIzhaar from "./IzhaarTypes/type-of-izhaar";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("home");
  const [checking, setChecking] = useState(true);

  /* =========================================================
     1️⃣ ROUTE GUARD – onboarding / profile / template checks
     ========================================================= */
  useEffect(() => {
    let isMounted = true;

    const checkOnboardingComplete = async () => {
      if (location.pathname !== "/user/dashboard") {
        if (isMounted) setChecking(false);
        return;
      }

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
    };

    navigate(routes[tabId]);
  };

  /* =========================================================
     5️⃣ LOADING STATE (AFTER ALL HOOKS ✅)
     ========================================================= */
  if (checking && location.pathname === "/user/dashboard") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  /* =========================================================
     6️⃣ RENDER
     ========================================================= */
  return (
    <UserLayout showHeader={activeTab === "home"}>
      <div className="w-full text-white">

        {/* HOME */}
        {activeTab === "home" && (
          <div className="relative min-h-screen flex items-center justify-center">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">

                {/* IMAGE */}
                <div className="hidden md:flex justify-end">
                  <img
                    src={couplePose}
                    alt="Couple"
                    className="w-full max-w-md drop-shadow-2xl animate-float"
                  />
                </div>

                {/* CONTENT */}
                <div className="space-y-6 text-center md:text-left">
                  <h1 className="font-bold">
                    <span className="block text-4xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Izhaar — We Speak on Your Behalf.
                    </span>
                    <span className="block text-3xl text-white mt-2">
                      Feelings Safely
                    </span>
                  </h1>

                  <p className="text-black max-w-xl mx-auto md:mx-0">
                    Feelings are real… Expression is difficult.
                    <br />
                    <b>Izhaar makes it easy.</b>
                  </p>

                  <div className="flex gap-3 justify-center md:justify-start">
                    <button
                      onClick={() => handleTabChange("confession")}
                      className="px-6 py-3 rounded-xl font-semibold text-white shadow-xl hover:scale-105 transition"
                      style={{
                        background:
                          "linear-gradient(90deg, #ff4747, #ce72ff, #9dd1ff)",
                      }}
                    >
                      Start Your Izhaar
                    </button>

                    <button
                      onClick={() => navigate("/user/izhaar_tracker")}
                      className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition"
                    >
                      View Your Izhaars
                    </button>
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

      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </UserLayout>
  );
}
