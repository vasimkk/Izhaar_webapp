import React, { useState } from "react";
import { PaymentDetails, ChatDetails } from "./AdminSections";
import { UserManagement } from "./UserManagement";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
export default function AdminHome() {
  const [selectedSection, setSelectedSection] = useState("user");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        // ignore
      }
      await auth.clearAuth();
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    } catch (e) {
      // ignore
    }
  };

  let SectionComponent = null;
  if (selectedSection === "user") SectionComponent = <UserManagement />;
  else if (selectedSection === "payment") SectionComponent = <PaymentDetails />;
  else if (selectedSection === "chat") SectionComponent = <ChatDetails />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside
        className="w-full md:w-64 bg-pink-600 text-white flex flex-row md:flex-col py-4 md:py-8 px-2 md:px-4 shadow-lg md:h-auto h-20 md:h-auto fixed md:static top-0 left-0 z-20"
        style={{ minHeight: "auto" }}
      >
        <h2 className="hidden md:block text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <nav className="flex flex-1 flex-row md:flex-col gap-2 md:gap-4 w-full items-center md:items-stretch justify-center md:justify-start">
          <button
            className={`flex-1 md:flex-none text-center md:text-left hover:bg-pink-700 rounded-lg px-2 md:px-4 py-2 font-semibold transition text-xs md:text-base ${selectedSection === "user" ? "bg-pink-700" : ""}`}
            onClick={() => setSelectedSection("user")}
          >
            User Management
          </button>
          <button
            className={`flex-1 md:flex-none text-center md:text-left hover:bg-pink-700 rounded-lg px-2 md:px-4 py-2 font-semibold transition text-xs md:text-base ${selectedSection === "payment" ? "bg-pink-700" : ""}`}
            onClick={() => setSelectedSection("payment")}
          >
            Payment Details
          </button>
          <button
            className={`flex-1 md:flex-none text-center md:text-left hover:bg-pink-700 rounded-lg px-2 md:px-4 py-2 font-semibold transition text-xs md:text-base ${selectedSection === "chat" ? "bg-pink-700" : ""}`}
            onClick={() => setSelectedSection("chat")}
          >
            Chat Details
          </button>
        </nav>
        <button
          className="mt-0 md:mt-8 w-full bg-white text-pink-600 hover:bg-pink-100 font-bold py-2 px-4 rounded-lg transition text-xs md:text-base border border-pink-200"
          onClick={handleLogout}
          style={{ marginLeft: '0', marginTop: '0.5rem' }}
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main
        className="flex-1 flex flex-col items-center justify-center p-2 md:p-8 mt-20 md:mt-0 ml-0 md:ml-64"
        style={{ minHeight: "calc(100vh - 5rem)" }}
      >
        <div className="w-full max-w-4xl">
          {SectionComponent}
        </div>
      </main>
    </div>
  );
}
