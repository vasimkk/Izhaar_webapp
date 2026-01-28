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
  const images = [
    { src: F1, title: 'Red Rose Bouquet', price: '₹499', originalPrice: '₹699' },
    { src: F2, title: 'Mixed Flowers', price: '₹599', originalPrice: '₹799' },
    { src: F3, title: 'Purple Elegance', price: '₹549', originalPrice: '₹749' },
    { src: F4, title: 'Premium Roses', price: '₹649', originalPrice: '₹899' },
    { src: F5, title: 'Sunflower Delight', price: '₹429', originalPrice: '₹629' },
    { src: F6, title: 'Cherry Blossom', price: '₹499', originalPrice: '₹699' },
    { src: F7, title: 'Lavender Dreams', price: '₹579', originalPrice: '₹779' },
    { src: F8, title: 'Romantic Red', price: '₹699', originalPrice: '₹899' },
    { src: F9, title: 'Spring Garden', price: '₹529', originalPrice: '₹729' },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = () => {
    setCartItems([...cartItems, selectedImage]);
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-scale-up {
          animation: scaleUp 0.5s ease-out forwards;
        }

        .modal-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .product-card {
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-8px);
        }
      `}</style>

      {/* Enhanced Header Section */}
      <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-6 md:py-10 px-4 md:px-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="animate-slide-in flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">🎁 Izhaar Gifts</h1>
              <p className="text-xs sm:text-sm md:text-base opacity-90">
                Express your feelings with perfect gifts
              </p>
            </div>
            <div className="animate-slide-in-right">
              <button className="bg-white/20 backdrop-blur-md text-white px-3 md:px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base whitespace-nowrap">
                🛒 Cart
                {cartItems.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{cartItems.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        <div className="text-center mb-8 md:mb-12 animate-slide-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Our Exquisite Collection
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Each flower is carefully selected to help you express your deepest emotions with elegance and grace.
          </p>
        </div>

        {/* Product Grid */}
        {/* Mobile Back Button */}
        <button
          onClick={() => navigate("/user/dashboard")}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(212, 197, 232, 0.3)',
            boxShadow: '0 4px 12px rgba(45, 27, 78, 0.15)'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 text-[#2D1B4E]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {images.map((product, index) => (
            <div
              key={index}
              className="product-card bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/60 shadow-lg hover:shadow-2xl hover:bg-white/60 cursor-pointer group flex flex-col"
              onClick={() => setSelectedImage(product)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={product.src}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white text-pink-500 px-6 py-2 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all">
                    View Details
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 flex flex-col flex-grow">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{product.title}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                  <span className="text-xs text-gray-600 ml-1">(42)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-pink-600">{product.price}</span>
                    <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                  <span className="text-xs font-semibold text-green-600">Save 28%</span>
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(product);
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm mt-auto"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>


        <br></br>
        <hr></hr>
        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '💐', title: 'Premium Quality', desc: 'Hand-picked flowers fresh daily' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'Delivered within 24 hours' },
            { icon: '💝', title: 'Special Packaging', desc: 'Beautiful gift wrapping included' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/60 text-center hover:bg-white/60 transition-all duration-300">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Modal - Stacked on Mobile, Side-by-Side on Desktop */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-slide-in">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-sm md:max-w-5xl overflow-hidden border border-white/30 transform transition-all duration-300 modal-slide-in max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 text-lg font-bold"
            >
              ✕
            </button>

            {/* Two Column Layout - Stacks on Mobile */}
            <div className="flex flex-col md:flex-row h-full max-h-[calc(90vh-0px)]">
              {/* Left Side - Image */}
              <div className="w-full md:w-1/2 relative overflow-hidden bg-gray-100 aspect-square md:aspect-auto flex items-center justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Side - Details */}
              <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[calc(90vh-0px)] md:max-h-full">
                {/* Header */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 pr-6">{selectedImage.title}</h2>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-lg md:text-xl">★</span>)}
                    <span className="ml-2 text-gray-600 font-semibold text-sm">(124 Reviews)</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                    This is a beautiful and exquisite flower arrangement perfect for expressing your deepest emotions and feelings. Handpicked from our premium collection.
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-pink-500 text-lg">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">Premium quality flowers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-500 text-lg">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">Free premium packaging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-500 text-lg">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">Same day delivery available</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA Buttons */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-3xl md:text-4xl font-bold text-pink-600">{selectedImage.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 line-through">{selectedImage.originalPrice}</p>
                      <p className="text-sm md:text-base font-bold text-green-600">Save 28%</p>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mb-2 text-sm md:text-base"
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    className="w-full px-4 md:px-6 py-2.5 md:py-3 border-2 border-pink-500 text-pink-500 rounded-full font-semibold hover:bg-pink-50 transition-all duration-300 text-sm md:text-base"
                    onClick={() => setSelectedImage(null)}
                  >
                    Close
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