import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import F1 from "../../../src/assets/Flowers/F1.jpg";
import F2 from "../../../src/assets/Flowers/F2.jpg";
import F3 from "../../../src/assets/Flowers/F3.jpg";
import F4 from "../../../src/assets/Flowers/F4.jpg";
import F5 from "../../../src/assets/Flowers/F5.jpg";
import F6 from "../../../src/assets/Flowers/F6.jpg";
import F7 from "../../../src/assets/Flowers/F7.jpg";
import F8 from "../../../src/assets/Flowers/F8.jpg";
import F9 from "../../../src/assets/Flowers/F9.jpg";

const Gifts = () => {
  const navigate = useNavigate();
  // Enhanced data to match the "Squad" vibe - added descriptions
  const images = [
    { src: F1, title: 'Red Rose Bouquet', desc: 'The classic symbol of deep love.', price: '₹499', originalPrice: '₹699' },
    { src: F2, title: 'Mixed Flowers', desc: 'A vibrant burst of joy.', price: '₹599', originalPrice: '₹799' },
    { src: F3, title: 'Purple Elegance', desc: 'Royalty and admiration combined.', price: '₹549', originalPrice: '₹749' },
    { src: F4, title: 'Premium Roses', desc: 'For those special moments.', price: '₹649', originalPrice: '₹899' },
    { src: F5, title: 'Sunflower Delight', desc: 'Radiation of pure happiness.', price: '₹429', originalPrice: '₹629' },
    { src: F6, title: 'Cherry Blossom', desc: 'Delicate beauty of spring.', price: '₹499', originalPrice: '₹699' },
    { src: F7, title: 'Lavender Dreams', desc: 'Soothing peace and grace.', price: '₹579', originalPrice: '₹779' },
    { src: F8, title: 'Romantic Red', desc: 'Passion in every petal.', price: '₹699', originalPrice: '₹899' },
    { src: F9, title: 'Spring Garden', desc: 'Freshness of a new beginning.', price: '₹529', originalPrice: '₹729' },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = () => {
    setCartItems([...cartItems, selectedImage]);
    alert('Added to cart!');
  };

  return (
    // Main Container - Updated Theme Background (Purple -> Indigo -> Blue)
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#581C87] via-[#312E81] to-[#1E3A8A] text-white relative overflow-hidden font-sans">

      {/* Background Glows/Waves */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

      {/* The "Wave" Line Effect behind cards */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EC4899] to-transparent opacity-40 blur-sm pointer-events-none transform -translate-y-1/2 scale-x-150"></div>
      <div className="absolute top-1/2 left-0 right-0 h-[300px] bg-gradient-to-r from-transparent via-[#581C87]/40 to-transparent blur-[100px] pointer-events-none transform -translate-y-1/2"></div>


      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.1); 
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(236, 72, 153, 0.2); /* Pink glow */
        }
      `}</style>

      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center bg-[#581C87]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/user/dashboard")} className="text-pink-200 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-wide">Izhaar Gifts</h1>
        </div>

        <button className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border border-white/10">
          <span>🛒</span>
          <span>Cart</span>
          {cartItems.length > 0 && (
            <span className="bg-[#EF4444] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </button>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-12 px-6 text-center z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Curated gifts for your <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[#EC4899] to-[#A855F7] bg-clip-text text-transparent">special moments.</span>
        </h2>
        <p className="text-pink-100/70 max-w-2xl mx-auto text-lg mb-10">
          Whether you need a full bouquet or just a single rose, we have everything you need to express your love.
        </p>

        {/* Virtual Bouquet Call to Action */}
        <div
          onClick={() => navigate('/user/bouquet')}
          className="max-w-4xl mx-auto glass-card rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 cursor-pointer group transition-all duration-500 hover:scale-[1.02] border-[#B72099]/30 relative overflow-hidden"
        >
          <div className="absolute top-4 right-6 bg-[#B72099] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">New Feature</div>
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-[2rem] flex items-center justify-center text-7xl md:text-8xl shadow-inner group-hover:scale-110 transition-transform duration-500">
            💐
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-4xl font-black mb-3">Send a Virtual Bouquet</h3>
            <p className="text-pink-100/60 text-base md:text-lg mb-6">Can't send physical flowers? Design your own digital bouquet with our new Bouquet Architect and send it instantly!</p>
            <div className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#B72099] to-[#801369] rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#B72099]/30 group-hover:shadow-[#B72099]/50 transition-all">
              Start Designing ➜
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 pb-24 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((product, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(product)}
              // Grid Item Container (Removed p-4, ensuring flex layout)
              className="glass-card rounded-[2rem] cursor-pointer transition-all duration-300 animate-card flex flex-col items-center text-center group overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container (Full width, White Background) */}
              <div className="w-full aspect-square bg-white relative overflow-hidden">
                <img
                  src={product.src}
                  alt={product.title}
                  className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay only on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium text-sm tracking-widest uppercase border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">View</span>
                </div>
              </div>

              {/* Text Info (Added padding here) */}
              <div className="w-full flex-1 flex flex-col items-center p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">{product.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2 opacity-80">{product.desc}</p>

                {/* Price */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-lg font-bold text-white">{product.price}</span>
                  <span className="text-xs text-pink-200 line-through">{product.originalPrice}</span>
                </div>

                {/* Styled Button - Pink -> Rose -> Red */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(product);
                  }}
                  className="mt-auto w-full py-3 rounded-full bg-gradient-to-r from-[#EC4899] via-[#F43F5E] to-[#EF4444] font-bold text-sm tracking-wide shadow-lg shadow-pink-900/40 hover:shadow-pink-700/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-[#1E3A8A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#312E81] border border-white/10 w-full max-w-4xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-card max-h-[90vh]">

            {/* Image Side - Changed bg-black to bg-white */}
            <div className="w-full md:w-1/2 h-96 md:h-auto bg-white relative flex items-center justify-center">
              <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-full object-contain" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 md:hidden"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 text-left flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedImage.title}</h2>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <span>★★★★★</span>
                    <span className="text-pink-200 ml-2">(124 verified reviews)</span>
                  </div>
                </div>
                <button onClick={() => setSelectedImage(null)} className="hidden md:block text-pink-200 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <p className="text-pink-100/80 leading-relaxed mb-6">
                {selectedImage.desc} Hand-wrapped with premium materials and delivered with care to ensure the moment is perfect.
              </p>

              <div className="space-y-3 mb-8">
                {['Premium Sourced', '24h Freshness Guarantee', 'Luxury Packaging'].map(feat => (
                  <div key={feat} className="flex items-center gap-3 text-sm text-pink-200/70">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</div>
                    {feat}
                  </div>
                ))}
              </div>

              <div className="mt-auto border-t border-white/10 pt-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-pink-200 mb-1">Total Price</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">{selectedImage.price}</span>
                      <span className="text-sm text-pink-300 line-through">{selectedImage.originalPrice}</span>
                    </div>
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold">SAVE 28%</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="col-span-2 py-4 rounded-xl bg-gradient-to-r from-[#EC4899] via-[#F43F5E] to-[#EF4444] text-white font-bold text-base hover:shadow-lg hover:shadow-pink-600/40 active:scale-[0.98] transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gifts;