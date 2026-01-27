import React, { useEffect, useState } from "react";
import { FaHeart, FaMoneyBillWave, FaExternalLinkAlt, FaClock, FaCheckCircle, FaTimesCircle, FaComments } from "react-icons/fa";
import api from "../../utils/api";

export function PaymentDetails() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/admin/payments");
        if (res.data?.success) setPayments(res.data.payments || []);
      } catch (err) {
        console.error("Error fetching payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="p-10 text-center text-rose-500 font-bold animate-pulse font-serif italic text-2xl">Reconciling ledger...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-rose-100 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 font-serif italic">Transaction Stream</h3>
          <FaMoneyBillWave className="text-rose-400 text-2xl" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-rose-50">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reference</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Explorer</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50/50">
              {payments.map((p) => (
                <tr key={p?.id || Math.random()} className="group hover:bg-rose-50/30 transition-colors">
                  <td className="py-4 text-xs font-black text-slate-400 text-center font-mono">#{p?.payment_reference?.slice(-6) || 'N/A'}</td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{p?.user_name || 'Anonymous'}</span>
                      <span className="text-[10px] text-slate-400">{p?.mobile}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm font-black text-slate-800">${p?.payment_amount}</td>
                  <td className="py-4 text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full inline-block mt-3">{p?.service || 'System'}</td>
                  <td className="py-4 text-right">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${p?.credit_status === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                      p?.credit_status === 'FAILED' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                      {p?.credit_status || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function IzhaarMonitoring() {
  const [izhaars, setIzhaars] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("📸 Fetching Izhaar surveillance logs...");

      try {
        const izRes = await api.get("/admin/izhaars");
        if (izRes.data?.success) {
          setIzhaars(Array.isArray(izRes.data.izhaars) ? izRes.data.izhaars : []);
        }
      } catch (err) {
        console.error("❌ Izhaar Feed Error:", err.response?.status, err.response?.data || err.message);
      }

      try {
        const statsRes = await api.get("/admin/tracker/stats");
        if (statsRes.data?.success) {
          setStats(statsRes.data.stats);
        }
      } catch (err) {
        console.error("❌ Tracker Stats Error:", err.response?.status, err.response?.data || err.message);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-rose-500 font-bold animate-pulse font-serif italic text-2xl">Tracing connections...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats?.total || 0 },
          { label: 'Sent', value: stats?.sent || 0 },
          { label: 'Seen', value: stats?.seen || 0 },
          { label: 'Accepted', value: stats?.accepted || 0 },
          { label: 'Rejected', value: stats?.rejected || 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-rose-50 shadow-sm text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-rose-100 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 font-serif italic">Global Izhaar Feed</h3>
          <FaHeart className="text-rose-400 text-2xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {izhaars && izhaars.length > 0 ? izhaars.map((iz) => (
            <div key={iz?.id || Math.random()} className="p-6 bg-rose-50/30 rounded-3xl border border-rose-100/50 hover:border-rose-300 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-rose-100 flex items-center justify-center font-black text-rose-500 font-serif">
                    {iz?.izhaar_code?.[0] || 'I'}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest">{iz?.izhaar_code || '---'}</h5>
                    <p className="text-[10px] text-slate-400 font-medium">By {iz?.sender_name || 'Hidden Heart'}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${iz?.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                  iz?.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' :
                    iz?.status === 'SEEN' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-500'
                  }`}>
                  {iz?.status || 'SENT'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Secret Shared With</span>
                  <span className="text-slate-800 font-black truncate ml-2 text-right">{iz?.receiver_name || iz?.receiver_mobile || 'Anonymous'}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-100/50 flex items-center justify-between">
                <div className="flex items-center text-[10px] text-slate-400 font-medium italic">
                  <FaClock className="mr-2 opacity-50" />
                  {iz?.created_at ? new Date(iz.created_at).toLocaleString() : 'N/A'}
                </div>
                <button className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                  <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-slate-300 italic">No activity recorded in the global feed.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatMonitoring() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      console.log("🕵️ Opening surveillance channels...");
      const res = await api.get("/admin/chat/rooms");
      if (res.data?.success) {
        setRooms(Array.isArray(res.data.rooms) ? res.data.rooms : []);
      } else {
        setRooms([]);
      }
    } catch (err) {
      console.error("❌ Room Fetch Error:", err.response?.status, err.response?.data || err.message);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId) => {
    if (!roomId) return;
    setSelectedRoom(roomId);
    setLoadingMessages(true);
    setMessages([]);
    try {
      const res = await api.get(`/admin/chat/rooms/${roomId}/messages`);
      if (res.data?.success) {
        setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
      }
    } catch (err) {
      console.error("❌ Message Decrypt Error:", err.response?.status, err.response?.data || err.message);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-rose-500 font-bold animate-pulse font-serif italic text-2xl">Loading Secure Channels...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid lg:grid-cols-3 gap-8 h-[70vh]">
        {/* Rooms List */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-rose-100 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-rose-50">
            <h3 className="text-lg font-black text-slate-800 font-serif italic">Active Chambers</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{rooms?.length || 0} Channels Found</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {Array.isArray(rooms) && rooms.length > 0 ? rooms.map((room) => (
              <button
                key={room?.id || Math.random()}
                onClick={() => room?.chat_room_id && fetchMessages(room.chat_room_id)}
                className={`w-full p-5 rounded-3xl text-left transition-all border ${selectedRoom === room?.chat_room_id ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-rose-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${selectedRoom === room?.chat_room_id ? 'text-rose-100' : 'text-slate-400'}`}>Room #{room?.id || '---'}</span>
                  <span className={`text-[8px] font-bold ${selectedRoom === room?.chat_room_id ? 'text-rose-200' : 'text-slate-300'}`}>
                    {room?.last_message_time ? new Date(room.last_message_time).toLocaleDateString() : 'New'}
                  </span>
                </div>
                <h5 className="text-sm font-black font-serif italic truncate">{room?.sender_name || 'Exp 1'} & {room?.receiver_name || 'Exp 2'}</h5>
                <p className={`text-[10px] mt-1 truncate opacity-70 ${selectedRoom === room?.chat_room_id ? 'text-white' : 'text-slate-500'}`}>{room?.last_message || 'No messages yet'}</p>
              </button>
            )) : (
              <div className="p-10 text-center text-slate-300 italic text-sm">No chambers active yet.</div>
            )}
          </div>
        </div>

        {/* Message View */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-rose-100 shadow-xl overflow-hidden flex flex-col relative">
          {!selectedRoom ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 opacity-50">
              <FaComments className="text-6xl mb-4" />
              <p className="font-serif italic text-xl">Select a chamber to monitor</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-rose-50 bg-rose-50/20">
                <h3 className="text-lg font-black text-slate-800 font-serif italic">Secure Transcript</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Live Surveillance Protocol Active</p>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {loadingMessages ? (
                  <div className="text-center py-20 animate-pulse text-rose-300 italic">Decrypting transcript...</div>
                ) : (
                  Array.isArray(messages) && messages.length > 0 ? messages.map((m) => (
                    <div key={m?.id || Math.random()} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">{m?.sender_name || 'Explorer'}</span>
                        <span className="text-[8px] text-slate-300">{m?.created_at ? new Date(m.created_at).toLocaleTimeString() : 'N/A'}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 text-sm text-slate-700 leading-relaxed shadow-sm">
                        {m?.message || '---'}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 text-slate-300 italic">Empty channel. No data transmitted.</div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
