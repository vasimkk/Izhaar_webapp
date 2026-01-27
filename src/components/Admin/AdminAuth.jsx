import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUserShield, FaArrowRight } from "react-icons/fa";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { setAccessToken, setRefreshToken } from "../../utils/tokenStore";

const AdminAuth = () => {
    const [formData, setFormData] = useState({
        mobile: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("🚀 Admin HQ Entry attempt...");
        console.log("📍 API BaseURL:", api.defaults.baseURL);
        try {
            const res = await api.post("/auth/login-password", {
                username: formData.mobile,
                password: formData.password
            });
            console.log("✅ HQ Entry Response:", res.data);
            if (res.data.accessToken) {
                // Persistent storage (Cookies)
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);

                // Context updates
                if (auth?.setAccessToken) auth.setAccessToken(res.data.accessToken);
                if (auth?.setRefreshToken) await auth.setRefreshToken(res.data.refreshToken);
                if (auth?.setRole) auth.setRole("admin");

                console.log("🔓 HQ Entry Authorized. Redirecting...");
                navigate("/admin/dashboard");
            }
        } catch (err) {
            console.error("❌ HQ Entry Error:", err);
            alert(err.response?.data?.message || "HQ Entry Denied. Check connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcf8faff] flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)' }}>
            <div className="w-full max-w-md bg-white/70 backdrop-blur-3xl p-10 rounded-[3rem] border border-rose-100 shadow-[0_50px_100px_rgba(255,182,193,0.2)] animate-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-200 mb-6">
                        <FaUserShield className="text-3xl text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 font-serif italic">HQ Entry</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">Restricted Area Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-rose-400 uppercase tracking-widest ml-1">Mobile Access</label>
                        <input
                            type="tel"
                            placeholder="7075871167"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            className="w-full bg-white border border-rose-50 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-rose-300 transition-all text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-rose-400 uppercase tracking-widest ml-1">Security Cipher</label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter Protocol Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white border border-rose-50 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-rose-300 transition-all text-sm"
                                required
                            />
                            <FaLock className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-200" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center space-x-3 text-xs uppercase tracking-[0.2em]"
                    >
                        <span>{loading ? "Authorizing..." : "Authenticate Access"}</span>
                        <FaArrowRight className="text-xs" />
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-rose-50 text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Project Maintenance Protocol Active v2.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
