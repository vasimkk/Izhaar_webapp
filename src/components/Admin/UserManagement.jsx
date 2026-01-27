import React, { useEffect, useState } from "react";
import { FaTrash, FaBan, FaCheckCircle, FaSearch, FaUserShield, FaInfoCircle, FaTimes, FaHeart, FaScroll, FaMoneyBillWave, FaComments } from "react-icons/fa";
import api from "../../utils/api";

const UserDetailsModal = ({ userId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/admin/user/${userId}`);
        if (res.data.success) setDetails(res.data.details);
      } catch (err) {
        console.error("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId]);

  if (loading) return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-pulse">
        <FaHeart className="text-4xl text-rose-500 mx-auto animate-bounce mb-4" />
        <p className="font-serif italic text-xl font-black text-slate-800">Unlocking Explorer Archives...</p>
      </div>
    </div>
  );

  if (!details) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="bg-[#fcf8faff] w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 sm:p-10 flex items-center justify-between border-b border-rose-100 bg-white">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-purple-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-xl shadow-rose-200">
              {details.profile?.name?.[0] || details.user.mobile?.[0] || 'U'}
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-serif italic">{details.profile?.name || "Anonymous Explorer"}</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{details.user.mobile} • Account ID: {details.user.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all">
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10">
          {/* Visual Profile Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {details.profile?.profile_photo ? (
              <div className="w-full md:w-64 aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shadow-rose-100 flex-shrink-0">
                <img
                  src={details.profile.profile_photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full md:w-64 aspect-square rounded-[2.5rem] bg-rose-50 border-4 border-white shadow-xl flex items-center justify-center flex-shrink-0">
                <FaUserShield className="text-6xl text-rose-200" />
              </div>
            )}

            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm">
                  <FaHeart className="text-rose-400 mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shared</p>
                  <p className="text-2xl font-black text-slate-800">{details.izhaars?.length || 0} Izhaars</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm">
                  <FaComments className="text-blue-400 mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chat Rooms</p>
                  <p className="text-2xl font-black text-slate-800">{details.stats.chatRooms}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm">
                  <FaMoneyBillWave className="text-green-400 mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
                  <p className="text-2xl font-black text-slate-800">${details.payments?.reduce((acc, p) => acc + Number(p.payment_amount || 0), 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm">
                  <FaScroll className="text-amber-400 mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Agreement</p>
                  <p className={`text-sm font-black uppercase tracking-widest ${details.agreement?.agreed ? 'text-green-500' : 'text-rose-500'}`}>
                    {details.agreement?.agreed ? 'Authorized' : 'Pending'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-rose-50 space-y-4">
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between py-3 border-b border-rose-50 border-dashed">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Age / Gender</span>
                    <span className="text-sm font-bold text-slate-700">{details.profile?.age || "N/A"} / {details.profile?.gender || "Other"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-rose-50 border-dashed">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Nickname</span>
                    <span className="text-sm font-bold text-slate-700">{details.profile?.nickname || "No Nickname"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-rose-50 border-dashed">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Interested In</span>
                    <span className="text-sm font-bold text-slate-700">{details.profile?.interested_in || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-rose-50 border-dashed">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Email Contact</span>
                    <span className="text-sm font-bold text-slate-700 truncate ml-4 text-right overflow-hidden">{details.profile?.email || "No Email Provided"}</span>
                  </div>
                </div>
                <div className="pt-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 font-serif italic">The Manifesto</span>
                  <p className="text-sm text-slate-600 bg-rose-50/30 p-5 rounded-2xl italic leading-relaxed border border-rose-100/50">"{details.profile?.about || "This explorer travels in silence..."}"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Social Platforms */}
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em] pl-2 border-l-4 border-rose-400">Social Connections</h4>
              <div className="bg-white rounded-[2rem] p-8 border border-rose-50">
                {details.profile?.social_platforms ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(typeof details.profile.social_platforms === 'string' ? JSON.parse(details.profile.social_platforms) : details.profile.social_platforms).map(([platform, handle]) => (
                      <div key={platform} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{platform}</span>
                        <span className="text-sm font-bold text-slate-800">{handle || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-300 italic text-sm py-10">No social platforms linked.</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em] pl-2 border-l-4 border-purple-400">Shared Secrets (Izhaars)</h4>
              <div className="space-y-3">
                {details.izhaars?.length > 0 ? details.izhaars.slice(0, 4).map((iz) => (
                  <div key={iz.id} className="bg-white p-5 rounded-2xl border border-rose-50 flex justify-between items-baseline group hover:border-rose-300 transition-all">
                    <div>
                      <p className="text-[10px] font-black text-rose-500 tracking-widest uppercase">{iz.izhaar_code}</p>
                      <p className="text-xs font-bold text-slate-700 mt-1">Sent to: {iz.receiver_name || iz.receiver_mobile || 'Anonymous'}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">Status: <span className="text-purple-500">{iz.status}</span></p>
                    </div>
                    <span className="text-[9px] text-slate-300 font-bold">{new Date(iz.created_at).toLocaleDateString()}</span>
                  </div>
                )) : (
                  <div className="bg-white p-10 rounded-[2rem] border border-rose-50 text-center opacity-40 italic">
                    No secrets shared yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-8 sm:p-10 bg-white border-t border-rose-100 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Maintenance Session Secure • Izhaar v2.0</p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Download Data Export</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    try {
      const res = await api.post("/admin/user/status", { userId: user.id, status: newStatus });
      if (res.data.success) {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDeleteUser = async (userId, mobile) => {
    if (!window.confirm(`Permanently remove explorer ${mobile}?`)) return;
    setDeleting(true);
    try {
      await api.delete("auth/admin/delete-user", { data: { userId } });
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      alert("Removal failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.mobile?.includes(searchTerm) ||
    (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="p-10 text-center text-rose-500 font-bold animate-pulse font-serif italic text-2xl">Retrieving explorer logs...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Control Bar */}
      <div className="bg-white/60 p-4 rounded-3xl border border-rose-100 backdrop-blur-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search by mobile or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-none rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:ring-2 focus:ring-rose-100 transition-all text-sm"
          />
        </div>
        <div className="flex items-center space-x-2 bg-rose-50/50 p-1.5 rounded-2xl border border-rose-100">
          <span className="px-4 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">{users.length} Explorers Found</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white border border-rose-50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-rose-100/20 transition-all group relative overflow-hidden">
            {user.role === 'admin' && (
              <div className="absolute top-0 right-0 bg-amber-400 text-white px-6 py-1 rounded-bl-3xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                <FaUserShield /> Admin
              </div>
            )}

            <div className="flex items-center space-x-5 mb-8">
              {user.profile_photo ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white">
                  <img src={user.profile_photo} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg ${user.status === 'BLOCKED' ? 'bg-slate-400' : 'bg-gradient-to-br from-rose-400 to-rose-600'}`}>
                  {user.name?.[0] || user.mobile?.[0] || 'U'}
                </div>
              )}
              <div>
                <h4 className="text-xl font-serif italic font-black text-slate-800 leading-tight">
                  {user.name || "Anonymous Explorer"}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 mb-1">{user.mobile}</p>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${user.status === 'BLOCKED' ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-green-500'}`}>
                  {user.status || 'ACTIVE'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Verify Status</p>
                <p className="text-xs font-bold text-slate-700">{user.is_verified ? 'Authorized' : 'Pending'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined Date</p>
                <p className="text-xs font-bold text-slate-700">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserId(user.id)}
              className="w-full mb-4 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
            >
              <FaInfoCircle /> Inspect Explorer Details
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleStatus(user)}
                className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${user.status === 'BLOCKED' ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-slate-800 text-white hover:bg-rose-500'}`}
              >
                {user.status === 'BLOCKED' ? <><FaCheckCircle /> Restore</> : <><FaBan /> Restrict</>}
              </button>
              <button
                onClick={() => handleDeleteUser(user.id, user.mobile)}
                className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedUserId && (
        <UserDetailsModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  );
}