import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { useNotifications } from "../../../context/NotificationContext";
import bg from "../../../assets/video/Stars_1.mp4";

export default function IzhaarNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchName, setSearchName] = useState("");
  const { fetchSummary } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndNotifications = async () => {
      setLoading(true);
      try {
        // Fetch profile to get mobile number
        const profileRes = await api.get("/profile/me");
        const profileData = profileRes.data.profile || profileRes.data;
        const userMobile = profileData.mobile;
        setMobile(userMobile);
        if (!userMobile) {
          setNotifications([]);
          setLoading(false);
          return;
        }
        // Fetch notifications using mobile
        const notifRes = await api.get(`/notification/izhaar/${userMobile}`);
        const notifs = Array.isArray(notifRes.data?.izhaar) ? notifRes.data.izhaar : [];
        setNotifications(notifs);
      } catch (e) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndNotifications();
  }, []);

  const isUnseen = (item) => {
    if (item.category === 'izhaar') {
      return ['SENT', 'DELIVERED'].includes(item.status);
    }
    return !item.is_read;
  };

  const handleNotificationClick = async (item) => {
    try {
      if (item.category === 'system') {
        await api.post('/notification/mark-read', { notificationId: item.id, type: 'system' });
      } else if (item.izhaar_code || item.code) {
        await api.patch(`/izhaar/status/${item.izhaar_code || item.code}`);
      }
      fetchSummary(); // Update global badge count
    } catch (e) {
      console.error("Error marking as read:", e);
    }

    if (item.type === "QUIZ_INVITE") {
      const data = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
      navigate(`/user/quiz?roomId=${data.roomId}`);
    } else if (item.type === "WATCH_PARTY_INVITE") {
      const data = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
      navigate(`/user/watch-party?roomId=${data.roomId}`);
    } else if (item.type === "SECRET_CRUSH_ADDED" || item.type === "SECRET_CRUSH_MATCH") {
      navigate('/user/secret-crush');
    } else {
      navigate('/user/notifictions/IzhaarNotificationDetail', { state: { izhaar: item } });
    }
  };

  // Filter notifications based on active filter and search
  const filteredNotifications = notifications.filter(item => {
    // Filter by type
    const unseen = isUnseen(item);
    const typeMatch = activeFilter === "All" ||
      (activeFilter === "Unseen" && unseen) ||
      (activeFilter === "Seen" && !unseen) ||
      (activeFilter === "Letters" && (!item.type || item.type === "LETTER")) ||
      (activeFilter === "Quiz" && item.type === "QUIZ_INVITE") ||
      (activeFilter === "Party" && item.type === "WATCH_PARTY_INVITE") ||
      (activeFilter === "Crush" && (item.type === "SECRET_CRUSH_ADDED" || item.type === "SECRET_CRUSH_MATCH"));

    // Filter by sender name
    const nameMatch = !searchName ||
      (item.sender_name && item.sender_name.toLowerCase().includes(searchName.toLowerCase()));

    return typeMatch && nameMatch;
  }).sort((a, b) => {
    const unseenA = isUnseen(a);
    const unseenB = isUnseen(b);
    if (unseenA && !unseenB) return -1;
    if (!unseenA && unseenB) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Count notifications by type
  const counts = {
    All: notifications.length,
    Unseen: notifications.filter(n => isUnseen(n)).length,
    Seen: notifications.filter(n => !isUnseen(n)).length,
    Letters: notifications.filter(n => !n.type || n.type === "LETTER").length,
    Quiz: notifications.filter(n => n.type === "QUIZ_INVITE").length,
    "Party": notifications.filter(n => n.type === "WATCH_PARTY_INVITE").length,
    "Crush": notifications.filter(n => n.type === "SECRET_CRUSH_ADDED" || n.type === "SECRET_CRUSH_MATCH").length,
  };

  const filters = ["All", "Unseen", "Seen", "Letters", "Quiz", "Party", "Crush"];

  return (
    <div className="relative min-h-screen w-full pb-24" style={{
      background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-4">
          <button
            onClick={() => navigate("/user/dashboard")}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide flex-1 text-center text-white drop-shadow-[0_0_10px_rgba(233,30,99,0.6)]">
            Notifications
          </h1>
          <div className="md:hidden w-8" />
        </div>

        {/* Filters - Scrollable */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === filter
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105"
                : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/5"
                }`}
            >
              {filter}
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === filter ? "bg-white/20" : "bg-black/20"
                }`}>
                {counts[filter] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search by Name */}
        <div className="mb-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by sender name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 pl-9 rounded-lg bg-black/20 backdrop-blur-md border border-white/10 text-white placeholder-white/40 focus:outline-none focus:bg-black/40 focus:border-pink-500/50 transition-all shadow-inner text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-pink-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchName && (
              <button
                onClick={() => setSearchName("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filteredNotifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3 opacity-80">🔔</div>
            <div className="text-base font-medium text-white/80">
              {searchName ? `No results for "${searchName}"` : "No notifications yet"}
            </div>
            <p className="text-xs text-white/40 mt-1">Check back later!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((item, idx) => {
              const unseen = isUnseen(item);
              return (
                <div
                  key={`${item.id || 'no-id'}-${idx}`}
                  className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${unseen
                    ? "bg-gradient-to-r from-pink-900/40 to-purple-900/40 border-pink-500/30 shadow-lg" // Darker for unseen
                    : "bg-white/5 border-white/5 hover:bg-white/10" // Lighter/transparent for seen
                    }`}
                  onClick={() => handleNotificationClick(item)}
                  tabIndex={0}
                  role="button"
                >
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                  <div className="flex items-center gap-3 p-3">
                    {/* Icon Container - Compact */}
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg shadow-inner border border-white/10 ${item.type === "QUIZ_INVITE" ? "bg-gradient-to-br from-blue-600 to-indigo-800" :
                      item.type === "WATCH_PARTY_INVITE" ? "bg-gradient-to-br from-purple-600 to-violet-800" :
                        (item.type === "SECRET_CRUSH_ADDED" || item.type === "SECRET_CRUSH_MATCH") ? "bg-gradient-to-br from-pink-600 to-rose-800" :
                          "bg-gradient-to-br from-fuchsia-600 to-pink-800"
                      }`}>
                      {item.type === "QUIZ_INVITE" ? "🎮" :
                        item.type === "WATCH_PARTY_INVITE" ? "🎬" :
                          (item.type === "SECRET_CRUSH_ADDED" || item.type === "SECRET_CRUSH_MATCH") ? "🤫" : "💌"}
                    </div>

                    {/* Content - Compact Layout */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <p className={`text-sm font-bold leading-tight mb-0.5 ${unseen ? 'text-white' : 'text-gray-300'}`}>
                            {item.type === "QUIZ_INVITE" ? "Quiz Battle Invite" :
                              item.type === "WATCH_PARTY_INVITE" ? "Watch Party Invite" :
                                item.type === "SECRET_CRUSH_ADDED" ? "Secret Crush Added" :
                                  item.type === "SECRET_CRUSH_MATCH" ? "It's a Match! 💘" :
                                    "Izhaar Received"}
                          </p>

                          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400">
                            {item.sender_name && <span className="text-pink-200">from {item.sender_name}</span>}
                            {!item.sender_name && <span>Someone sent you this.</span>}
                          </div>
                        </div>

                        {/* Time & Dot */}
                        <div className="flex flex-col items-end flex-shrink-0 pl-1">
                          <span className="text-[10px] text-white/40 font-medium whitespace-nowrap">
                            {item.created_at ? (() => {
                              const now = new Date();
                              const created = new Date(item.created_at);
                              const diffMs = now - created;
                              const diffMins = Math.floor(diffMs / 60000);
                              if (diffMins < 60) return `${diffMins}m`;
                              return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            })() : 'Now'}
                          </span>
                          {unseen && <div className="w-2 h-2 mt-1 bg-pink-500 rounded-full shadow-[0_0_5px_#ec4899] animate-pulse"></div>}
                        </div>
                      </div>

                      {/* Action Row - Very Compact */}
                      <div className="flex items-center justify-between mt-2">
                        <code className="text-[10px] font-mono text-white/30 px-1 py-0.5 bg-white/5 rounded border border-white/5">
                          #{item.izhaar_code || item.code || (typeof item.data === 'string' ? JSON.parse(item.data).roomId : item.data?.roomId) || "--"}
                        </code>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(item);
                          }}
                          className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shadow-md border border-white/10 ${unseen ?
                            "bg-gradient-to-r from-pink-500 to-purple-600 text-white" :
                            "bg-white/10 text-white/70 hover:bg-white/20"
                            }`}
                        >
                          <span>View</span>
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


