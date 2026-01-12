import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";

import logoImg from '../../assets/images/logo.png';
import notifImg from '../../assets/images/notification.png';
import homeImg from '../../assets/images/home.png';
import confessionImg from '../../assets/images/confession.png';
import chatImg from '../../assets/images/chat.png';
import profileImg from '../../assets/images/profile.png';
const bg =
  "https://res.cloudinary.com/df5jbm55b/video/upload/f_auto,q_auto/theme_1_zzu3gm.mp4";

// Desktop sidebar navigation
function DesktopSidebar({ navigate, activeRoute, homeImg, confessionImg, chatImg, profileImg, logoImg }) {
  const sidebarLinks = [
    { id: 'home', label: 'Home', to: '/user/dashboard', icon: homeImg },
    { id: 'confession', label: 'Confession', to: '/user/confession', icon: confessionImg },
    { id: 'chat', label: 'Chat', to: '/user/chat-interface', icon: chatImg },
    { id: 'profile', label: 'Profile', to: '/user/profile', icon: profileImg },
    { id: 'explore', label: 'Explore', to: '/' },
  ];

  const getActiveLink = (path) => {
    if (path === '/') return activeRoute === '/';
    if (path === '/user/dashboard') return activeRoute === '/user/dashboard';
    return activeRoute.includes(path);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/60 backdrop-blur-xl border border-[#E91E63]/20 shadow-2xl rounded-3xl fixed left-4 top-4 bottom-4 pb-8 px-4 z-20">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center py-2">
        <img src={logoImg} alt="Logo" className="w-20 h-20 object-contain" />
      </div>
      
      <nav className="flex flex-col gap-2">
        {sidebarLinks.map(link => {
          const isActive = getActiveLink(link.to);
          return (
            <button
              key={link.id}
              onClick={() => navigate(link.to)}
              className={`flex flex-row items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-white/80 border border-[#E91E63]/50 shadow-md'
                  : 'hover:bg-white/40 border border-transparent'
              }`}
            >
              {link.icon && (
                <img 
                  src={link.icon} 
                  alt={link.label} 
                  className={`w-6 h-6 object-contain transition-transform group-hover:scale-110 ${
                    isActive ? 'brightness-125' : ''
                  }`} 
                />
              )}
              <span className={`text-base font-medium ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold' 
                  : 'text-[#2D1B4E] group-hover:text-[#E91E63]'
              }`}>
                {link.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      {/* Decorative gradient accent */}
      <div className="mt-auto">
        <div className="h-1 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-70"></div>
        <p className="text-xs text-[#6B5B8E] text-center mt-4">© {new Date().getFullYear()} Izhaar</p>
      </div>
    </aside>
  );
}

function DesktopHeader({ notifCount, navigate, notifImg, username }) {
  return (
    <div className="hidden md:flex fixed top-4 right-4 left-[18rem] z-10">
      <div className="flex w-full items-center justify-between gap-6 px-8 py-4 bg-white/60 backdrop-blur-xl border border-[#E91E63]/20 shadow-2xl rounded-3xl">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-[#2D1B4E]">Hello, {username}</span>
          <span className="text-sm text-[#6B5B8E]">Welcome to Izhaar Platform</span>
        </div>
        <div className="relative flex flex-row items-center">
          <button onClick={() => navigate('/user/notifications')} className="relative hover:scale-110 transition-transform">
            <img src={notifImg} alt="Notifications" className="w-7 h-7" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center text-white text-xs font-bold z-10">{notifCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileHeader({ notifCount, navigate, logoImg, notifImg }) {
  return (
    <div className="flex md:hidden flex-row items-center justify-between px-5 py-4 fixed top-3 left-3 right-3 z-30 bg-white/60 backdrop-blur-xl border border-[#E91E63]/20 shadow-lg rounded-2xl">
      <div className="flex flex-row items-center gap-3">
        <img src={logoImg} alt="Logo" className="w-14 h-14 object-contain" />
      </div>
      <div className="relative flex flex-row items-center">
        <button onClick={() => navigate('/user/notifications')} className="relative hover:scale-110 transition-transform">
          <img src={notifImg} alt="Notifications" className="w-7 h-7" />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center text-white text-xs font-bold z-10">{notifCount}</span>
          )}
        </button>
      </div>
    </div>
  );
}

function MobileFooter({ navigate, activeRoute, homeImg, confessionImg, chatImg, profileImg }) {
  const navItems = [
    { label: 'Home', to: '/user/dashboard', icon: homeImg },
    { label: 'Confession', to: '/user/confession', icon: confessionImg },
    { label: 'Chat', to: '/user/chat-interface', icon: chatImg },
    { label: 'Profile', to: '/user/profile', icon: profileImg },
   

  ];

  const getActiveLink = (path) => {
    if (path === '/') return activeRoute === '/';
    if (path === '/user/dashboard') return activeRoute === '/user/dashboard';
    return activeRoute.includes(path);
  };

  return (
    <div className="flex md:hidden flex-row justify-around py-3 px-3 fixed bottom-3 left-3 right-3 bg-white/60 backdrop-blur-xl border border-[#E91E63]/20 rounded-2xl shadow-xl z-20">
      {navItems.map(item => (
        <button 
          key={item.label}
          onClick={() => navigate(item.to)}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
            getActiveLink(item.to) 
              ? 'bg-white/80 border border-[#E91E63]/50 shadow-md' 
              : 'hover:bg-white/40'
          }`}
        >
          {item.icon && <img src={item.icon} alt={item.label} className="w-8 h-8 object-contain" />}
          <span className={`text-xs font-medium ${getActiveLink(item.to) ? 'text-[#E91E63]' : 'text-[#2D1B4E]'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function UserLayout({ children, showHeader = true, backgroundClass = "", style = {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let intervalId;
    let userMobile = null;
    
    const fetchProfileAndNotif = async (isInitial = false) => {
      try {
        if (isInitial || !userMobile) {
          const profileRes = await api.get("/profile/me");
          const profileData = profileRes.data.profile || profileRes.data;
          setUsername(profileData.username || profileData.name || "User");
          userMobile = profileData.mobile;
        }
        if (!userMobile) {
          setNotifCount(0);
          return;
        }
        const notifRes = await api.get(`/notification/izhaar/${userMobile}`);
        const notifs = Array.isArray(notifRes.data?.izhaar) ? notifRes.data.izhaar : [];
        setNotifCount(notifs.length);
      } catch (e) {
        setNotifCount(0);
      }
    };
    
    fetchProfileAndNotif(true);
    intervalId = setInterval(() => fetchProfileAndNotif(false), 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div 
      className={`min-h-screen flex flex-col md:flex-row relative overflow-hidden ${backgroundClass}`}
      style={style}
    >
      {/* Light Gradient Background */}
      <div 
        className="fixed inset-0 -z-20"
        style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)'
        }}
      >
        {/* Animated gradient overlay for depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(233, 30, 99, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(156, 39, 176, 0.06) 0%, transparent 50%)'
          }}
        />
      </div>

      {/* Animated floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(25)].map((_, i) => {
          const colors = [
            { fill: 'rgba(233, 30, 99, 0.7)', stroke: 'rgba(233, 30, 99, 0.5)' },
            { fill: 'rgba(156, 39, 176, 0.7)', stroke: 'rgba(156, 39, 176, 0.5)' },
            { fill: 'rgba(255, 87, 34, 0.7)', stroke: 'rgba(255, 87, 34, 0.5)' },
            { fill: 'rgba(244, 67, 54, 0.7)', stroke: 'rgba(244, 67, 54, 0.5)' },
            { fill: 'rgba(236, 64, 122, 0.7)', stroke: 'rgba(236, 64, 122, 0.5)' },
          ];
          const colorIndex = i % colors.length;
          const color = colors[colorIndex];
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${40 + Math.random() * 80}px`,
                height: `${40 + Math.random() * 80}px`,
                opacity: 0.6,
                animation: `continuousFloat ${6 + Math.random() * 8}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                left: `${Math.random() * 100}%`,
                bottom: '-150px'
              }}
            >
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 4px 8px ${color.stroke})` }}>
                <path
                  d="M50,85 C20,70 5,55 5,40 C5,25 15,15 25,15 C35,15 45,25 50,35 C55,25 65,15 75,15 C85,15 95,25 95,40 C95,55 80,70 50,85 Z"
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth="2"
                />
              </svg>
            </div>
          );
        })}
      </div>
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar 
        navigate={navigate}
        activeRoute={location.pathname}
        homeImg={homeImg}
        confessionImg={confessionImg}
        chatImg={chatImg}
        profileImg={profileImg}
        logoImg={logoImg}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col flex-1 md:ml-[18rem] min-h-screen relative z-10">
        {/* DESKTOP HEADER - Only show if showHeader is true */}
        {showHeader && (
          <DesktopHeader 
            notifCount={notifCount} 
            navigate={navigate} 
            notifImg={notifImg} 
            username={username} 
          />
        )}

        {/* MOBILE HEADER - Only show if showHeader is true */}
        {showHeader && (
          <MobileHeader 
            notifCount={notifCount} 
            navigate={navigate} 
            logoImg={logoImg} 
            notifImg={notifImg} 
          />
        )}

        {/* PAGE CONTENT - Proper spacing for fixed header */}
        <main className={`flex-1 w-full ${showHeader ? 'md:pt-24 pt-24' : 'pt-0'} pb-24 md:pb-8 overflow-x-hidden`}>
          {children}
        </main>

        {/* MOBILE FOOTER */}
        <MobileFooter 
          navigate={navigate}
          activeRoute={location.pathname}
          homeImg={homeImg}
          confessionImg={confessionImg}
          chatImg={chatImg}
          profileImg={profileImg}
        />
      </div>

      
    </div>
  );
}
