import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import api from "../../../utils/api";
import { BASE_URL } from "../../../config/config";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Fetch requests data
        const res = await api.get("/requests"); // Replace with the correct endpoint
        const data = Array.isArray(res.data?.requests) ? res.data.requests : [];
        setRequests(data);
      } catch (e) {
        console.error("Failed to fetch requests:", e);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Set up WebSocket for real-time updates
    const socket = io(BASE_URL);
    socket.on("new-request", (newRequest) => {
      setRequests((prevRequests) => [newRequest, ...prevRequests]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRequestClick = (request) => {
    navigate("/user/requests/RequestDetail", { state: { request } });
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide flex-1 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Requests</h1>
          <div className="sm:hidden w-10" />
        </div>

        {/* Empty state */}
        {requests.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-6xl sm:text-8xl mb-4">📩</div>
            <div className="text-lg sm:text-2xl font-semibold text-center text-gray-300 drop-shadow-lg">No Requests</div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 pb-8 sm:pb-10">
            {requests.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group bg-gradient-to-br from-purple-900/40 to-gray-900/60 backdrop-blur-lg rounded-2xl p-5 sm:p-8 border border-purple-400/40 shadow-xl cursor-pointer hover:shadow-2xl hover:border-purple-400/70 transition-all duration-300 hover:scale-[1.01] hover:bg-gradient-to-br hover:from-purple-800/50 hover:to-gray-800/70"
                onClick={() => handleRequestClick(item)}
                tabIndex={0}
                role="button"
                onKeyPress={(e) => (e.key === "Enter" || e.key === " ") && handleRequestClick(item)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl sm:text-4xl flex-shrink-0">📩</div>
                  <div className="flex-1">
                    <div className="text-base sm:text-xl font-semibold text-white group-hover:text-purple-200 transition">
                      {item.title || "New Request"}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">
                      From: <span className="text-purple-300 font-semibold">{item.sender || "Unknown"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 sm:p-6 border border-purple-400/30 mb-4">
                  <div className="text-xs sm:text-sm text-gray-300 mb-2 uppercase tracking-wider">Request ID</div>
                  <div className="text-xl sm:text-3xl font-bold text-purple-200 font-mono">
                    {item.request_id || "N/A"}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-0">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Just now"}
                  </div>

                  <div className="flex items-center text-purple-300 group-hover:text-pink-300 transition text-sm sm:text-base font-semibold">
                    View Request →
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