import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import bg from "../../../assets/video/Stars_1.mp4";

export default function IzhaarNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
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

  const handleNotificationClick = async (item) => {
    try {
      if (item.izhaar_code || item.code) {
        await api.patch(`/izhaar/status/${item.izhaar_code || item.code}`);
      }
    } catch (e) {
      // Optionally handle error
    }
    navigate('/user/notifictions/IzhaarNotificationDetail', { state: { izhaar: item } });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-gradient-to-br ">

      <div className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-6 sm:mb-10">
          <button
            onClick={() => navigate(-1)}
            className="sm:hidden text-white text-2xl font-bold w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
          >
            ←
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide flex-1 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Notifications</h1>
          <div className="sm:hidden w-10" />
        </div>

        {/* Empty state */}
        {notifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-6xl sm:text-8xl mb-4">🔔</div>
            <div className="text-lg sm:text-2xl font-semibold text-center text-gray-300 drop-shadow-lg">No Izhaar notifications</div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 pb-8 sm:pb-10">
            {notifications.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group bg-gradient-to-br from-purple-900/40 to-gray-900/60 backdrop-blur-lg rounded-2xl p-5 sm:p-8 border border-purple-400/40 shadow-xl cursor-pointer hover:shadow-2xl hover:border-purple-400/70 transition-all duration-300 hover:scale-[1.01] hover:bg-gradient-to-br hover:from-purple-800/50 hover:to-gray-800/70"
                onClick={() => handleNotificationClick(item)}
                tabIndex={0}
                role="button"
                onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleNotificationClick(item)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl sm:text-4xl flex-shrink-0">
                    {item.type === "SONG" ? "🎵" : "💌"}
                  </div>
                  <div className="flex-1">
                    <div className="text-base sm:text-xl font-semibold text-white group-hover:text-purple-200 transition">
                      {item.type === "SONG" ? "Someone is sending you a Song" : "Someone is sending you an Izhaar"}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">
                      Type: <span className="text-purple-300 font-semibold">{item.type || "LETTER"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 sm:p-6 border border-purple-400/30 mb-4">
                  <div className="text-xs sm:text-sm text-gray-300 mb-2 uppercase tracking-wider">Izhaar Code</div>
                  <div className="text-xl sm:text-3xl font-bold text-purple-200 font-mono">
                    {item.izhaar_code || item.code || "N/A"}
                  </div>
                </div>

                {/* Show sender name if available */}
                {item.sender_name && (
                  <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-purple-400/20 mb-4">
                    <div className="text-xs sm:text-sm text-gray-400 mb-1">From:</div>
                    <div className="text-base sm:text-lg font-semibold text-purple-300">
                      {item.sender_name}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-0">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Just now'}
                  </div>

                  <div className="flex items-center text-purple-300 group-hover:text-pink-300 transition text-sm sm:text-base font-semibold">
                    {item.type === "SONG" ? "Listen Song →" : "View Letter →"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


