function DesktopFooter() {
  return (
    <footer className="hidden md:block w-full bg-black border-t border-gray-800 pt-10 pb-4 text-white">
      <div className="max-w-6xl mx-auto flex flex-row flex-wrap justify-between gap-8 px-8">
        {/* Left: Logo, desc, contact, socials */}
        <div className="flex flex-col max-w-xs">
          {/* <img src={logoImg} alt="Izhaar Logo" /> */}
          <div className="mb-3 text-gray-200">Your feelings deserve to be heard. Don’t let love slip away in silence.</div>
          <div className="mb-1 text-gray-300 font-medium">+91 7075871167</div>
          <div className="mb-3 text-gray-300 font-medium">Email: support@izhaarlove.com</div>
          <div className="flex flex-row gap-4 mt-2">
            {/* Facebook */}
            <a href="#" className="hover:text-pink-400" aria-label="Facebook">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* Twitter */}
            <a href="#" className="hover:text-pink-400" aria-label="Twitter">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="hover:text-pink-400" aria-label="Instagram">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="hover:text-pink-400" aria-label="LinkedIn">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
        {/* Center: Navigation */}
        <div className="flex flex-col gap-2 min-w-[160px]">
          <div className="text-lg font-semibold mb-2">Navigation</div>
          <a href="#" className="hover:text-pink-400">Home</a>
          <a href="#" className="hover:text-pink-400">Services</a>
          <a href="#" className="hover:text-pink-400">About us</a>
          <a href="#" className="hover:text-pink-400">Features</a>
          <a href="#" className="hover:text-pink-400">Testimonials</a>
        </div>
        {/* Right: Legal */}
        <div className="flex flex-col gap-2 min-w-[180px]">
          <div className="text-lg font-semibold mb-2">Legal</div>
          <a href="policy.html" className="hover:text-pink-400">Privacy policy</a>
          <a href="policy.html" className="hover:text-pink-400">Cancellation and refund</a>
          <a href="policy.html" className="hover:text-pink-400">Terms and conditions</a>
          <a href="policy.html" className="hover:text-pink-400">Shipping and delivery</a>
          <a href="policy.html" className="hover:text-pink-400">Contact Us</a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-8">&copy; {new Date().getFullYear()} Izhaar. All rights reserved.</div>
    </footer>
  );
}
// Desktop navigation links
const NAV_LINKS = [
  { label: 'Home', to: '/user/dashboard' },
  { label: 'Confession', to: '/user/confession' },
  { label: 'Chat', to: '/user/chat' },
  { label: 'Profile', to: '/user/profile' },
];

function DesktopHeader({ notifCount, navigate, notifImg, logoImg }) {
  return (
    <div className="hidden md:flex flex-row items-center justify-between px-10 pt-6 pb-2 bg-black w-full">
      <div className="flex flex-row items-center">
        <img src={logoImg} alt="Logo" className="w-20 h-16 object-contain mr-4" />
        <span className="text-4xl font-logo text-gradient bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent select-none">Izhaar</span>
      </div>
      <nav className="flex flex-row gap-10">
        {NAV_LINKS.map(link => (
          <button
            key={link.label}
            onClick={() => navigate(link.to)}
            className="text-white text-base font-normal hover:text-pink-400 transition"
          >
            {link.label}
          </button>
        ))}
      </nav>
      <div className="relative flex flex-row items-center">
        <button onClick={() => navigate('/user/notifications')} className="relative">
          <img src={notifImg} alt="Notifications" className="w-7 h-7" />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center text-white text-xs font-bold z-10">{notifCount}</span>
          )}
        </button>
      </div>
    </div>
  );
}
// app/user/dashboard.js

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import logoImg from '../../assets/images/logo.png';
import notifImg from '../../assets/images/notification.png';
import homeImg from '../../assets/images/home.png';
import confessionImg from '../../assets/images/confession.png';
import chatImg from '../../assets/images/chat.png';
import profileImg from '../../assets/images/profile.png';

export default function UserDashboard() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let intervalId;
    let userMobile = null;
    const fetchProfileAndNotif = async (isInitial = false) => {
      if (isInitial) setNotifLoading(true);
      try {
        if (isInitial || !userMobile) {
          const profileRes = await api.get("/profile/me");
          const profileData = profileRes.data.profile || profileRes.data;
          setUsername(profileData.username || profileData.name || "User");
          userMobile = profileData.mobile;
        }
        if (!userMobile) {
          setNotifCount(0);
          if (isInitial) setNotifLoading(false);
          return;
        }
        const notifRes = await api.get(`/notification/izhaar/${userMobile}`);
        const notifs = Array.isArray(notifRes.data?.izhaar) ? notifRes.data.izhaar : [];
        setNotifCount((prev) => notifs.length);
      } catch (e) {
        setNotifCount(0);
      } finally {
        if (isInitial) setNotifLoading(false);
      }
    };
    fetchProfileAndNotif(true);
    intervalId = setInterval(() => fetchProfileAndNotif(false), 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* DESKTOP/LAPTOP HEADER */}
      <DesktopHeader notifCount={notifCount} navigate={navigate} notifImg={notifImg} logoImg={logoImg} />

      {/* MOBILE HEADER */}
      <div className="flex md:hidden flex-row items-center justify-between px-5 pt-12 pb-4 bg-black">
        <div className="flex flex-row items-center">
          <img src={logoImg} alt="Logo" className="w-14 h-14 mr-2 object-contain" />
        </div>
        <div className="relative flex flex-row items-center">
          <button onClick={() => navigate(IZHAAR_NOTIFICATION)} className="relative">
            <img src={notifImg} alt="Notifications" className="w-6 h-6" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center text-white text-xs font-bold z-10">{notifCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-5 pt-8 text-white">
        <div className="text-3xl font-bold mb-1">Hello, {username}</div>
        <div className="text-base mb-8">Welcome on Izhaar Platform</div>
      </div>

      {/* DESKTOP/LAPTOP FOOTER */}
      <DesktopFooter
        navigate={navigate}
        homeImg={homeImg}
        confessionImg={confessionImg}
        chatImg={chatImg}
        profileImg={profileImg}
      />

      {/* MOBILE FOOTER (hidden on md+) */}
      <div className="flex md:hidden flex-row justify-around py-3 border-t border-gray-700 mb-10 mx-2 rounded-xl bg-gradient-to-r from-pink-400/60 via-purple-300/60 via-blue-200/60 to-yellow-300/60">
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/user/dashboard')}>
          <img src={homeImg} alt="Home" className="w-12 h-12 object-contain mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/user/confession')}>
          <img src={confessionImg} alt="Confession" className="w-12 h-12 object-contain mb-1" />
          <span className="text-xs font-medium">Confession</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/user/chat')}>
          <img src={chatImg} alt="Chat" className="w-12 h-12 object-contain mb-1" />
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/user/profile')}>
          <img src={profileImg} alt="Profile" className="w-12 h-12 object-contain mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}


