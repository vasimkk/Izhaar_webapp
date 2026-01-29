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
    } else {
      navigate('/user/notifictions/IzhaarNotificationDetail', { state: { izhaar: item } });
    }
  };

  // Filter notifications based on active filter and search
  const filteredNotifications = notifications.filter(item => {
    // Filter by type
    const typeMatch = activeFilter === "All" ||
      (activeFilter === "Letters" && (!item.type || item.type === "LETTER")) ||
      (activeFilter === "Quiz" && item.type === "QUIZ_INVITE") ||
      (activeFilter === "Party" && item.type === "WATCH_PARTY_INVITE");

    // Filter by sender name
    const nameMatch = !searchName ||
      (item.sender_name && item.sender_name.toLowerCase().includes(searchName.toLowerCase()));

    return typeMatch && nameMatch;
  });

  // Count notifications by type
  const counts = {
    All: notifications.length,
    Letters: notifications.filter(n => !n.type || n.type === "LETTER").length,
    Quiz: notifications.filter(n => n.type === "QUIZ_INVITE").length,
    "Party": notifications.filter(n => n.type === "WATCH_PARTY_INVITE").length,
  };

  return (
    <div className="relative min-h-screen w-full " style={{
      background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
      animation: 'gradientShift 15s ease infinite'
    }}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Notifications</h1>
          <div className="sm:hidden w-10" />
        </div>

        {/* Mobile Back Button */}
        <button
          onClick={() => navigate("/user/dashboard")}
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



        {/* Search by Name */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by sender name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 pl-9 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchName && (
              <button
                onClick={() => setSearchName("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filteredNotifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg">
            <div className="text-4xl mb-3">🔔</div>
            <div className="text-base font-medium text-center text-gray-500">
              {searchName ? `No notifications found for "${searchName}"` :
                activeFilter !== "All" ? `No ${activeFilter} notifications` :
                  "No Izhaar notifications"}
            </div>
          </div>
        ) : (
          <div className="space-y-0 bg-white rounded-lg overflow-hidden border border-gray-200">
            {filteredNotifications.map((item, idx) => {
              const unseen = isUnseen(item);
              return (
                <div
                  key={item.id || idx}
                  className={`group border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-200 hover:bg-gray-50 relative ${unseen ? "bg-blue-50/50" : "bg-white"
                    }`}
                  onClick={() => handleNotificationClick(item)}
                  tabIndex={0}
                  role="button"
                  onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleNotificationClick(item)}
                >
                  <div className="flex items-start gap-3 p-3 sm:p-4">
                    {/* Blue dot for unseen */}
                    {unseen && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                    {!unseen && <div className="w-2 flex-shrink-0"></div>}

                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {item.type === "QUIZ_INVITE" ? "🎮" :
                        item.type === "WATCH_PARTY_INVITE" ? "🎬" : "💌"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {item.type === "QUIZ_INVITE" ? "Challenge: Someone invited you to a Quiz Battle!" :
                              item.type === "WATCH_PARTY_INVITE" ? "Invitation: Watch together with a friend!" :
                                "Someone is sending you an Izhaar"}
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            Type: <span className="font-medium text-gray-900">{item.type || "LETTER"}</span>
                          </p>

                          {/* Code/Room ID */}
                          <div className="inline-block bg-gray-100 rounded px-2 py-1 mt-1">
                            <p className="text-[10px] text-gray-500 uppercase">
                              {item.type === "QUIZ_INVITE" || item.type === "WATCH_PARTY_INVITE" ? "Room ID" : "Code"}
                            </p>
                            <p className="text-sm font-bold text-gray-900 font-mono">
                              {item.type === "QUIZ_INVITE" || item.type === "WATCH_PARTY_INVITE" ?
                                (typeof item.data === 'string' ? JSON.parse(item.data).roomId : item.data?.roomId) :
                                (item.izhaar_code || item.code || "N/A")}
                            </p>
                          </div>

                          {/* Sender */}
                          {item.sender_name && (
                            <p className="text-xs text-gray-600 mt-2">
                              From: <span className="font-medium text-gray-900">{item.sender_name}</span>
                            </p>
                          )}

                          {/* Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(item);
                            }}
                            className="mt-3 px-4 py-1.5 rounded-md text-xs font-semibold transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                            style={{
                              background: item.type === "QUIZ_INVITE" ? "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" :
                                item.type === "WATCH_PARTY_INVITE" ? "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" :
                                  "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
                              color: "white",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                          >
                            {item.type === "QUIZ_INVITE" ? (
                              <>
                                <span>🎮</span>
                                <span>Play Now</span>
                              </>
                            ) : item.type === "WATCH_PARTY_INVITE" ? (
                              <>
                                <span>🎬</span>
                                <span>Join Now</span>
                              </>
                            ) : (
                              <>
                                <span>💌</span>
                                <span>See Now</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Timestamp */}
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {item.created_at ? (() => {
                            const now = new Date();
                            const created = new Date(item.created_at);
                            const diffMs = now - created;
                            const diffMins = Math.floor(diffMs / 60000);
                            const diffHours = Math.floor(diffMins / 60);
                            const diffDays = Math.floor(diffHours / 24);

                            if (diffMins < 60) return `${diffMins}m`;
                            if (diffHours < 24) return `${diffHours}h`;
                            if (diffDays < 7) return `${diffDays}d`;
                            return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          })() : 'now'}
                        </div>
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


