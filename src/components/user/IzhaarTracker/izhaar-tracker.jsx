import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function IzhaarTracker() {
  const [loading, setLoading] = useState(false);
  const [allCodes, setAllCodes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllIzhaar = async () => {
      try {
        setLoading(true);
        const res = await api.get("/izhaar/all");
        const izhaarList = Array.isArray(res.data?.izhaar) ? res.data.izhaar : [];
        setAllCodes(izhaarList);
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAllIzhaar();
  }, []);

  const renderCodeItem = (item) => (
    <div key={item.id} className="shadow-lg mb-4 rounded-2xl">
      <div className="bg-white rounded-2xl p-4 border border-pink-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-pink-600 tracking-wide">
            {item.izhaar_code || item.code || "N/A"}
          </h3>
          <span className={`px-3 py-1 rounded-xl text-xs font-bold text-white ${
            item.status === "SENT" ? "bg-yellow-400" : "bg-gray-400"
          }`}>
            {item.status || "-"}
          </span>
        </div>
        <p className="text-sm text-gray-800 mb-1">
          To: <span className="font-bold">
            {item.receiver_name || item.receiver_mobile || item.receiver_email || item.receiver_instagram || "Unknown"}
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-2 mb-0.5 font-semibold">Message:</p>
        <p className="text-sm text-gray-600 mb-1">{item.message || "No message"}</p>
        <p className="text-xs text-gray-400 mt-1">
          {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="flex items-center justify-between pt-9 px-2 mb-2">
        <button onClick={() => navigate(-1)} className="p-1 text-white text-2xl">
          {"<"}
        </button>
        <h1 className="text-lg font-bold text-white flex-1 text-center">Izhaar Tracker</h1>
        <div className="w-9" />
      </div>
      
      <div className="p-4">
        {loading && allCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-base font-semibold text-gray-400">Loading...</p>
          </div>
        ) : allCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-base font-semibold text-gray-400">No Izhaar found</p>
          </div>
        ) : (
          allCodes.map((item) => renderCodeItem(item))
        )}
      </div>
    </div>
  );
}