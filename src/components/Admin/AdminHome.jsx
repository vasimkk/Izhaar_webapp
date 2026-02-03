import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaChartLine, FaGamepad, FaHeart, FaMoneyBillWave, FaSignOutAlt, FaCogs, FaComments, FaMusic } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import AdminDashboard from "./AdminDashboard";
import { UserManagement } from "./UserManagement";
import AdminQuestions from "./AdminQuestions";
import { PaymentDetails, IzhaarMonitoring, ChatMonitoring } from "./AdminSections";
import AdminSongRequests from "./AdminSongRequests";

export default function AdminHome() {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      try { await api.post("/auth/logout"); } catch (err) { }
      await auth.clearAuth();
      navigate('/login', { replace: true });
    } catch (e) { }
  };

  const navItems = [
    { id: "dashboard", label: "Overview", icon: FaChartLine },
    { id: "songs", label: "Song Requests", icon: FaMusic },
    { id: "user", label: "Explorers", icon: FaUsers },
    { id: "quiz", label: "Quiz Quests", icon: FaGamepad },
    { id: "izhaar", label: "Izhaar Feed", icon: FaHeart },
    { id: "payment", label: "Revenue", icon: FaMoneyBillWave },
    { id: "chat", label: "Chambers", icon: FaComments },
  ];

  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard": return <AdminDashboard />;
      case "songs": return <AdminSongRequests />;
      case "user": return <UserManagement />;
      case "quiz": return <AdminQuestions />;
      case "payment": return <PaymentDetails />;
      case "izhaar": return <IzhaarMonitoring />;
      case "chat": return <ChatMonitoring />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8faff] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-rose-50 shadow-[20px_0_50px_rgba(0,0,0,0.02)] z-30 hidden lg:flex flex-col">
        <div className="p-10 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
            <FaCogs className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 font-serif italic">CRM Panel</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Admin Terminal</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSection(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${selectedSection === item.id
                ? "bg-rose-500 text-white shadow-xl shadow-rose-200"
                : "text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                }`}
            >
              <item.icon className={selectedSection === item.id ? "text-white" : "text-rose-300"} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-rose-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-slate-50 text-slate-400 font-black text-sm hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100"
          >
            <FaSignOutAlt />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/80 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-2xl border border-white z-50 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedSection(item.id)}
            className={`p-4 rounded-2xl transition-all ${selectedSection === item.id ? "bg-rose-500 text-white shadow-lg" : "text-slate-400"}`}
          >
            <item.icon />
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 sm:p-10 md:p-16 mb-24 lg:mb-0">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-slate-800 font-serif italic capitalize">{selectedSection.replace('-', ' ')}</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Project Maintenance Protocol Active</p>
            </div>
            <div className="hidden sm:flex items-center space-x-4 bg-white p-2 rounded-2xl border border-rose-50 shadow-sm">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 font-black">A</div>
              <div className="pr-4">
                <p className="text-[10px] font-black text-slate-800 uppercase">Super Admin</p>
                <p className="text-[9px] text-green-500 font-bold uppercase">Online Now</p>
              </div>
            </div>
          </header>

          {renderSection()}
        </div>
      </main>
    </div>
  );
}

