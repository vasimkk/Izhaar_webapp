import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

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
    <div className="min-h-screen bg-black pt-16 px-5 text-white flex flex-col">
      <div className="flex flex-row items-center justify-between mb-2">
        <button onClick={() => navigate(-1)} className="text-white text-2xl font-bold w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full">{'<'}</button>
        <div className="text-lg font-bold mb-4 text-center tracking-wide flex-1">Notifications</div>
        <div className="w-9" />
      </div>
      {notifications.length === 0 && !loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">🔔</div>
          <div className="text-lg font-semibold">No Izhaar notifications</div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-8">
          {notifications.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-pink-50 rounded-lg p-4 mb-4 border border-pink-200 shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => handleNotificationClick(item)}
              tabIndex={0}
              role="button"
              onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleNotificationClick(item)}
            >
              <div className="text-pink-500 font-semibold mb-1">Someone is sending you an Izhaar. The Izhaar code is:</div>
              <div className="text-pink-500 font-bold text-base">{item.izhaar_code || item.code || "N/A"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


