import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const RECEIVER_FORM_TEXT = '/user/receiver-for-text';
const Letter_IZHAAR = '/user/letter-izhaar';

const options = [
  {
    id: "online",
    title: "Online Izhaar",
    description: "Generate and send a digital Izhaar with an Izhaar code, ready to share instantly.",
    info: "Online Izhaar creates a digital letter using AI. You can share it via an Izhaar code or link so the recipient can read it inside the app.",
    target: '/user/online-izhaar',
  },
  {
    id: "offline",
    title: "Offline Izhaar",
    description: "Pick a template, personalize it, and download or print it to hand over in person.",
    info: "Offline Izhaar lets you choose a design, add your words, then export or print it. Perfect for in-person surprises.",
    target: '/user/offline-izhaar',
  },
];


export default function TypeOfIzhaar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [infoOption, setInfoOption] = useState(null);

  const handleInfo = (option) => {
    setInfoOption(option);
  };

  const handleSelect = (option) => {
    if (option.id === "online") {
      setShowMenu(true);
    } else {
      navigate(option.target);
    }
  };

  // Menu items for the big left menu
  const menuItems = [
    { label: 'Letter Izhaar', onClick: () => { setShowMenu(false); navigate(Letter_IZHAAR); } },
    { label: 'Simple Izhaar', onClick: () => { setShowMenu(false); navigate(RECEIVER_FORM_TEXT); } },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-12 px-2">
      <div className="w-full max-w-2xl flex flex-col items-center mb-10">
        <div className="text-4xl font-bold text-white mb-2 mt-8 text-center">Confession</div>
        <div className="text-2xl font-semibold text-white mb-4 text-center">How do you want to express?</div>
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {options.map((option) => (
          <div
            key={option.id}
            className="border border-red-400 rounded-xl p-8 flex flex-col items-center bg-black hover:shadow-lg transition cursor-pointer"
            onClick={() => handleSelect(option)}
            tabIndex={0}
            role="button"
            onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleSelect(option)}
          >
            <div className="text-2xl font-bold text-white mb-2 text-center">{option.title.replace('Izhaar', 'IZHAAR')}</div>
            <div className="text-gray-300 text-center mb-6 max-w-md">{option.description}</div>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-8 py-3 mt-2 w-full max-w-xs">Get started</button>
          </div>
        ))}
      </div>

      {/* Big Left Side Menu Modal */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex">
          {/* Left-side modal (full width on mobile, 400px on desktop) */}
          <div
            className="bg-gray-900 w-full max-w-full md:max-w-[340px] h-full flex flex-col px-8 py-10 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-6 left-6 text-white text-4xl font-bold focus:outline-none"
              onClick={() => setShowMenu(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="mt-2 mb-8 text-2xl font-bold text-white text-center">Online IZHAAR</div>
            <div className="flex flex-col gap-7 mt-8">
              <button
                className="flex items-center gap-4 text-white text-lg font-medium hover:bg-zinc-900 rounded-lg px-3 py-3 transition text-left"
                onClick={menuItems[0].onClick}
              >
                <span className="text-3xl">📨</span>
                <span>Letter wala izhaar</span>
              </button>
              <button
                className="flex items-center gap-4 text-white text-lg font-medium hover:bg-zinc-900 rounded-lg px-3 py-3 transition text-left"
                onClick={menuItems[1].onClick}
              >
                <span className="text-3xl">🎵</span>
                <span>Song wala izhaar</span>
              </button>
              <button
                className="flex items-center gap-4 text-white text-lg font-medium hover:bg-zinc-900 rounded-lg px-3 py-3 transition text-left"
                onClick={() => alert('Video wala izhaar coming soon!')}
              >
                <span className="text-3xl">🎬</span>
                <span>Video wala izhaar</span>
              </button>
              <button
                className="flex items-center gap-4 text-white text-lg font-medium hover:bg-zinc-900 rounded-lg px-3 py-3 transition text-left"
                onClick={() => alert('Safe date coming soon!')}
              >
                <span className="text-3xl">🍽️</span>
                <span>Safe date</span>
              </button>
            </div>
          </div>
          {/* Right: blurred overlay (click to close) */}
          <div
            className="flex-1 h-full bg-black bg-opacity-60 backdrop-blur-sm hidden md:block"
            onClick={() => setShowMenu(false)}
          />
        </div>
      )}

      {/* Info Modal (optional, for info button) */}
      {infoOption && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setInfoOption(null)}>
          <div className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="text-xl font-bold text-white mb-2">{infoOption.title}</div>
            <div className="text-gray-300 mb-4">{infoOption.info}</div>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 py-2" onClick={() => setInfoOption(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}


